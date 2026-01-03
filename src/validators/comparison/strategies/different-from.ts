/**
 * Different From Strategy
 * @module validators/comparison/strategies/different-from
 */

import { BaseValidationStrategy } from '@core/index';

import { getRefValue } from './helpers';

import type { FieldRef } from './helpers';
import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Different from field strategy */
export class DifferentFromStrategy<T> extends BaseValidationStrategy<T, T> {
  readonly name = 'differentFrom';

  constructor(
    private readonly fieldPath: string,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: T, context: ValidationContext): ValidationResult<T> {
    const ref: FieldRef = { $ref: this.fieldPath };
    const compare = getRefValue(ref, context);

    if (value === compare) {
      return this.failure('comparison.differentFrom', context, { field: this.fieldPath });
    }
    return this.success(value, context);
  }
}
