/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * Class Validator Decorator
 * @module decorators/class/validate
 *
 * Enhanced @Validate() decorator with support for:
 * - Decorator chaining
 * - Nested validation
 * - Automatic validation on instantiation
 */

import { createFailureResult, createSuccessResult } from '@utils/index';

import {
  getCombinedValidator,
  getPropertyMetadata,
  propertyValidatorsStorage,
} from '../core/metadata';

import type { PropertyValidatorMetadata } from '../core/metadata';
import type { ValidationContext, ValidationError, ValidationResult } from '#types/index';

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

/**
 * Validation error thrown when class validation fails
 */
export class ValoraValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: ReadonlyArray<ValidationError>,
  ) {
    super(message);
    this.name = 'ValoraValidationError';

    // Maintain proper stack trace (V8 engines)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValoraValidationError);
    }
  }
}

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
 * Validate a class instance using decorator metadata
 *
 * This function:
 * 1. Retrieves all property metadata from the class prototype
 * 2. For each property:
 *    - If nested: recursively validates nested object(s)
 *    - Else: combines chained validators with AND, validates value
 * 3. Collects all validation errors
 * 4. Returns aggregated result
 *
 * @param instance - Class instance to validate
 * @returns Validation result with all errors
 *
 * @example
 * ```typescript
 * const user = new User({ name: 'John', email: 'john@example.com' });
 * const result = validateClassInstance(user);
 *
 * if (result.success) {
 *   console.log('Valid!', result.data);
 * } else {
 *   console.log('Errors:', result.errors);
 * }
 * ```
 */
export function validateClassInstance(instance: object): ValidationResult<object> {
  const prototype = Object.getPrototypeOf(instance);
  const metadata = getPropertyMetadata(prototype);

  const errors: ValidationError[] = [];

  for (const propMeta of metadata) {
    const value = (instance as any)[propMeta.propertyKey];
    const context: ValidationContext = {
      path: [String(propMeta.propertyKey)],
      field: String(propMeta.propertyKey),
      locale: 'en',
      data: instance, // For cross-field validation
    };

    let result!: ValidationResult<any>;

    // Check if property is optional and undefined (applies to both nested and regular)
    const hasOptional = propMeta.validators.some((v: any) => v._type === 'optional');
    if (hasOptional && value === undefined) {
      // Skip validation for optional undefined fields
      continue;
    }

    // Run regular validators first (even for nested properties)
    if (propMeta.validators.length > 0) {
      const validator = getCombinedValidator(propMeta);
      result = validator.validate(value, context);

      // If regular validation fails, don't proceed to nested validation
      if (!result.success) {
        errors.push(...result.errors);
        continue;
      }
    }

    // Then handle nested validation if applicable
    if (propMeta.isNested) {
      result = validateNestedProperty(value, propMeta, context);
    } else {
      // If not nested and no validators, skip
      if (propMeta.validators.length === 0) {
        continue;
      }
    }

    if (!result.success) {
      errors.push(...result.errors);
    }
  }

  if (errors.length > 0) {
    return createFailureResult<object>(errors);
  }

  return createSuccessResult(instance);
}

/**
 * Validate a nested property (single object or array)
 *
 * @param value - The property value to validate
 * @param metadata - Property metadata containing nested type info
 * @param context - Validation context
 * @returns Validation result
 */
function validateNestedProperty(
  value: any,
  metadata: PropertyValidatorMetadata,
  context: ValidationContext,
): ValidationResult<any> {
  if (!metadata.nestedType) {
    return createFailureResult<any>([
      {
        code: 'nested.type_missing',
        message: `Nested type not specified for ${String(metadata.propertyKey)}`,
        path: context.path,
        field: context.field,
      },
    ]);
  }

  // Handle undefined/null values
  if (value === undefined || value === null) {
    return createFailureResult<any>([
      {
        code: 'nested.required',
        message: `Nested property ${String(metadata.propertyKey)} is required`,
        path: context.path,
        field: context.field,
      },
    ]);
  }

  if (metadata.isArray) {
    // Array of nested objects
    if (!Array.isArray(value)) {
      return createFailureResult<any>([
        {
          code: 'nested.array_expected',
          message: `Expected an array for ${String(metadata.propertyKey)}`,
          path: context.path,
          field: context.field,
        },
      ]);
    }

    const errors: ValidationError[] = [];

    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const itemResult = validateClassInstance(item);

      if (!itemResult.success) {
        // Add array index to error paths
        errors.push(
          ...itemResult.errors.map((err) => ({
            ...err,
            path: [...context.path, i, ...err.path],
          })),
        );
      }
    }

    if (errors.length > 0) {
      if (metadata.options?.message) {
        return createFailureResult<any>([
          {
            code: 'nested.validation',
            message: metadata.options.message,
            path: context.path,
            field: context.field,
          },
        ]);
      }
      return createFailureResult<any>(errors);
    }
  } else {
    // Single nested object
    const result = validateClassInstance(value);
    if (!result.success && metadata.options?.message) {
      return createFailureResult<any>([
        {
          code: 'nested.validation',
          message: metadata.options.message,
          path: context.path,
          field: context.field,
        },
      ]);
    }
    return result;
  }

  return createSuccessResult(value);
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
