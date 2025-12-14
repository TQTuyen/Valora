/**
 * Array Some Strategy
 * @module validators/array/strategies/some
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Some item must satisfy condition strategy
 */
export class SomeStrategy<T> extends BaseValidationStrategy<T[], T[]> {
  readonly name = 'some';

  constructor(private readonly predicate: (item: T, index: number) => boolean) {
    super();
  }

  validate(value: T[], context: ValidationContext): ValidationResult<T[]> {
    if (!value.some(this.predicate)) {
      return this.failure('array.some', context);
    }
    return this.success(value, context);
  }
}
