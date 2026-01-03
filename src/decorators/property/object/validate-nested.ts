/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @ValidateNested Decorator
 * @module decorators/property/object/validate-nested
 */

import { markNested } from '../../core/metadata';

import type { ValidationOptions } from '#types/index';

/**
 * Options for @ValidateNested() decorator
 */
export interface ValidateNestedOptions extends ValidationOptions {
  /**
   * If true, validates each item in an array
   * If false, validates a single nested object
   * @default false
   */
  each?: boolean;
}

/**
 * Marks a property for nested validation
 *
 * This decorator enables recursive validation of nested objects and arrays.
 * The nested class must have its own validation decorators.
 *
 * @param options - Nested validation options
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Address {
 *   @IsString()
 *   street: string;
 *
 *   @IsString()
 *   city: string;
 * }
 *
 * @Validate()
 * class User {
 *   @IsString()
 *   name: string;
 *
 *   @ValidateNested()
 *   address: Address;
 *
 *   @ValidateNested({ each: true })
 *   previousAddresses: Address[];
 * }
 * ```
 */
export function ValidateNested(options: ValidateNestedOptions = {}): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    const { each = false, ...validationOptions } = options;

    // Type getter - currently not used by validation logic
    // but kept for potential future use (e.g., with emitDecoratorMetadata)
    const typeGetter = (): any => {
      return undefined;
    };

    markNested(target, propertyKey, typeGetter, each, validationOptions);
  };
}
