/**
 * Conditional Logic Operations
 * @module validators/logic/conditional
 */

import { createLogicValidator } from './helpers';
import { IfThenElseStrategy } from './strategies';
import { LogicValidator } from './validator';

import type { IValidator, ValidationOptions } from '#types/index';

/**
 * IF-THEN-ELSE conditional validator
 * @param condition - Condition validator
 * @param thenValidator - Validator to use if condition passes
 * @param elseValidator - Validator to use if condition fails (optional)
 */
export function ifThenElse<T, U>(
  condition: IValidator<T, unknown>,
  thenValidator: IValidator<T, U>,
  elseValidator?: IValidator<T, U>,
  options?: ValidationOptions,
): LogicValidator<T, U> {
  return createLogicValidator(
    LogicValidator<T, U>,
    new IfThenElseStrategy(condition, thenValidator, elseValidator, options),
  );
}

/** Alias for ifThenElse */
export function when<T, U>(
  condition: IValidator<T, unknown>,
  thenValidator: IValidator<T, U>,
  elseValidator?: IValidator<T, U>,
  options?: ValidationOptions,
): LogicValidator<T, U> {
  return ifThenElse(condition, thenValidator, elseValidator, options);
}
