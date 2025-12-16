/**
 * XOR Strategy
 * @module validators/logic/strategies/xor
 */

import { BaseValidationStrategy } from '@core/index';
import { createError } from '@utils/index';

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/** XOR combinator - exactly one validator must pass */
export class XorStrategy<T, U> extends BaseValidationStrategy<T, U> {
  readonly name = 'xor';

  constructor(
    private readonly validatorA: IValidator<T, U>,
    private readonly validatorB: IValidator<T, U>,
  ) {
    super();
  }

  validate(value: T, context: ValidationContext): ValidationResult<U> {
    const resultA = this.validatorA.validate(value, context);
    const resultB = this.validatorB.validate(value, context);

    const aSuccess = resultA.success;
    const bSuccess = resultB.success;

    // XOR: exactly one must pass
    if (aSuccess && !bSuccess) {
      return resultA;
    }

    if (!aSuccess && bSuccess) {
      return resultB;
    }

    return {
      success: false,
      errors: [
        createError(
          'logic.xor',
          `Exactly one validation must pass, but ${
            aSuccess && bSuccess ? 'both passed' : 'neither passed'
          }`,
          context.path,
        ),
      ],
      data: undefined,
    };
  }
}
