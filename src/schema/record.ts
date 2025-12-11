/**
 * Record Validator
 * @module schema/record
 */

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Record validator - validates objects with dynamic keys
 */
export class RecordValidator<K extends string | number | symbol, V> implements IValidator<
  unknown,
  Record<K, V>
> {
  readonly _type = 'record';

  constructor(
    private readonly keyValidator: IValidator<unknown, K>,
    private readonly valueValidator: IValidator<unknown, V>,
  ) {}

  validate(value: unknown, context?: ValidationContext): ValidationResult<Record<K, V>> {
    const ctx = context ?? { path: [], field: '', locale: 'en' };

    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      return {
        success: false,
        data: undefined,
        errors: [
          {
            code: 'record.type',
            message: 'Expected an object',
            path: ctx.path,
            field: ctx.field,
          },
        ],
      };
    }

    const result: Record<string, unknown> = {};
    const errors: ValidationResult['errors'] = [];

    for (const [key, val] of Object.entries(value)) {
      const keyContext = { ...ctx, path: [...ctx.path, key], field: key };
      const keyResult = this.keyValidator.validate(key, keyContext);

      if (!keyResult.success) {
        errors.push(...keyResult.errors);
        continue;
      }

      const valueResult = this.valueValidator.validate(val, keyContext);

      if (!valueResult.success) {
        errors.push(...valueResult.errors);
      } else {
        result[key] = valueResult.data;
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
      data: result as Record<K, V>,
      errors: [],
    };
  }
}
