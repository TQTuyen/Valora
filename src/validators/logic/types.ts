/**
 * Type Combinators - Union and Intersection
 * @module validators/logic/types
 */

import { createLogicValidator } from './helpers';
import { IntersectionStrategy, UnionStrategy } from './strategies';
import { LogicValidator } from './validator';

import type { IValidator } from '#types/index';

/**
 * Union type validator - value must match one of the types
 * @param validators - Array of type validators
 */
export function union<T, U>(...validators: IValidator<T, U>[]): LogicValidator<T, U> {
  return createLogicValidator(LogicValidator<T, U>, new UnionStrategy(validators));
}

/**
 * Intersection type validator - value must satisfy all validators
 * @param validators - Array of validators to intersect
 */
export function intersection<T, U>(...validators: IValidator<T, unknown>[]): LogicValidator<T, U> {
  return createLogicValidator(LogicValidator<T, U>, new IntersectionStrategy(validators));
}
