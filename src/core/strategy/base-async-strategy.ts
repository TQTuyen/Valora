/**
 * Base Async Validation Strategy
 * @module core/strategy/base-async-strategy
 */

import { getI18n } from '@plugins/i18n';

import { createError, createFailureResult, createSuccessResult } from '../utils/results';

import type { IAsyncValidationStrategy, ValidationContext, ValidationResult } from '#types/index';

/**
 * Abstract base class for async validation strategies
 * Provides utility methods for creating results
 *
 * @template TInput - Input type for the strategy
 * @template TOutput - Output type after validation
 */
export abstract class BaseAsyncValidationStrategy<
  TInput = unknown,
  TOutput = TInput,
> implements IAsyncValidationStrategy<TInput, TOutput> {
  abstract readonly name: string;
  protected customMessage?: string;

  abstract validate(value: TInput, context: ValidationContext): Promise<ValidationResult<TOutput>>;

  withMessage(message: string): this {
    this.customMessage = message;
    return this;
  }

  /**
   * Create a success result
   */
  protected success(data: TOutput, _context: ValidationContext): ValidationResult<TOutput> {
    return createSuccessResult(data);
  }

  /**
   * Create a failure result
   */
  protected failure(
    code: string,
    context: ValidationContext,
    params?: Record<string, unknown>,
  ): ValidationResult<TOutput> {
    const i18n = getI18n();
    const message = this.customMessage ?? i18n.t(code, params);
    const error = createError(code, message, [...context.path], context.field, params);
    return createFailureResult([error]);
  }
}
