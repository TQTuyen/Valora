/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Decorator Factory
 * @module decorators/core/factory
 *
 * Generic factory functions for creating property decorators.
 * Implements the DRY principle - all decorators use these factories.
 */

import { addPropertyValidator } from './metadata';

import type { IValidator } from '#types/index';

/**
 * Type for validator factory functions
 * @template TArgs - Tuple of argument types for the validator factory
 */
export type ValidatorFactory<TArgs extends any[] = []> = (...args: TArgs) => IValidator;

/**
 * Create a property decorator from a validator factory
 *
 * This is the core factory that all decorators use.
 * It follows the DRY principle - single implementation for all ~85 decorators.
 *
 * @param validatorFactory - Function that creates a validator instance
 * @returns A function that takes validator arguments and returns a PropertyDecorator
 *
 * @example
 * ```typescript
 * // Create a MinLength decorator
 * export function MinLength(min: number): PropertyDecorator {
 *   return createPropertyDecorator((minLength: number) =>
 *     string().minLength(minLength)
 *   )(min);
 * }
 * ```
 */
export function createPropertyDecorator<TArgs extends any[]>(
  validatorFactory: ValidatorFactory<TArgs>,
): (...args: TArgs) => PropertyDecorator {
  return (...args: TArgs): PropertyDecorator => {
    return (target: object, propertyKey: string | symbol): void => {
      // Create the validator instance
      const validator = validatorFactory(...args);

      // Add to metadata storage (supports chaining)
      addPropertyValidator(target, propertyKey, validator);
    };
  };
}

/**
 * Create a simple type-checking decorator (no arguments)
 *
 * Used for decorators like @IsString(), @IsNumber(), etc.
 * that don't accept any configuration parameters.
 *
 * @param validatorFactory - Function that creates a validator instance
 * @returns A function that returns a PropertyDecorator
 *
 * @example
 * ```typescript
 * // Create an IsString decorator
 * export function IsString(): PropertyDecorator {
 *   return createTypeDecorator(() => string())();
 * }
 * ```
 */
export function createTypeDecorator(validatorFactory: () => IValidator): () => PropertyDecorator {
  return createPropertyDecorator(validatorFactory);
}

/**
 * Create a decorator with optional parameters
 *
 * Convenience wrapper for decorators that accept optional configuration.
 *
 * @param validatorFactory - Function that creates a validator with optional args
 * @returns A function that optionally takes arguments and returns a PropertyDecorator
 *
 * @example
 * ```typescript
 * // Create an IsCreditCard decorator with optional card types
 * export function IsCreditCard(allowedTypes?: CreditCardType[]): PropertyDecorator {
 *   return createOptionalDecorator((types?: CreditCardType[]) =>
 *     business().creditCard(types)
 *   )(allowedTypes);
 * }
 * ```
 */
export function createOptionalDecorator<TArgs extends any[]>(
  validatorFactory: ValidatorFactory<TArgs>,
): (...args: TArgs) => PropertyDecorator {
  return createPropertyDecorator(validatorFactory);
}
