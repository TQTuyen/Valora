/**
 * One Of Strategy
 * @module validators/comparison/strategies/one-of
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** One of (enum) strategy */
export class OneOfValueStrategy<T> extends BaseValidationStrategy<T, T> {
  readonly name = 'oneOf';

  constructor(
    private readonly allowedValues: T[],
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: T, context: ValidationContext): ValidationResult<T> {
    if (!this.allowedValues.includes(value)) {
      return this.failure('comparison.oneOf', context, {
        values: this.allowedValues.join(', '),
      });
    }
    return this.success(value, context);
  }
}
