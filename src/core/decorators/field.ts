/**
 * TypeScript Decorators - Field Decorator
 * @module core/decorators
 */

import { fieldValidatorsStorage } from './helpers';

import type { IValidator } from '#types/index';

/**
 * Field decorator for declaring validators on class properties
 */
export function field(validator: IValidator): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    const existingValidators = fieldValidatorsStorage.get(target) ?? [];

    existingValidators.push({
      propertyKey,
      validator,
    });

    fieldValidatorsStorage.set(target, existingValidators);
  };
}
