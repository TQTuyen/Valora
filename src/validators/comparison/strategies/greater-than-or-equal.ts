/**
 * Greater Than Or Equal Strategy
 * @module validators/comparison/strategies/greater-than-or-equal
 */

import { BaseValidationStrategy } from '@core/index';

import { getRefValue, isFieldRef } from './helpers';

import type { FieldRef } from './helpers';
import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Greater than or equal strategy */
export class GreaterThanOrEqualStrategy<T extends number | Date> extends BaseValidationStrategy<
  T,
  T
> {
  readonly name = 'greaterThanOrEqual';

  constructor(
    private readonly compareValue: T | FieldRef,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: T, context: ValidationContext): ValidationResult<T> {
    const compare = isFieldRef(this.compareValue)
      ? getRefValue(this.compareValue, context)
      : this.compareValue;

    const numValue = value instanceof Date ? value.getTime() : value;
    const numCompare = compare instanceof Date ? compare.getTime() : compare;

    if (typeof numValue !== 'number' || typeof numCompare !== 'number' || numValue < numCompare) {
      const fieldName = isFieldRef(this.compareValue) ? this.compareValue.$ref : String(compare);
      return this.failure('comparison.greaterThanOrEqual', context, { value: fieldName });
    }
    return this.success(value, context);
  }
}
