/**
 * Same As Strategy
 * @module validators/comparison/strategies/same-as
 */

import { BaseValidationStrategy } from '@core/index';

import { getRefValue } from './helpers';

import type { FieldRef } from './helpers';
import type { ValidationContext, ValidationResult } from '#types/index';

/** Same as field strategy (alias for equalTo with field ref) */
export class SameAsStrategy<T> extends BaseValidationStrategy<T, T> {
  readonly name = 'sameAs';

  constructor(private readonly fieldPath: string) {
    super();
  }

  validate(value: T, context: ValidationContext): ValidationResult<T> {
    const ref: FieldRef = { $ref: this.fieldPath };
    const compare = getRefValue(ref, context);

    if (value !== compare) {
      return this.failure('comparison.sameAs', context, { field: this.fieldPath });
    }
    return this.success(value, context);
  }
}
