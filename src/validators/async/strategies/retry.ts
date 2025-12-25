/**
 * Retry Strategy
 * @module validators/async/strategies/retry
 */

import { BaseAsyncValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Retry configuration
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxAttempts: number;
  /** Initial delay in milliseconds (default: 100) */
  initialDelay?: number;
  /** Maximum delay in milliseconds (default: 10000) */
  maxDelay?: number;
  /** Backoff multiplier (default: 2) */
  backoffMultiplier?: number;
}

/**
 * Retry strategy
 *
 * Retries failed async validation with exponential backoff.
 * Useful for handling transient network errors or rate limiting.
 */
export class RetryStrategy<T = unknown> extends BaseAsyncValidationStrategy<T, T> {
  readonly name = 'retry';

  readonly config: Required<RetryConfig>;

  constructor(config: RetryConfig) {
    super();
    this.config = {
      maxAttempts: config.maxAttempts,
      initialDelay: config.initialDelay ?? 100,
      maxDelay: config.maxDelay ?? 10000,
      backoffMultiplier: config.backoffMultiplier ?? 2,
    };
  }

  async validate(value: T, context: ValidationContext): Promise<ValidationResult<T>> {
    let lastError: Error | undefined;
    let delay = this.config.initialDelay;

    for (let attempt = 0; attempt < this.config.maxAttempts; attempt++) {
      try {
        // On first attempt, validate immediately
        if (attempt > 0) {
          await this.sleep(delay);
        }

        // Attempt validation (pass through)
        return this.success(value, context);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Validation failed');

        // Don't sleep after last attempt
        if (attempt < this.config.maxAttempts - 1) {
          // Calculate next delay with exponential backoff
          delay = Math.min(delay * this.config.backoffMultiplier, this.config.maxDelay);
        }
      }
    }

    // All attempts failed
    return this.failure(
      `Validation failed after ${this.config.maxAttempts.toString()} attempts: ${lastError?.message ?? 'Unknown error'}`,
      context,
    );
  }

  /**
   * Sleep for specified milliseconds
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
