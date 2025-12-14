/**
 * Not Equal To Strategy
 * @module validators/comparison/strategies/not-equal-to
 */

import { BaseValidationStrategy } from '@core/index';

import { getRefValue, isFieldRef } from './helpers';

import type { FieldRef } from './helpers';
import type { ValidationContext, ValidationResult } from '#types/index';

/** Not equal to value or field strategy */
export class NotEqualToStrategy<T> extends BaseValidationStrategy<T, T> {
  readonly name = 'notEqualTo';

  constructor(private readonly compareValue: T | FieldRef) {
    super();
  }

  validate(value: T, context: ValidationContext): ValidationResult<T> {
    const compare = isFieldRef(this.compareValue)
      ? getRefValue(this.compareValue, context)
      : this.compareValue;

    if (value === compare) {
      const fieldName = isFieldRef(this.compareValue) ? this.compareValue.$ref : String(compare);
      return this.failure('comparison.notEqualTo', context, { value: fieldName });
    }
    return this.success(value, context);
  }
}
