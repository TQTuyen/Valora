/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * Class Instance Validation Logic
 * @module decorators/class/instance-validator
 *
 * Handles validation of class instances including nested objects and arrays.
 */

import { createFailureResult, createSuccessResult } from '@utils/index';

import { getCombinedValidator, getPropertyMetadata } from '../core/metadata';

import type { PropertyValidatorMetadata } from '../core/metadata';
import type { ValidationContext, ValidationError, ValidationResult } from '#types/index';

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
