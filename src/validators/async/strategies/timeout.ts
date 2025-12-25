/**
 * Timeout Strategy
 * @module validators/async/strategies/timeout
 */

import { BaseAsyncValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Timeout strategy
 *
 * Adds timeout handling to async validation.
 * If validation takes longer than the specified timeout, it fails.
 * This is a pass-through strategy that just validates the value passes through
 * but will be used by the validator to wrap the entire validation chain.
 */
export class TimeoutStrategy<T = unknown> extends BaseAsyncValidationStrategy<T, T> {
  readonly name = 'timeout';

  constructor(
    readonly timeoutMs: number,
    readonly message?: string,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(value: T, context: ValidationContext): Promise<ValidationResult<T>> {
    // This strategy just passes through - the actual timeout logic
    // will be implemented in the validator's executeAsyncValidation method
    return this.success(value, context);
  }
}
