/**
 * Boolean Is True Strategy
 * @module validators/boolean/strategies/is-true
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Must be true strategy
 */
export class IsTrueStrategy extends BaseValidationStrategy<boolean, boolean> {
  readonly name = 'isTrue';

  constructor(message?: string) {
    super();
    if (message) {
      this.withMessage(message);
    }
  }

  validate(value: boolean, context: ValidationContext): ValidationResult<boolean> {
    if (!value) {
      return this.failure('boolean.isTrue', context);
    }
    return this.success(value, context);
  }
}
