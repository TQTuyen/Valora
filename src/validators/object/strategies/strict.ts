/**
 * Strict Strategy
 * @module validators/object/strategies/strict
 */

import { BaseValidationStrategy } from '@core/index';

import type { ObjectSchema } from './types';
import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/** Strict object validation - no extra keys allowed */
export class StrictStrategy<T extends Record<string, unknown>> extends BaseValidationStrategy<
  Record<string, unknown>,
  T
> {
  readonly name = 'strict';

  constructor(
    private readonly schema: ObjectSchema<T>,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: Record<string, unknown>, context: ValidationContext): ValidationResult<T> {
    const schemaKeys = new Set(Object.keys(this.schema));
    const valueKeys = Object.keys(value);
    const extraKeys = valueKeys.filter((key) => !schemaKeys.has(key));

    if (extraKeys.length > 0) {
      return this.failure('object.extraKeys', context, {
        keys: extraKeys.join(', '),
      });
    }

    return this.success(value as T, context);
  }
}
