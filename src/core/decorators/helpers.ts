/**
 * TypeScript Decorators - Helper Functions
 * @module core/decorators
 */

import { createFailureResult, createSuccessResult } from '../utils/results';

import type {
  IValidator,
  ValidationContext,
  ValidationError,
  ValidationResult,
} from '#types/index';

interface FieldValidatorMetadata {
  propertyKey: string | symbol;
  validator: IValidator;
}

/** Storage for field validators using WeakMap */
export const fieldValidatorsStorage = new WeakMap<object, FieldValidatorMetadata[]>();

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
  }
}

/**
 * Validate an instance of a decorated class
 */
export function validateInstance(instance: object): ValidationResult<object> {
  const prototype = Object.getPrototypeOf(instance) as object;
  const validators = fieldValidatorsStorage.get(prototype) ?? [];

  const errors: ValidationError[] = [];

  for (const { propertyKey, validator } of validators) {
    const value = (instance as Record<string | symbol, unknown>)[propertyKey];
    const context: ValidationContext = {
      path: [String(propertyKey)],
      field: String(propertyKey),
      locale: 'en',
    };
    const result = validator.validate(value, context);

    if (!result.success) {
      errors.push(...result.errors);
    }
  }

  if (errors.length > 0) {
    return createFailureResult<object>(errors);
  }

  return createSuccessResult(instance);
}
