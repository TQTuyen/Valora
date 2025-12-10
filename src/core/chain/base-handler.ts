/**
 * Chain of Responsibility Pattern - Base Handler
 * @module core/chain
 */

import { getI18n } from '@plugins/i18n/index';

import { createError, createFailureResult, createSuccessResult } from '../utils/results';

import type { IValidationHandler, ValidationContext, ValidationResult } from '#types/index';

/**
 * Base class for validation handlers (Chain of Responsibility Pattern)
 */
export abstract class BaseValidationHandler<T = unknown> implements IValidationHandler<T> {
  private nextHandler: IValidationHandler<T> | null = null;

  setNext(handler: IValidationHandler<T>): IValidationHandler<T> {
    this.nextHandler = handler;
    return handler;
  }

  handle(value: T, context: ValidationContext): ValidationResult<T> {
    const result = this.process(value, context);

    if (!result.success) {
      return result;
    }

    if (this.nextHandler) {
      const nextValue = result.data ?? value;
      return this.nextHandler.handle(nextValue, context);
    }

    return result;
  }

  protected abstract process(value: T, context: ValidationContext): ValidationResult<T>;

  protected success(value: T, _context: ValidationContext): ValidationResult<T> {
    return createSuccessResult(value);
  }

  protected failure(
    code: string,
    context: ValidationContext,
    params?: Record<string, unknown>,
  ): ValidationResult<T> {
    const i18n = getI18n();
    const message = i18n.t(code, params);
    return createFailureResult<T>([
      createError(code, message, [...context.path], context.field, params),
    ]);
  }
}
