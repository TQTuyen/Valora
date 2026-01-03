/**
 * Min Keys Strategy
 * @module validators/object/strategies/min-keys
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Minimum number of keys strategy */
export class MinKeysStrategy extends BaseValidationStrategy<
  Record<string, unknown>,
  Record<string, unknown>
> {
  readonly name = 'minKeys';

  constructor(
    private readonly minKeys: number,
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
    if (keyCount < this.minKeys) {
      return this.failure('object.minKeys', context, { min: this.minKeys });
    }
    return this.success(value, context);
  }
}
