import { createLogicValidator } from './helpers';
import { IntersectionStrategy, UnionStrategy } from './strategies';
import { LogicValidator } from './validator';

import type { IValidator, ValidationOptions } from '#types/index';

type Args<T, U> =
  | [...validators: IValidator<T, U>[]]
  | [...validators: IValidator<T, U>[], options: ValidationOptions];

/**
 * Union type validator - value must match one of the types
 * @param validators - Array of type validators
 * @param options - Optional validation options (must be the last argument if provided)
 */
export function union<T, U>(...args: Args<T, U>): LogicValidator<T, U> {
  const lastArg = args[args.length - 1];
  const hasOptions =
    args.length > 0 && lastArg && typeof lastArg === 'object' && !(lastArg as IValidator)._type;
  const options = hasOptions ? (args.pop() as ValidationOptions) : undefined;
  const validators = args as IValidator<T, U>[];

  return createLogicValidator(LogicValidator<T, U>, new UnionStrategy(validators, options));
}

/**
 * Intersection type validator - value must satisfy all validators
 * @param validators - Array of validators to intersect
 * @param options - Optional validation options (must be the last argument if provided)
 */
export function intersection<T, U>(...args: Args<T, unknown>): LogicValidator<T, U> {
  const lastArg = args[args.length - 1];
  const hasOptions =
    args.length > 0 && lastArg && typeof lastArg === 'object' && !(lastArg as IValidator)._type;
  const options = hasOptions ? (args.pop() as ValidationOptions) : undefined;
  const validators = args as IValidator<T, unknown>[];

  return createLogicValidator(LogicValidator<T, U>, new IntersectionStrategy(validators, options));
}
