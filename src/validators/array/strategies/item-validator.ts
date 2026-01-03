/**
 * Array Item Validator Strategy
 * @module validators/array/strategies/item-validator
 */

import { BaseValidationStrategy } from '@core/index';

import type {
  IValidator,
  ValidationContext,
  ValidationOptions,
  ValidationResult,
} from '#types/index';

/**
 * Item validator strategy - validates each item with a validator
 */
export class ItemValidatorStrategy<T, U> extends BaseValidationStrategy<T[], U[]> {
  readonly name = 'items';

  constructor(
    private readonly itemValidator: IValidator<T, U>,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: T[], context: ValidationContext): ValidationResult<U[]> {
    const results: U[] = [];
    const errors: Array<{ index: number; errors: ValidationResult<U>['errors'] }> = [];

    for (let i = 0; i < value.length; i++) {
      const itemContext: ValidationContext = {
        ...context,
        path: [...context.path, i.toString()],
        field: `${context.field}[${String(i)}]`,
      };

      const result = this.itemValidator.validate(value[i] as T, itemContext);

      if (!result.success) {
        errors.push({ index: i, errors: result.errors });
      } else {
        results.push(result.data as U);
      }
    }

    if (errors.length > 0) {
      // Flatten all errors from items
      const allErrors = errors.flatMap((e) =>
        e.errors.map((err) => ({
          ...err,
          path: [...context.path, e.index.toString(), ...err.path.slice(context.path.length + 1)],
        })),
      );

      return {
        success: false,
        errors: allErrors,
        data: undefined,
      };
    }

    return this.success(results, context);
  }
}
