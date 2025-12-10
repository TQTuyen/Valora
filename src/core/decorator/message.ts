/**
 * Decorator Pattern - Message Decorator
 * Overrides error messages for a validator
 * @module core/decorator
 */

import { ValidatorDecorator } from './base-decorator';

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Overrides error messages for a validator
 */
export class MessageDecorator<TInput, TOutput> extends ValidatorDecorator<TInput, TOutput> {
  constructor(
    wrapped: IValidator<TInput, TOutput>,
    private readonly message: string,
  ) {
    super(wrapped);
  }

  validate(value: TInput, context?: ValidationContext): ValidationResult<TOutput> {
    const result = this.wrapped.validate(value, context);

    if (!result.success) {
      return {
        ...result,
        errors: result.errors.map((error) => ({
          ...error,
          message: this.message,
        })),
      };
    }

    return result;
  }
}
