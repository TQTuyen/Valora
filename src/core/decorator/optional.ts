/**
 * Decorator Pattern - Optional Decorator
 * Makes a validator optional (accepts undefined)
 * @module core/decorator
 */

import { createSuccessResult } from '../utils/results';

import { ValidatorDecorator } from './base-decorator';

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Makes a validator optional (accepts undefined)
 */
export class OptionalDecorator<TInput, TOutput> extends ValidatorDecorator<
  TInput | undefined,
  TOutput | undefined
> {
  constructor(wrapped: IValidator<TInput, TOutput>) {
    super(wrapped as unknown as IValidator<TInput | undefined, TOutput | undefined>);
  }

  validate(
    value: TInput | undefined,
    context?: ValidationContext,
  ): ValidationResult<TOutput | undefined> {
    if (value === undefined) {
      return createSuccessResult<TOutput | undefined>(undefined);
    }
    return this.wrapped.validate(value, context);
  }
}
