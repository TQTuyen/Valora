/**
 * Starts With Strategy
 * @module validators/string/strategies/starts-with
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Starts with strategy */
export class StartsWithStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'startsWith';

  constructor(
    private readonly prefix: string,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (!value.startsWith(this.prefix)) {
      return this.failure('string.startsWith', context, { prefix: this.prefix });
    }
    return this.success(value, context);
  }
}
