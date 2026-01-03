/**
 * Base Validator Class
 * Provides the foundation for all type-specific validators
 * @module validators/common/base-validator
 */

import {
  DefaultDecorator,
  MessageDecorator,
  NullableDecorator,
  OptionalDecorator,
  PreprocessDecorator,
  StrategyHandler,
  TransformDecorator,
  ValidationPipeline,
} from '@core/index';
import { getI18n } from '@plugins/i18n/index';
import { createError, createFailureResult, createSuccessResult, measure } from '@utils/index';

import { CustomStrategy, RequiredStrategy } from './strategies/index';

import type { ValidationContext, ValidationResult } from '#types/results';
import type {
  IAsyncValidationStrategy,
  IValidationStrategy,
  IValidator,
  ValidationOptions,
} from '#types/validators';

/**
 * Abstract base class for all validators
 * Provides common functionality and fluent API methods
 *
 * @template TInput - Input type accepted by the validator
 * @template TOutput - Output type after validation/transformation
 *
 * @example
 * ```typescript
 * class StringValidator extends BaseValidator<unknown, string> {
 *   readonly _type = 'string';
 *
 *   protected clone(): StringValidator {
 *     const cloned = new StringValidator();
 *     cloned.strategies = [...this.strategies];
 *     return cloned;
 *   }
 *
 *   email(): this {
 *     return this.addStrategy(new EmailStrategy());
 *   }
 * }
 * ```
 */
export abstract class BaseValidator<TInput = unknown, TOutput = TInput> implements IValidator<
  TInput,
  TOutput
> {
  /** Type identifier for this validator */
  abstract readonly _type: string;

  /** Array of validation strategies (sync or async) */
  protected strategies: (
    | IValidationStrategy<TOutput, TOutput>
    | IAsyncValidationStrategy<TOutput, TOutput>
  )[] = [];

  /** Custom error message override */
  protected customMessage?: string;

  /** Whether this field is required */
  protected isRequired = false;

  /**
   * Get the strategies array (readonly)
   */
  get _strategies(): ReadonlyArray<IValidationStrategy<unknown, unknown>> {
    return this.strategies as unknown as ReadonlyArray<IValidationStrategy<unknown, unknown>>;
  }

  /**
   * Validate a value
   * @param value - Value to validate
   * @param context - Optional validation context
   * @returns Validation result
   */
  validate(value: TInput, context?: ValidationContext): ValidationResult<TOutput> {
    const ctx = context ?? this.createContext(value);
    const [result] = measure(() => this.executeValidation(value, ctx));
    return result;
  }

  /**
   * Check if a value is valid
   * @param value - Value to check
   * @returns true if valid
   */
  isValid(value: TInput): boolean {
    return this.validate(value).success;
  }

  /**
   * Make this validator optional (accepts undefined)
   * @returns New validator that accepts undefined
   */
  optional(): IValidator<TInput | undefined, TOutput | undefined> {
    return new OptionalDecorator(this as unknown as IValidator<TInput, TOutput>);
  }

  /**
   * Make this validator nullable (accepts null)
   * @returns New validator that accepts null
   */
  nullable(): IValidator<TInput | null, TOutput | null> {
    return new NullableDecorator(this as unknown as IValidator<TInput, TOutput>);
  }

  /**
   * Provide a default value when input is undefined/null
   * @param defaultValue - Default value to use
   * @returns New validator with default
   */
  default(defaultValue: TOutput): IValidator<TInput | undefined | null, TOutput> {
    return new DefaultDecorator(this as unknown as IValidator<TInput, TOutput>, defaultValue);
  }

  /**
   * Transform the output value
   * @param fn - Transformation function
   * @returns New validator with transformation
   */
  transform<U>(fn: (value: TOutput) => U): IValidator<TInput, U> {
    return new TransformDecorator(this as unknown as IValidator<TInput, TOutput>, fn);
  }

  /**
   * Preprocess the input value before validation
   * @param fn - Preprocessing function
   * @returns New validator that accepts the pre-processed input
   */
  preprocess<NewInput>(fn: (value: NewInput) => TInput): IValidator<NewInput, TOutput> {
    return new PreprocessDecorator(this as unknown as IValidator<TInput, TOutput>, fn);
  }

  /**
   * Add a custom validation message
   * @param message - Custom error message
   * @returns New validator with custom message
   */
  withMessage(message: string): IValidator<TInput, TOutput> {
    return new MessageDecorator(this as unknown as IValidator<TInput, TOutput>, message);
  }

  /**
   * Mark this field as required
   * @param options - Validation options (message, etc.)
   * @returns This validator for chaining
   */
  required(options?: ValidationOptions): this {
    this.isRequired = true;
    return this.addStrategy(new RequiredStrategy<TOutput>(options));
  }

  /**
   * Add a custom validation rule
   * @param validator - Custom validation function
   * @param message - Error message if validation fails
   * @param code - Error code (default: 'custom')
   * @returns This validator for chaining
   */
  custom(
    validator: (value: TOutput, context: ValidationContext) => boolean,
    message: string,
    code = 'common.custom',
  ): this {
    return this.addStrategy(new CustomStrategy(validator, message, code));
  }

  /**
   * Add a refinement that must pass
   * @param check - Refinement function
   * @param message - Error message
   * @returns This validator for chaining
   */
  refine(check: (value: TOutput) => boolean, message: string): this {
    return this.custom((value) => check(value), message, 'common.refine');
  }

  /**
   * Clone this validator
   * Subclasses must implement this to create a proper copy
   * @returns Cloned validator
   */
  protected abstract clone(): BaseValidator<TInput, TOutput>;

  /**
   * Add a strategy and return a cloned validator
   * @param strategy - Strategy to add
   * @returns Cloned validator with new strategy
   */
  protected addStrategy(
    strategy: IValidationStrategy<TOutput, TOutput> | IAsyncValidationStrategy<TOutput, TOutput>,
  ): this {
    const cloned = this.clone();
    cloned.strategies = [...this.strategies, strategy];
    cloned.isRequired = this.isRequired;
    if (this.customMessage !== undefined) {
      cloned.customMessage = this.customMessage;
    }
    return cloned as this;
  }

  /**
   * Execute validation through the pipeline
   * @param value - Value to validate
   * @param context - Validation context
   * @returns Validation result
   */
  protected executeValidation(
    value: TInput,
    context: ValidationContext,
  ): ValidationResult<TOutput> {
    // Type check first
    const typeResult = this.checkType(value, context);
    if (!typeResult.success) {
      return typeResult;
    }

    const typedValue = typeResult.data as TOutput;

    // If no strategies, return success
    if (this.strategies.length === 0) {
      return createSuccessResult(typedValue);
    }

    // Build and execute pipeline
    const pipeline = new ValidationPipeline<TOutput>();
    for (const strategy of this.strategies) {
      pipeline.addHandler(new StrategyHandler(strategy));
    }

    return pipeline.execute(typedValue, context);
  }

  /**
   * Check the type of the input value
   * Subclasses should override this to perform type-specific checks
   * @param value - Value to check
   * @param context - Validation context
   * @returns Validation result
   */
  protected checkType(_value: TInput, _context: ValidationContext): ValidationResult<TOutput> {
    // Default implementation - no type checking
    return createSuccessResult(_value as unknown as TOutput);
  }

  /**
   * Create validation context
   * @param _value - Value being validated (for reference)
   * @returns Validation context
   */
  protected createContext(_value: TInput): ValidationContext {
    return {
      path: [],
      field: '',
      locale: 'en',
    };
  }

  /**
   * Create a child context for nested validation
   * @param parentContext - Parent context
   * @param key - Key or index for the child
   * @returns Child context
   */
  protected createChildContext(
    parentContext: ValidationContext,
    key: string | number,
  ): ValidationContext {
    return {
      ...parentContext,
      path: [...parentContext.path, key],
      field: String(key),
    };
  }

  /**
   * Create a failure result
   * @param code - Error code
   * @param context - Validation context
   * @param params - Interpolation parameters
   * @returns Failure result
   */
  protected fail(
    code: string,
    context: ValidationContext,
    params?: Record<string, unknown>,
  ): ValidationResult<TOutput> {
    const i18n = getI18n();
    const message = this.customMessage ?? i18n.t(code, params);
    return createFailureResult<TOutput>([createError(code, message, [...context.path], params)]);
  }

  /**
   * Create a success result
   * @param value - Validated value
   * @param _context - Validation context (unused but kept for consistency)
   * @returns Success result
   */
  protected succeed(value: TOutput, _context: ValidationContext): ValidationResult<TOutput> {
    return createSuccessResult(value);
  }
}
