/**
 * Passthrough Strategy
 * @module validators/object/strategies/passthrough
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Passthrough validation - allow extra keys */
export class PassthroughStrategy<T extends Record<string, unknown>> extends BaseValidationStrategy<
  Record<string, unknown>,
  T & Record<string, unknown>
> {
  readonly name = 'passthrough';

  validate(
    value: Record<string, unknown>,
    context: ValidationContext,
  ): ValidationResult<T & Record<string, unknown>> {
    return this.success(value as T & Record<string, unknown>, context);
  }
}
