/**
 * Omit Strategy
 * @module validators/object/strategies/omit
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Omit specific keys from schema */
export class OmitStrategy<
  T extends Record<string, unknown>,
  K extends keyof T,
> extends BaseValidationStrategy<Record<string, unknown>, Omit<T, K>> {
  readonly name = 'omit';

  constructor(private readonly keys: K[]) {
    super();
  }

  validate(
    value: Record<string, unknown>,
    context: ValidationContext,
  ): ValidationResult<Omit<T, K>> {
    const keysSet = new Set(this.keys as string[]);
    const omitted: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
      if (!keysSet.has(key)) {
        omitted[key] = value[key];
      }
    }
    return this.success(omitted as Omit<T, K>, context);
  }
}
