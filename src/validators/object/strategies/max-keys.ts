/**
 * Max Keys Strategy
 * @module validators/object/strategies/max-keys
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Maximum number of keys strategy */
export class MaxKeysStrategy extends BaseValidationStrategy<
  Record<string, unknown>,
  Record<string, unknown>
> {
  readonly name = 'maxKeys';

  constructor(
    private readonly maxKeys: number,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(
    value: Record<string, unknown>,
    context: ValidationContext,
  ): ValidationResult<Record<string, unknown>> {
    const keyCount = Object.keys(value).length;
    if (keyCount > this.maxKeys) {
      return this.failure('object.maxKeys', context, { max: this.maxKeys });
    }
    return this.success(value, context);
  }
}
