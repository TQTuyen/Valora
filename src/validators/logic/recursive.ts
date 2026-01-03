/**
 * Recursive Type Support
 * @module validators/logic/recursive
 */

import { createLogicValidator } from './helpers';
import { LazyStrategy } from './strategies';
import { LogicValidator } from './validator';

import type { IValidator, ValidationOptions } from '#types/index';

/**
 * Lazy evaluation for recursive types
 * @param factory - Factory function that returns a validator
 */
export function lazy<T, U>(
  factory: () => IValidator<T, U>,
  options?: ValidationOptions,
): LogicValidator<T, U> {
  return createLogicValidator(LogicValidator<T, U>, new LazyStrategy(factory, options));
}
