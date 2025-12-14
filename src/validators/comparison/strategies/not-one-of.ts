/**
 * Not One Of Strategy
 * @module validators/comparison/strategies/not-one-of
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Not one of strategy */
export class NotOneOfStrategy<T> extends BaseValidationStrategy<T, T> {
  readonly name = 'notOneOf';

  constructor(private readonly forbiddenValues: T[]) {
    super();
  }

  validate(value: T, context: ValidationContext): ValidationResult<T> {
    if (this.forbiddenValues.includes(value)) {
      return this.failure('comparison.notOneOf', context, {
        values: this.forbiddenValues.join(', '),
      });
    }
    return this.success(value, context);
  }
}
