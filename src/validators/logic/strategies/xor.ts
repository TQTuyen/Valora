/**
 * XOR Strategy
 * @module validators/logic/strategies/xor
 */

import { BaseValidationStrategy } from '@core/index';

import type {
  IValidator,
  ValidationContext,
  ValidationOptions,
  ValidationResult,
} from '#types/index';

/** XOR combinator - exactly one validator must pass */
export class XorStrategy<T, U> extends BaseValidationStrategy<T, U> {
  readonly name = 'xor';

  constructor(
    private readonly validatorA: IValidator<T, U>,
    private readonly validatorB: IValidator<T, U>,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
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

    return this.failure('logic.xor', context);
  }
}
