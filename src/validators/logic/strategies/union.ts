/**
 * Union Strategy
 * @module validators/logic/strategies/union
 */

import { BaseValidationStrategy } from '@core/index';
import { createError } from '@utils/index';

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/** Union type validator - value must match one of the types */
export class UnionStrategy<T, U> extends BaseValidationStrategy<T, U> {
  readonly name = 'union';

  constructor(private readonly validators: IValidator<T, U>[]) {
    super();
  }

  validate(value: T, context: ValidationContext): ValidationResult<U> {
    for (const validator of this.validators) {
      const result = validator.validate(value, context);
      if (result.success) {
        return result;
      }
    }

    return {
      success: false,
      errors: [
        createError('logic.union', 'Value does not match any type in the union', context.path),
      ],
      data: undefined,
    };
  }
}
