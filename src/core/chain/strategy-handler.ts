/**
 * Chain of Responsibility Pattern - Strategy Handler
 * Wraps a strategy as a handler for the chain
 * @module core/chain
 */

import { BaseValidationHandler } from './base-handler';

import type { IValidationStrategy, ValidationContext, ValidationResult } from '#types/index';

/**
 * Wraps a strategy as a handler for the chain
 */
export class StrategyHandler<T> extends BaseValidationHandler<T> {
  constructor(private readonly strategy: IValidationStrategy<T, T>) {
    super();
  }

  protected process(value: T, context: ValidationContext): ValidationResult<T> {
    return this.strategy.validate(value, context);
  }
}
