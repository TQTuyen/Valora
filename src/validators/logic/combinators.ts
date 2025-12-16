/**
 * Logic Combinators - Boolean Logic Operations
 * @module validators/logic/combinators
 */

import { createLogicValidator } from './helpers';
import { AndStrategy, NotStrategy, OrStrategy, XorStrategy } from './strategies';
import { LogicValidator } from './validator';

import type { IValidator } from '#types/index';

/**
 * AND combinator - all validators must pass
 * @param validators - Array of validators that must all pass
 */
export function and<T, U>(...validators: IValidator<T, U>[]): LogicValidator<T, U> {
  return createLogicValidator(LogicValidator<T, U>, new AndStrategy(validators));
}

/** Alias for and */
export function allOf<T, U>(...validators: IValidator<T, U>[]): LogicValidator<T, U> {
  return and(...validators);
}

/**
 * OR combinator - at least one validator must pass
 * @param validators - Array of validators where at least one must pass
 */
export function or<T, U>(...validators: IValidator<T, U>[]): LogicValidator<T, U> {
  return createLogicValidator(LogicValidator<T, U>, new OrStrategy(validators));
}

/** Alias for or */
export function anyOf<T, U>(...validators: IValidator<T, U>[]): LogicValidator<T, U> {
  return or(...validators);
}

/**
 * NOT combinator - validator must fail
 * @param validator - Validator that must fail
 */
export function not<T>(validator: IValidator<T, unknown>): LogicValidator<T, T> {
  return createLogicValidator(LogicValidator<T, T>, new NotStrategy(validator));
}

/** Alias for not */
export function negate<T>(validator: IValidator<T, unknown>): LogicValidator<T, T> {
  return not(validator);
}

/**
 * XOR combinator - exactly one validator must pass
 * @param validatorA - First validator
 * @param validatorB - Second validator
 */
export function xor<T, U>(
  validatorA: IValidator<T, U>,
  validatorB: IValidator<T, U>,
): LogicValidator<T, U> {
  return createLogicValidator(LogicValidator<T, U>, new XorStrategy(validatorA, validatorB));
}

/** Alias for xor */
export function oneOf<T, U>(
  validatorA: IValidator<T, U>,
  validatorB: IValidator<T, U>,
): LogicValidator<T, U> {
  return xor(validatorA, validatorB);
}
