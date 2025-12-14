/**
 * Strip Strategy
 * @module validators/object/strategies/strip
 */

import { BaseValidationStrategy } from '@core/index';

import type { ObjectSchema } from './types';
import type { ValidationContext, ValidationResult } from '#types/index';

/** Strip extra keys validation */
export class StripStrategy<T extends Record<string, unknown>> extends BaseValidationStrategy<
  Record<string, unknown>,
  T
> {
  readonly name = 'strip';

  constructor(private readonly schema: ObjectSchema<T>) {
    super();
  }

  validate(value: Record<string, unknown>, context: ValidationContext): ValidationResult<T> {
    const schemaKeys = new Set(Object.keys(this.schema));
    const stripped: Record<string, unknown> = {};

    for (const key of Object.keys(value)) {
      if (schemaKeys.has(key)) {
        stripped[key] = value[key];
      }
    }

    return this.success(stripped as T, context);
  }
}
