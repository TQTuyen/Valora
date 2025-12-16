/**
 * Logic Validator Helpers
 * @module validators/logic/helpers
 */

import type { LogicValidator } from './validator';
import type { BaseValidationStrategy } from '@core/index';

/**
 * Helper to create a logic validator with a strategy
 * Reduces code duplication across factory functions
 */
export function createLogicValidator<T, U>(
  validatorClass: new () => LogicValidator<T, U>,
  strategy: BaseValidationStrategy<unknown, unknown>,
): LogicValidator<T, U> {
  const validator = new validatorClass();
  (validator as LogicValidator<T, U> & { strategies: unknown[] }).strategies.push(strategy);
  return validator;
}
