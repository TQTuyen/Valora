/**
 * Array Unique Items Strategy
 * @module validators/array/strategies/unique
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/**
 * Unique items strategy
 */
export class UniqueArrayStrategy<T> extends BaseValidationStrategy<T[], T[]> {
  readonly name = 'unique';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: T[], context: ValidationContext): ValidationResult<T[]> {
    const seen = new Set<unknown>();
    for (const item of value) {
      const key = typeof item === 'object' ? JSON.stringify(item) : item;
      if (seen.has(key)) {
        return this.failure('array.unique', context);
      }
      seen.add(key);
    }
    return this.success(value, context);
  }
}
