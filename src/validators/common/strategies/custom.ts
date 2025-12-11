/**
 * Custom Strategy
 * Allows custom validation logic
 * @module validators/common/strategies/custom
 */

import { BaseValidationStrategy } from '@core/index';
import { createError, createFailureResult } from '@utils/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Custom validation strategy
 */
export class CustomStrategy<T> extends BaseValidationStrategy<T, T> {
  readonly name = 'custom';

  constructor(
    private readonly validator: (value: T, context: ValidationContext) => boolean,
    private readonly errorMessage: string,
    private readonly errorCode: string,
  ) {
    super();
  }

  validate(value: T, context: ValidationContext): ValidationResult<T> {
    try {
      const isValid = this.validator(value, context);
      if (!isValid) {
        return createFailureResult<T>([
          createError(this.errorCode, this.errorMessage, [...context.path]),
        ]);
      }
      return this.success(value, context);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Validation failed';
      return createFailureResult<T>([createError(this.errorCode, message, [...context.path])]);
    }
  }
}
