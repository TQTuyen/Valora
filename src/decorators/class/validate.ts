/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Class Validator Decorator
 * @module decorators/class/validate
 *
 * Enhanced @Validate() decorator with support for:
 * - Decorator chaining
 * - Nested validation
 * - Automatic validation on instantiation
 */

import { propertyValidatorsStorage } from '../core/metadata';

import { validateClassInstance } from './instance-validator';
import { ValoraValidationError } from './validation-error';

import type { ValidationResult } from '#types/index';

/**
 * Options for @Validate() decorator
 */
export interface ValidateOptions {
  /**
   * Validate automatically when class is instantiated
   * @default true
   */
  validateOnCreate?: boolean;

  /**
   * Throw error if validation fails
   * @default true
   */
  throwOnError?: boolean;
}

// Re-export for backward compatibility
export { validateClassInstance } from './instance-validator';
export { ValoraValidationError } from './validation-error';

/**
 * Class decorator for enabling validation
 *
 * Wraps the class constructor to automatically validate instances
 * on creation. Supports decorator chaining and nested validation.
 *
 * @param options - Validation options
 * @returns Class decorator function
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsString()
 *   @MinLength(2)
 *   name: string;
 *
 *   @IsEmail()
 *   email: string;
 *
 *   @ValidateNested()
 *   address: Address;
 * }
 *
 * // Throws ValoraValidationError if invalid
 * const user = new User({ name: 'J', email: 'invalid' });
 * ```
 */
export function Validate(
  options: ValidateOptions = {},
): <T extends new (...args: any[]) => any>(constructor: T) => T {
  const { validateOnCreate = true, throwOnError = true } = options;

  return function <T extends new (...args: any[]) => any>(constructor: T): T {
    // Create new constructor that wraps the original
    const newConstructor = class extends constructor {
      constructor(...args: any[]) {
        super(...args);

        if (validateOnCreate) {
          const result = validateClassInstance(this);

          if (!result.success && throwOnError) {
            const errorMessage = `Validation failed for ${constructor.name}`;
            throw new ValoraValidationError(errorMessage, result.errors);
          }
        }
      }
    };

    // Copy metadata from original prototype to new prototype
    // This ensures validation works when @Validate wraps the class
    const originalMetadata = propertyValidatorsStorage.get(constructor.prototype);
    if (originalMetadata) {
      propertyValidatorsStorage.set(newConstructor.prototype, originalMetadata);
    }

    // Preserve original class name for debugging
    Object.defineProperty(newConstructor, 'name', {
      value: constructor.name,
      writable: false,
    });

    return newConstructor as T;
  };
}

/**
 * Manually validate a class instance (without @Validate decorator)
 *
 * Useful for validating instances without automatic validation on creation.
 *
 * @param instance - Class instance to validate
 * @param throwOnError - Whether to throw error on validation failure
 * @returns Validation result
 * @throws ValoraValidationError if validation fails and throwOnError is true
 *
 * @example
 * ```typescript
 * class User {
 *   @IsString() name: string;
 *   @IsEmail() email: string;
 * }
 *
 * const user = new User();
 * user.name = 'John';
 * user.email = 'invalid';
 *
 * const result = validate(user); // Returns ValidationResult
 * ```
 */
export function validate(instance: object, throwOnError = false): ValidationResult<object> {
  const result = validateClassInstance(instance);

  if (!result.success && throwOnError) {
    const className = instance.constructor.name;
    throw new ValoraValidationError(`Validation failed for ${className}`, result.errors);
  }

  return result;
}
