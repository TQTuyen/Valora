/**
 * Boolean Is True Strategy
 * @module validators/boolean/strategies/is-true
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/**
 * Must be true strategy
 */
export class IsTrueStrategy extends BaseValidationStrategy<boolean, boolean> {
  readonly name = 'isTrue';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: boolean, context: ValidationContext): ValidationResult<boolean> {
    if (!value) {
      return this.failure('boolean.isTrue', context);
    }
    return this.success(value, context);
  }
}
