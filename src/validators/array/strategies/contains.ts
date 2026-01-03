/**
 * Array Contains Strategy
 * @module validators/array/strategies/contains
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/**
 * Contains value strategy
 */
export class ContainsStrategy<T> extends BaseValidationStrategy<T[], T[]> {
  readonly name = 'contains';

  constructor(
    private readonly searchValue: T,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: T[], context: ValidationContext): ValidationResult<T[]> {
    const found = value.some((item) => {
      if (typeof item === 'object' && typeof this.searchValue === 'object') {
        return JSON.stringify(item) === JSON.stringify(this.searchValue);
      }
      return item === this.searchValue;
    });

    if (!found) {
      return this.failure('array.contains', context, { value: this.searchValue });
    }
    return this.success(value, context);
  }
}
