/**
 * Decorator Pattern - Nullable Decorator
 * Makes a validator nullable (accepts null)
 * @module core/decorator
 */

import { createSuccessResult } from '../utils/results';

import { ValidatorDecorator } from './base-decorator';

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Makes a validator nullable (accepts null)
 */
export class NullableDecorator<TInput, TOutput> extends ValidatorDecorator<
  TInput | null,
  TOutput | null
> {
  constructor(wrapped: IValidator<TInput, TOutput>) {
    super(wrapped as unknown as IValidator<TInput | null, TOutput | null>);
  }

  validate(value: TInput | null, context?: ValidationContext): ValidationResult<TOutput | null> {
    if (value === null) {
      return createSuccessResult<TOutput | null>(null);
    }
    return this.wrapped.validate(value, context);
  }
}
