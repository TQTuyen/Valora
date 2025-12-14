/**
 * Extend Strategy
 * @module validators/object/strategies/extend
 */

import { BaseValidationStrategy } from '@core/index';

import type { ObjectSchema } from './types';
import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/** Extend schema with additional fields */
export class ExtendStrategy<
  T extends Record<string, unknown>,
  E extends Record<string, unknown>,
> extends BaseValidationStrategy<Record<string, unknown>, T & E> {
  readonly name = 'extend';

  constructor(private readonly extensionSchema: ObjectSchema<E>) {
    super();
  }

  validate(value: Record<string, unknown>, context: ValidationContext): ValidationResult<T & E> {
    const result: Record<string, unknown> = { ...value };
    const allErrors: ValidationResult<T & E>['errors'] = [];

    for (const [key, validator] of Object.entries(this.extensionSchema)) {
      const fieldContext: ValidationContext = {
        ...context,
        path: [...context.path, key],
        field: key,
      };

      const fieldValue = value[key];
      const fieldResult = (validator as IValidator<unknown, unknown>).validate(
        fieldValue,
        fieldContext,
      );

      if (!fieldResult.success) {
        allErrors.push(...fieldResult.errors);
      } else {
        result[key] = fieldResult.data;
      }
    }

    if (allErrors.length > 0) {
      return {
        success: false,
        errors: allErrors,
        data: undefined,
      };
    }

    return this.success(result as T & E, context);
  }
}
