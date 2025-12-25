/**
 * Async Strategy
 * @module validators/async/strategies/async
 */

import { BaseAsyncValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Async validation function type
 */
export type AsyncValidationFn<TInput, TOutput = TInput> = (
  value: TInput,
  context: ValidationContext,
) => Promise<ValidationResult<TOutput>>;

/**
 * Async validation strategy
 *
 * Wraps an async validation function and executes it as part of the validation pipeline.
 */
export class AsyncStrategy<TInput = unknown, TOutput = TInput> extends BaseAsyncValidationStrategy<
  TInput,
  TOutput
> {
  readonly name = 'async';

  constructor(private readonly fn: AsyncValidationFn<TInput, TOutput>) {
    super();
  }

  async validate(value: TInput, context: ValidationContext): Promise<ValidationResult<TOutput>> {
    try {
      return await this.fn(value, context);
    } catch (error) {
      return this.failure(
        error instanceof Error ? error.message : 'Async validation failed',
        context,
      );
    }
  }
}
