/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * Enhanced Metadata Storage
 * @module decorators/core/metadata
 *
 * Provides metadata storage with support for validator chaining.
 * Multiple decorators on a single property are combined using AND logic.
 */

import { and } from '@validators/logic';

import type { IValidator } from '#types/index';

/**
 * Metadata for a single property's validators
 */
export interface PropertyValidatorMetadata {
  /** Property key (name or symbol) */
  propertyKey: string | symbol;
  /** Array of validators to chain (combined with AND) */
  validators: IValidator[];
  /** Whether this property requires nested validation */
  isNested?: boolean;
  /** Function to get the constructor for nested type */
  nestedType?: () => any;
  /** Whether the property is an array of nested objects */
  isArray?: boolean;
}

/**
 * WeakMap storage for property validators
 * Uses WeakMap to avoid memory leaks (no strong references to class prototypes)
 */
export const propertyValidatorsStorage = new WeakMap<object, PropertyValidatorMetadata[]>();

/**
 * Add a validator to a property (supports chaining)
 *
 * When multiple decorators are applied to the same property,
 * their validators are chained together using AND logic.
 *
 * @param target - The class prototype
 * @param propertyKey - The property name or symbol
 * @param validator - The validator to add
 *
 * @example
 * ```typescript
 * // Multiple decorators on same property
 * @IsString()        // validator 1
 * @IsEmail()         // validator 2  → Combined with AND
 * @MinLength(5)      // validator 3
 * email: string;
 * ```
 */
export function addPropertyValidator(
  target: object,
  propertyKey: string | symbol,
  validator: IValidator,
): void {
  const metadata = propertyValidatorsStorage.get(target) ?? [];

  // Find existing metadata for this property
  const existing = metadata.find((m) => m.propertyKey === propertyKey);

  if (existing) {
    // Chain with existing validators
    existing.validators.push(validator);
  } else {
    // Create new metadata entry
    metadata.push({
      propertyKey,
      validators: [validator],
    });
  }

  propertyValidatorsStorage.set(target, metadata);
}

/**
 * Mark a property for nested validation
 *
 * Used by @ValidateNested() to indicate that a property
 * contains a nested object or array of objects that should
 * be validated recursively.
 *
 * @param target - The class prototype
 * @param propertyKey - The property name or symbol
 * @param typeGetter - Function that returns the nested type's constructor
 * @param isArray - Whether the property is an array of nested objects
 *
 * @example
 * ```typescript
 * @ValidateNested()
 * address: Address;  // Single nested object
 *
 * @ValidateNested({ each: true })
 * addresses: Address[];  // Array of nested objects
 * ```
 */
export function markNested(
  target: object,
  propertyKey: string | symbol,
  typeGetter: () => any,
  isArray = false,
): void {
  const metadata = propertyValidatorsStorage.get(target) ?? [];

  const existing = metadata.find((m) => m.propertyKey === propertyKey);

  if (existing) {
    existing.isNested = true;
    existing.nestedType = typeGetter;
    existing.isArray = isArray;
  } else {
    metadata.push({
      propertyKey,
      validators: [],
      isNested: true,
      nestedType: typeGetter,
      isArray,
    });
  }

  propertyValidatorsStorage.set(target, metadata);
}

/**
 * Get combined validator for a property
 *
 * Chains all validators for a property using AND logic.
 * If only one validator exists, returns it directly.
 *
 * @param metadata - The property metadata containing validators
 * @returns Combined validator or single validator
 * @throws Error if no validators are found
 */
export function getCombinedValidator(metadata: PropertyValidatorMetadata): IValidator {
  if (metadata.validators.length === 0) {
    throw new Error(`No validators found for property ${String(metadata.propertyKey)}`);
  }

  if (metadata.validators.length === 1) {
    // TypeScript needs assertion since array access can return undefined
    return metadata.validators[0]!;
  }

  // Chain multiple validators using AND logic
  // All validators must pass for the property to be valid
  return and(...metadata.validators);
}

/**
 * Get all property metadata for a class prototype
 *
 * @param target - The class prototype
 * @returns Array of property metadata, or empty array if none found
 */
export function getPropertyMetadata(target: object): PropertyValidatorMetadata[] {
  return propertyValidatorsStorage.get(target) ?? [];
}

/**
 * Check if a property has validators
 *
 * @param target - The class prototype
 * @param propertyKey - The property name or symbol
 * @returns True if the property has validators or is marked for nested validation
 */
export function hasPropertyValidators(target: object, propertyKey: string | symbol): boolean {
  const metadata = propertyValidatorsStorage.get(target) ?? [];
  return metadata.some((m) => m.propertyKey === propertyKey);
}

/**
 * Clear all metadata for a class (useful for testing)
 *
 * @param target - The class prototype
 */
export function clearPropertyMetadata(target: object): void {
  propertyValidatorsStorage.delete(target);
}
