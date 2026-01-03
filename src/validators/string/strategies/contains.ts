/**
 * Contains Strategy
 * @module validators/string/strategies/contains
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Contains strategy */
export class ContainsStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'contains';

  constructor(
    private readonly substring: string,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (!value.includes(this.substring)) {
      return this.failure('string.contains', context, { substring: this.substring });
    }
    return this.success(value, context);
  }
}
