/**
 * Between Strategy
 * @module validators/comparison/strategies/between
 */

import { BaseValidationStrategy } from '@core/index';

import { getRefValue, isFieldRef } from './helpers';

import type { FieldRef } from './helpers';
import type { ValidationContext, ValidationResult } from '#types/index';

/** Between range strategy (inclusive) */
export class BetweenStrategy<T extends number | Date> extends BaseValidationStrategy<T, T> {
  readonly name = 'between';

  constructor(
    private readonly minValue: T | FieldRef,
    private readonly maxValue: T | FieldRef,
  ) {
    super();
  }

  validate(value: T, context: ValidationContext): ValidationResult<T> {
    const min = isFieldRef(this.minValue) ? getRefValue(this.minValue, context) : this.minValue;
    const max = isFieldRef(this.maxValue) ? getRefValue(this.maxValue, context) : this.maxValue;

    const numValue = value instanceof Date ? value.getTime() : value;
    const numMin = min instanceof Date ? min.getTime() : min;
    const numMax = max instanceof Date ? max.getTime() : max;

    if (
      typeof numValue !== 'number' ||
      typeof numMin !== 'number' ||
      typeof numMax !== 'number' ||
      numValue < numMin ||
      numValue > numMax
    ) {
      return this.failure('comparison.between', context, {
        min: isFieldRef(this.minValue) ? this.minValue.$ref : String(min),
        max: isFieldRef(this.maxValue) ? this.maxValue.$ref : String(max),
      });
    }
    return this.success(value, context);
  }
}
