/**
 * Ends With Strategy
 * @module validators/string/strategies/ends-with
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Ends with strategy */
export class EndsWithStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'endsWith';

  constructor(private readonly suffix: string) {
    super();
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (!value.endsWith(this.suffix)) {
      return this.failure('string.endsWith', context, { suffix: this.suffix });
    }
    return this.success(value, context);
  }
}
