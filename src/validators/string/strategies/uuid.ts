/**
 * UUID Strategy
 * @module validators/string/strategies/uuid
 */

import { BaseValidationStrategy } from '@core/index';
import { patterns } from '@utils/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** UUID validation strategy */
export class UuidStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'uuid';

  constructor(options?: ValidationOptions) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    if (!patterns.uuid.test(value)) {
      return this.failure('string.uuid', context);
    }
    return this.success(value, context);
  }
}
