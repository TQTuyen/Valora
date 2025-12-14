/**
 * Pick Strategy
 * @module validators/object/strategies/pick
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/** Pick specific keys from schema */
export class PickStrategy<
  T extends Record<string, unknown>,
  K extends keyof T,
> extends BaseValidationStrategy<Record<string, unknown>, Pick<T, K>> {
  readonly name = 'pick';

  constructor(private readonly keys: K[]) {
    super();
  }

  validate(
    value: Record<string, unknown>,
    context: ValidationContext,
  ): ValidationResult<Pick<T, K>> {
    const picked: Record<string, unknown> = {};
    for (const key of this.keys) {
      if (key in value) {
        picked[key as string] = value[key as string];
      }
    }
    return this.success(picked as Pick<T, K>, context);
  }
}
