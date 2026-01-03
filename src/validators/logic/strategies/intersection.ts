/**
 * Intersection Strategy
 * @module validators/logic/strategies/intersection
 */

import { BaseValidationStrategy } from '@core/index';

import type {
  IValidator,
  ValidationContext,
  ValidationOptions,
  ValidationResult,
} from '#types/index';

/** Intersection type validator - value must satisfy all validators */
export class IntersectionStrategy<T, U> extends BaseValidationStrategy<T, U> {
  readonly name = 'intersection';

  constructor(
    private readonly validators: IValidator<T, unknown>[],
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: T, context: ValidationContext): ValidationResult<U> {
    let result: unknown = value;
    const allErrors: ValidationResult<U>['errors'] = [];

    for (const validator of this.validators) {
      const validationResult = validator.validate(value, context);

      if (!validationResult.success) {
        allErrors.push(...validationResult.errors);
      } else {
        // Merge results for objects
        if (
          typeof result === 'object' &&
          result !== null &&
          typeof validationResult.data === 'object'
        ) {
          result = { ...result, ...validationResult.data };
        } else {
          result = validationResult.data;
        }
      }
    }

    if (allErrors.length > 0) {
      if (this.customMessage) {
        return this.failure('logic.intersection', context);
      }
      return {
        success: false,
        errors: allErrors,
        data: undefined,
      };
    }

    return this.success(result as U, context);
  }
}
