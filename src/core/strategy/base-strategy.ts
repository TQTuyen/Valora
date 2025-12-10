/**
 * Strategy Pattern Implementation
 * Base class for validation strategies
 * @module core/strategy
 */

import { getI18n } from '@plugins/i18n/index';

import { createError, createFailureResult, createSuccessResult } from '../utils/results';

import type { IValidationStrategy, ValidationContext, ValidationResult } from '#types/index';

/**
 * Base class for validation strategies (Strategy Pattern)
 * Each strategy encapsulates a single validation rule
 */
export abstract class BaseValidationStrategy<
  TInput = unknown,
  TOutput = TInput,
> implements IValidationStrategy<TInput, TOutput> {
  abstract readonly name: string;
  protected customMessage?: string;

  abstract validate(value: TInput, context: ValidationContext): ValidationResult<TOutput>;

  withMessage(message: string): this {
    this.customMessage = message;
    return this;
  }

  protected success(value: TOutput, _context: ValidationContext): ValidationResult<TOutput> {
    return createSuccessResult(value);
  }

  protected failure(
    code: string,
    context: ValidationContext,
    params?: Record<string, unknown>,
  ): ValidationResult<TOutput> {
    const i18n = getI18n();
    const message = this.customMessage ?? i18n.t(code, params);
    return createFailureResult<TOutput>([
      createError(code, message, [...context.path], context.field, params),
    ]);
  }
}
