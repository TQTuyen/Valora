/**
 * TypeScript Decorators - Validate Class Decorator
 * @module core/decorators
 */

import { validateInstance, ValoraValidationError } from './helpers';

export interface ValidateDecoratorOptions {
  validateOnCreate?: boolean;
  throwOnError?: boolean;
}

/**
 * Class decorator for enabling validation on a class
 */
export function validate(
  options: ValidateDecoratorOptions = {},
): <TFunction extends new (...args: unknown[]) => object>(constructor: TFunction) => TFunction {
  const { validateOnCreate = true, throwOnError = true } = options;

  return function <TFunction extends new (...args: unknown[]) => object>(
    constructor: TFunction,
  ): TFunction {
    const original = constructor;

    const newConstructor = function (this: object, ...args: unknown[]): object {
      const instance = new original(...args);

      if (validateOnCreate) {
        const result = validateInstance(instance);
        if (!result.success && throwOnError) {
          throw new ValoraValidationError(`Validation failed for ${original.name}`, result.errors);
        }
      }

      return instance;
    } as unknown as TFunction;

    newConstructor.prototype = original.prototype;
    Object.setPrototypeOf(newConstructor, original);
    return newConstructor;
  };
}
