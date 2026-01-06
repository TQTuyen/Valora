/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @ValidateNested Decorator
 * @module decorators/property/object/validate-nested
 */

/// <reference types="reflect-metadata" />

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

    // Type getter using TypeScript's emitted metadata (requires emitDecoratorMetadata: true)
    // Falls back to Reflect.getMetadata if available, otherwise returns undefined
    const typeGetter = (): any => {
      // Check if Reflect and metadata are available
      if (typeof Reflect !== 'undefined' && typeof Reflect.getMetadata === 'function') {
        return Reflect.getMetadata('design:type', target, propertyKey);
      }
      return undefined;
    };

    markNested(target, propertyKey, typeGetter, each, validationOptions);
  };
}
