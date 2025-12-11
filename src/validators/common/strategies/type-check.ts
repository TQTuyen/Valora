/**
 * Type Check Strategy Base Class
 * @module validators/common/strategies/type-check
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Type check strategy base class
 */
export abstract class TypeCheckStrategy<T> extends BaseValidationStrategy<unknown, T> {
  abstract readonly expectedType: string;

  protected abstract isCorrectType(value: unknown): value is T;

  validate(value: unknown, context: ValidationContext): ValidationResult<T> {
    if (!this.isCorrectType(value)) {
      return this.failure(`${this.expectedType}.type`, context);
    }
    return this.success(value, context);
  }
}
