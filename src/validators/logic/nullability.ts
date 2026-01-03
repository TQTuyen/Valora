/**
 * Nullability Validators
 * @module validators/logic/nullability
 */

import { LogicValidator } from './validator';

import type {
  IValidator,
  ValidationContext,
  ValidationOptions,
  ValidationResult,
} from '#types/index';

/**
 * Optional validator - value can be undefined
 * @param validator - Validator for non-undefined values
 */
export function optional<T, U>(
  validator: IValidator<NonNullable<T>, U>,
  _options?: ValidationOptions,
): LogicValidator<T | undefined, U | undefined> {
  const logicValidator = new LogicValidator<T | undefined, U | undefined>();

  const validate = (
    value: T | undefined,
    context: ValidationContext,
  ): ValidationResult<U | undefined> => {
    if (value === undefined) {
      return {
        success: true,
        data: undefined,
        errors: [],
      };
    }
    return validator.validate(value as NonNullable<T>, context) as ValidationResult<U | undefined>;
  };

  // Override the validate method
  logicValidator.validate = validate;

  return logicValidator;
}

/**
 * Nullable validator - value can be null
 * @param validator - Validator for non-null values
 */
export function nullable<T, U>(
  validator: IValidator<NonNullable<T>, U>,
  _options?: ValidationOptions,
): LogicValidator<T | null, U | null> {
  const logicValidator = new LogicValidator<T | null, U | null>();

  const validate = (value: T | null, context: ValidationContext): ValidationResult<U | null> => {
    if (value === null) {
      return {
        success: true,
        data: null,
        errors: [],
      };
    }
    return validator.validate(value as NonNullable<T>, context) as ValidationResult<U | null>;
  };

  logicValidator.validate = validate;

  return logicValidator;
}

/**
 * Nullish validator - value can be null or undefined
 * @param validator - Validator for non-nullish values
 */
export function nullish<T, U>(
  validator: IValidator<NonNullable<T>, U>,
  _options?: ValidationOptions,
): LogicValidator<T | null | undefined, U | null | undefined> {
  const logicValidator = new LogicValidator<T | null | undefined, U | null | undefined>();

  const validate = (
    value: T | null | undefined,
    context: ValidationContext,
  ): ValidationResult<U | null | undefined> => {
    if (value === null) {
      return {
        success: true,
        data: null,
        errors: [],
      };
    }
    if (value === undefined) {
      return {
        success: true,
        data: undefined,
        errors: [],
      };
    }
    return validator.validate(value as NonNullable<T>, context) as ValidationResult<
      U | null | undefined
    >;
  };

  logicValidator.validate = validate;

  return logicValidator;
}
