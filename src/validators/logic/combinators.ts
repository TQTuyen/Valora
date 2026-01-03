/**
 * Logic Combinators - Boolean Logic Operations
 * @module validators/logic/combinators
 */

import { createLogicValidator } from './helpers';
import { AndStrategy, NotStrategy, OrStrategy, XorStrategy } from './strategies';
import { LogicValidator } from './validator';

import type { IValidator, ValidationOptions } from '#types/index';

type Args<T, U> =
  | [...validators: IValidator<T, U>[]]
  | [...validators: IValidator<T, U>[], options: ValidationOptions];

/**
 * AND combinator - all validators must pass
 * @param validators - Array of validators that must all pass
 * @param options - Optional validation options (must be the last argument if provided)
 */
export function and<T, U>(...args: Args<T, U>): LogicValidator<T, U> {
  const lastArg = args[args.length - 1];
  const hasOptions =
    args.length > 0 && lastArg && typeof lastArg === 'object' && !(lastArg as IValidator)._type;
  const options = hasOptions ? (args.pop() as ValidationOptions) : undefined;
  const validators = args as IValidator<T, U>[];

  return createLogicValidator(LogicValidator<T, U>, new AndStrategy(validators, options));
}

/** Alias for and */
export function allOf<T, U>(...args: Args<T, U>): LogicValidator<T, U> {
  return and(...args);
}

/**
 * OR combinator - at least one validator must pass
 * @param validators - Array of validators where at least one must pass
 * @param options - Optional validation options (must be the last argument if provided)
 */
export function or<T, U>(...args: Args<T, U>): LogicValidator<T, U> {
  const lastArg = args[args.length - 1];
  const hasOptions =
    args.length > 0 && lastArg && typeof lastArg === 'object' && !(lastArg as IValidator)._type;
  const options = hasOptions ? (args.pop() as ValidationOptions) : undefined;
  const validators = args as IValidator<T, U>[];

  return createLogicValidator(LogicValidator<T, U>, new OrStrategy(validators, options));
}

/** Alias for or */
export function anyOf<T, U>(...args: Args<T, U>): LogicValidator<T, U> {
  return or(...args);
}

/**
 * NOT combinator - validator must fail
 * @param validator - Validator that must fail
 * @param options - Optional validation options
 */
export function not<T>(
  validator: IValidator<T, unknown>,
  options?: ValidationOptions,
): LogicValidator<T, T> {
  return createLogicValidator(LogicValidator<T, T>, new NotStrategy(validator, options));
}

/** Alias for not */
export function negate<T>(
  validator: IValidator<T, unknown>,
  options?: ValidationOptions,
): LogicValidator<T, T> {
  return not(validator, options);
}

/**
 * XOR combinator - exactly one validator must pass
 * @param validatorA - First validator
 * @param validatorB - Second validator
 * @param options - Optional validation options
 */
export function xor<T, U>(
  validatorA: IValidator<T, U>,
  validatorB: IValidator<T, U>,
  options?: ValidationOptions,
): LogicValidator<T, U> {
  return createLogicValidator(
    LogicValidator<T, U>,
    new XorStrategy(validatorA, validatorB, options),
  );
}

/** Alias for xor */
export function oneOf<T, U>(
  validatorA: IValidator<T, U>,
  validatorB: IValidator<T, U>,
  options?: ValidationOptions,
): LogicValidator<T, U> {
  return xor(validatorA, validatorB, options);
}
