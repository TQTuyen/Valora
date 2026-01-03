/**
 * Integer Strategy
 * @module validators/number/strategies/integer
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Integer strategy */
export class IntegerStrategy extends BaseValidationStrategy<number, number> {
  readonly name = 'integer';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: number, context: ValidationContext): ValidationResult<number> {
    if (!Number.isInteger(value)) {
      return this.failure('number.integer', context);
    }
    return this.success(value, context);
  }
}
