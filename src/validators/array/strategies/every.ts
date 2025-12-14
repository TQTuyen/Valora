/**
 * Array Every Strategy
 * @module validators/array/strategies/every
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Every item must satisfy condition strategy
 */
export class EveryStrategy<T> extends BaseValidationStrategy<T[], T[]> {
  readonly name = 'every';

  constructor(private readonly predicate: (item: T, index: number) => boolean) {
    super();
  }

  validate(value: T[], context: ValidationContext): ValidationResult<T[]> {
    if (!value.every(this.predicate)) {
      return this.failure('array.every', context);
    }
    return this.success(value, context);
  }
}
