/**
 * Chain of Responsibility Pattern - Strategy Handler
 * Wraps a strategy as a handler for the chain
 * @module core/chain
 */

import { BaseValidationHandler } from './base-handler';

import type { ValidationContext, ValidationResult } from '#types/results';
import type { IAsyncValidationStrategy, IValidationStrategy } from '#types/validators';

/**
 * Wraps a strategy as a handler for the chain
 */
export class StrategyHandler<T> extends BaseValidationHandler<T> {
  constructor(
    private readonly strategy: IValidationStrategy<T, T> | IAsyncValidationStrategy<T, T>,
  ) {
    super();
  }

  protected process(value: T, context: ValidationContext): ValidationResult<T> {
    const result = this.strategy.validate(value, context);

    if (result instanceof Promise) {
      throw new Error(
        `Strategy "${this.strategy.name}" is asynchronous and cannot be used in a synchronous validation pipeline. Use validateAsync() instead.`,
      );
    }

    return result;
  }
}
