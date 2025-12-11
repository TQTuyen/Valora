/**
 * Tuple Validator
 * @module schema/tuple
 */

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Tuple validator - validates fixed-length arrays with specific types at each position
 */
export class TupleValidator<
  T extends readonly IValidator<unknown, unknown>[],
> implements IValidator<
  unknown,
  { [K in keyof T]: T[K] extends IValidator<unknown, infer U> ? U : never }
> {
  readonly _type = 'tuple';

  constructor(private readonly validators: T) {}

  validate(
    value: unknown,
    context?: ValidationContext,
  ): ValidationResult<{ [K in keyof T]: T[K] extends IValidator<unknown, infer U> ? U : never }> {
    const ctx = context ?? { path: [], field: '', locale: 'en' };

    if (!Array.isArray(value)) {
      return {
        success: false,
        data: undefined,
        errors: [
          {
            code: 'tuple.type',
            message: 'Expected an array',
            path: ctx.path,
            field: ctx.field,
          },
        ],
      };
    }

    if (value.length !== this.validators.length) {
      return {
        success: false,
        data: undefined,
        errors: [
          {
            code: 'tuple.length',
            message: `Expected array of length ${String(this.validators.length)}, got ${String(value.length)}`,
            path: ctx.path,
            field: ctx.field,
          },
        ],
      };
    }

    const result: unknown[] = [];
    const errors: ValidationResult['errors'] = [];

    for (let i = 0; i < this.validators.length; i++) {
      const itemContext = {
        ...ctx,
        path: [...ctx.path, i.toString()],
        field: `${ctx.field}[${String(i)}]`,
      };
      const validator = this.validators[i];
      if (!validator) continue;
      const itemResult = validator.validate(value[i], itemContext);

      if (!itemResult.success) {
        errors.push(...itemResult.errors);
      } else {
        result.push(itemResult.data);
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        data: undefined,
        errors,
      };
    }

    return {
      success: true,
      data: result as { [K in keyof T]: T[K] extends IValidator<unknown, infer U> ? U : never },
      errors: [],
    };
  }
}
