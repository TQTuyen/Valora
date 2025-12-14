/**
 * Shape Strategy
 * @module validators/object/strategies/shape
 */

import { BaseValidationStrategy } from '@core/index';

import type { ObjectSchema } from './types';
import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/** Shape validation strategy - validates object against schema */
export class ShapeStrategy<T extends Record<string, unknown>> extends BaseValidationStrategy<
  Record<string, unknown>,
  T
> {
  readonly name = 'shape';

  constructor(private readonly schema: ObjectSchema<T>) {
    super();
  }

  validate(value: Record<string, unknown>, context: ValidationContext): ValidationResult<T> {
    const result: Record<string, unknown> = {};
    const allErrors: ValidationResult<T>['errors'] = [];

    for (const [key, validator] of Object.entries(this.schema)) {
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

    return this.success(result as T, context);
  }
}
