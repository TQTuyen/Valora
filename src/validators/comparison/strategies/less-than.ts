/**
 * Less Than Strategy
 * @module validators/comparison/strategies/less-than
 */

import { BaseValidationStrategy } from '@core/index';

import { getRefValue, isFieldRef } from './helpers';

import type { FieldRef } from './helpers';
import type { ValidationContext, ValidationResult } from '#types/index';

/** Less than value or field strategy */
export class LessThanStrategy<T extends number | Date> extends BaseValidationStrategy<T, T> {
  readonly name = 'lessThan';

  constructor(private readonly compareValue: T | FieldRef) {
    super();
  }

  validate(value: T, context: ValidationContext): ValidationResult<T> {
    const compare = isFieldRef(this.compareValue)
      ? getRefValue(this.compareValue, context)
      : this.compareValue;

    const numValue = value instanceof Date ? value.getTime() : value;
    const numCompare = compare instanceof Date ? compare.getTime() : compare;

    if (typeof numValue !== 'number' || typeof numCompare !== 'number' || numValue >= numCompare) {
      const fieldName = isFieldRef(this.compareValue) ? this.compareValue.$ref : String(compare);
      return this.failure('comparison.lessThan', context, { value: fieldName });
    }
    return this.success(value, context);
  }
}
