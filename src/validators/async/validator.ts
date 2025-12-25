/**
 * Async Validator
 * @module validators/async/validator
 */

import { createError } from '@core/index';

import { AsyncStrategy, DebounceStrategy, RetryStrategy, TimeoutStrategy } from './strategies';

import type {
  IAsyncValidationStrategy,
  IAsyncValidator,
  ValidationContext,
  ValidationResult,
} from '#types/index';

/**
 * Async validation function type
 */
export type AsyncValidationFn<TInput, TOutput = TInput> = (
  value: TInput,
  context: ValidationContext,
) => Promise<ValidationResult<TOutput>>;

/**
 * Retry configuration
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxAttempts: number;
  /** Initial delay in milliseconds */
  initialDelay?: number;
  /** Maximum delay in milliseconds */
  maxDelay?: number;
  /** Backoff multiplier */
  backoffMultiplier?: number;
}

/**
 * Async validator for promise-based validation
 *
 * Supports async validation functions with timeout, debouncing, retry logic,
 * and cancellation support.
 *
 * @example
 * ```typescript
 * const checkUsername = async.create(async (value: string) => {
 *   const response = await fetch(`/api/check-username/${value}`);
 *   const available = await response.json();
 *   return available
 *     ? { success: true, data: value, errors: [] }
 *     : { success: false, errors: [{ message: 'Username taken' }] };
 * }).debounce(300).timeout(5000);
 * ```
 */
export class AsyncValidator<TInput = unknown, TOutput = TInput> implements IAsyncValidator<
  TInput,
  TOutput
> {
  readonly _type = 'async';

  private strategies: IAsyncValidationStrategy<unknown, unknown>[] = [];
  private abortController: AbortController | undefined = undefined;
  private pendingPromise: Promise<ValidationResult<TOutput>> | undefined = undefined;
  private debounceTimeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

  /**
   * Validate value asynchronously
   * @param value - Value to validate
   * @param context - Validation context
   * @returns Promise of validation result
   */
  async validateAsync(
    value: TInput,
    context?: ValidationContext,
  ): Promise<ValidationResult<TOutput>> {
    const ctx = context ?? this.createContext(value);

    // Check if debounce strategy is present
    const debounceStrategy = this.strategies.find((s) => s.name === 'debounce') as
      | DebounceStrategy
      | undefined;

    if (debounceStrategy) {
      // Clear any pending debounce timeout
      if (this.debounceTimeoutId !== undefined) {
        clearTimeout(this.debounceTimeoutId);
      }

      // Return a promise that resolves after debounce delay
      return new Promise((resolve) => {
        this.debounceTimeoutId = setTimeout(async () => {
          this.debounceTimeoutId = undefined;
          const result = await this.executeValidation(value, ctx);
          resolve(result);
        }, debounceStrategy.debounceMs);
      });
    }

    return this.executeValidation(value, ctx);
  }

  /**
   * Execute validation (internal method)
   */
  private async executeValidation(
    value: TInput,
    ctx: ValidationContext,
  ): Promise<ValidationResult<TOutput>> {
    // Cancel any pending validation
    this.cancel();

    // Create new abort controller
    this.abortController = new AbortController();
    const abortController = this.abortController;

    try {
      // Execute async validation pipeline
      this.pendingPromise = this.executeAsyncValidation(value, ctx);
      const result = await this.pendingPromise;

      // Check if aborted
      if (abortController.signal.aborted) {
        const error = createError('async.cancelled', 'Validation cancelled', ctx.path, ctx.field);
        return {
          success: false,
          data: undefined,
          errors: [error],
        };
      }

      return result;
    } finally {
      this.pendingPromise = undefined;
    }
  }

  /**
   * Cancel pending validation
   */
  cancel(): void {
    if (this.abortController !== undefined) {
      this.abortController.abort();
      this.abortController = undefined;
    }
  }

  /**
   * Check if validation is currently pending
   */
  isPending(): boolean {
    return this.pendingPromise !== undefined;
  }

  /**
   * Wait for pending validation to complete
   */
  async waitForCompletion(): Promise<void> {
    if (this.pendingPromise !== undefined) {
      try {
        await this.pendingPromise;
      } catch {
        // Ignore errors, just wait for completion
      }
    }
  }

  // -------------------------------------------------------------------------
  // Fluent API - Async Strategies
  // -------------------------------------------------------------------------

  /**
   * Add async validation function
   * @param fn - Async validation function
   */
  async<R = TOutput>(fn: AsyncValidationFn<TOutput, R>): AsyncValidator<TInput, R> {
    const cloned = this.clone() as unknown as AsyncValidator<TInput, R>;
    cloned.addStrategy(
      new AsyncStrategy(fn) as unknown as IAsyncValidationStrategy<unknown, unknown>,
    );
    return cloned;
  }

  /**
   * Set timeout for async validation
   * @param ms - Timeout in milliseconds
   * @param message - Custom timeout message
   */
  timeout(ms: number, message?: string): this {
    return this.addStrategy(
      new TimeoutStrategy<TOutput>(ms, message) as unknown as IAsyncValidationStrategy<
        unknown,
        unknown
      >,
    );
  }

  /**
   * Debounce async validation
   * @param ms - Debounce delay in milliseconds
   */
  debounce(ms: number): this {
    return this.addStrategy(
      new DebounceStrategy<TOutput>(ms) as unknown as IAsyncValidationStrategy<unknown, unknown>,
    );
  }

  /**
   * Retry failed async validation
   * @param config - Retry configuration or max attempts
   */
  retry(config: RetryConfig | number): this {
    const retryConfig: RetryConfig = typeof config === 'number' ? { maxAttempts: config } : config;

    return this.addStrategy(
      new RetryStrategy<TOutput>(retryConfig) as unknown as IAsyncValidationStrategy<
        unknown,
        unknown
      >,
    );
  }

  // -------------------------------------------------------------------------
  // Internal Methods
  // -------------------------------------------------------------------------

  /**
   * Create validation context
   */
  private createContext(value: TInput): ValidationContext {
    return {
      path: [],
      field: '',
      locale: 'en',
      data: { value },
    };
  }

  /**
   * Clone this validator
   */
  private clone(): AsyncValidator<TInput, TOutput> {
    const cloned = new AsyncValidator<TInput, TOutput>();
    cloned.strategies = [...this.strategies];
    return cloned;
  }

  /**
   * Add strategy to this validator
   */
  private addStrategy(strategy: IAsyncValidationStrategy<unknown, unknown>): this {
    const cloned = this.clone() as this;
    cloned.strategies.push(strategy);
    return cloned;
  }

  /**
   * Execute async validation pipeline
   */
  private async executeAsyncValidation(
    value: TInput,
    context: ValidationContext,
  ): Promise<ValidationResult<TOutput>> {
    // Extract special strategies
    const timeoutStrategy = this.strategies.find((s) => s.name === 'timeout') as
      | TimeoutStrategy
      | undefined;
    const retryStrategy = this.strategies.find((s) => s.name === 'retry') as
      | RetryStrategy
      | undefined;

    // Get normal validation strategies (exclude timeout/debounce/retry)
    // Note: debounce is handled in validateAsync, not here
    const validationStrategies = this.strategies.filter(
      (s) => s.name !== 'timeout' && s.name !== 'debounce' && s.name !== 'retry',
    );

    // Create the base validation function
    const validateFn = async (): Promise<ValidationResult<TOutput>> => {
      try {
        let currentValue: unknown = value;

        for (const strategy of validationStrategies) {
          const result = await strategy.validate(currentValue, context);

          if (!result.success) {
            return result as ValidationResult<TOutput>;
          }

          currentValue = result.data;
        }

        return {
          success: true,
          data: currentValue as TOutput,
          errors: [],
        };
      } catch (error) {
        const err = createError(
          'async.failed',
          error instanceof Error ? error.message : 'Async validation failed',
          context.path,
          context.field,
        );
        return {
          success: false,
          data: undefined,
          errors: [err],
        };
      }
    };

    // Apply retry wrapper if present
    let wrappedValidateFn = validateFn;
    if (retryStrategy) {
      wrappedValidateFn = async () => {
        const config = retryStrategy.config;
        let lastError: Error | undefined;
        let attempt = 0;

        while (attempt < config.maxAttempts) {
          try {
            const result = await validateFn();
            if (result.success) {
              return result;
            }
            // If validation returned failure (not error), retry
            lastError = new Error(result.errors[0]?.message ?? 'Validation failed');
          } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');
          }

          attempt++;

          if (attempt < config.maxAttempts) {
            // Calculate delay with exponential backoff
            const delay = Math.min(
              (config.initialDelay || 100) * Math.pow(config.backoffMultiplier || 2, attempt - 1),
              config.maxDelay || 1000,
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }

        // All retries failed
        const err = createError(
          'async.retry.failed',
          lastError?.message ?? 'Validation failed after retries',
          context.path,
          context.field,
        );
        return {
          success: false,
          data: undefined,
          errors: [err],
        };
      };
    }

    // Debounce is handled in validateAsync, skip here

    // Apply timeout wrapper if present
    if (timeoutStrategy) {
      const timeoutMs = timeoutStrategy.timeoutMs;
      const timeoutMessage = timeoutStrategy.message;

      const timeoutPromise = new Promise<ValidationResult<TOutput>>((_, reject) => {
        setTimeout(() => {
          reject(new Error(timeoutMessage ?? `Validation timeout after ${timeoutMs.toString()}ms`));
        }, timeoutMs);
      });

      try {
        return await Promise.race([wrappedValidateFn(), timeoutPromise]);
      } catch (error) {
        const err = createError(
          'async.timeout',
          error instanceof Error ? error.message : 'Validation timeout',
          context.path,
          context.field,
        );
        return {
          success: false,
          data: undefined,
          errors: [err],
        };
      }
    }

    // No timeout, just run the validation
    return wrappedValidateFn();
  }
}

/**
 * Create an async validator
 * @param fn - Async validation function
 */
export function async<TInput = unknown, TOutput = TInput>(
  fn: AsyncValidationFn<TInput, TOutput>,
): AsyncValidator<TInput, TOutput> {
  const validator = new AsyncValidator<TInput, TInput>();
  const strategy = new AsyncStrategy<TInput, TOutput>(fn);
  validator['strategies'] = [strategy as unknown as IAsyncValidationStrategy<unknown, unknown>];
  return validator as unknown as AsyncValidator<TInput, TOutput>;
}
