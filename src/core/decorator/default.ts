/**
 * Decorator Pattern - Default Decorator
 * Provides a default value when input is undefined or null
 * @module core/decorator
 */

import { createSuccessResult } from '../utils/results';

import { ValidatorDecorator } from './base-decorator';

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Provides a default value when input is undefined or null
 */
export class DefaultDecorator<TInput, TOutput> extends ValidatorDecorator<
  TInput | undefined | null,
  TOutput
> {
  constructor(
    wrapped: IValidator<TInput, TOutput>,
    private readonly defaultValue: TOutput,
  ) {
    super(wrapped as unknown as IValidator<TInput | undefined | null, TOutput>);
  }

  validate(
    value: TInput | undefined | null,
    context?: ValidationContext,
  ): ValidationResult<TOutput> {
    if (value === undefined || value === null) {
      return createSuccessResult(this.defaultValue);
    }
    return this.wrapped.validate(value as TInput, context);
  }
}
