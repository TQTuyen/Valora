/**
 * Chain of Responsibility Pattern - Validation Pipeline
 * @module core/chain
 */

import { createSuccessResult } from '../utils/results';

import type {
  IValidationHandler,
  IValidationPipeline,
  ValidationContext,
  ValidationResult,
} from '#types/index';

/**
 * Validation pipeline orchestrator (Chain of Responsibility Pattern)
 */
export class ValidationPipeline<T = unknown> implements IValidationPipeline<T> {
  private handlers: IValidationHandler<T>[] = [];

  addHandler(handler: IValidationHandler<T>): this {
    if (this.handlers.length > 0) {
      const lastHandler = this.handlers[this.handlers.length - 1];
      lastHandler?.setNext(handler);
    }
    this.handlers.push(handler);
    return this;
  }

  execute(value: T, context: ValidationContext): ValidationResult<T> {
    if (this.handlers.length === 0) {
      return createSuccessResult(value);
    }

    const firstHandler = this.handlers[0];
    return firstHandler?.handle(value, context) ?? createSuccessResult(value);
  }

  get length(): number {
    return this.handlers.length;
  }

  clear(): void {
    this.handlers = [];
  }
}
