/**
 * Partial Strategy
 * @module validators/object/strategies/partial
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Partial schema - all fields optional */
export class PartialStrategy<T extends Record<string, unknown>> extends BaseValidationStrategy<
  Record<string, unknown>,
  Partial<T>
> {
  readonly name = 'partial';

  validate(
    value: Record<string, unknown>,
    context: ValidationContext,
  ): ValidationResult<Partial<T>> {
    return this.success(value as Partial<T>, context);
  }
}
