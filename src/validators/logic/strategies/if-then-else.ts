/**
 * IF-THEN-ELSE Strategy
 * @module validators/logic/strategies/if-then-else
 */

import { BaseValidationStrategy } from '@core/index';

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/** IF-THEN-ELSE conditional validator */
export class IfThenElseStrategy<T, U> extends BaseValidationStrategy<T, U> {
  readonly name = 'ifThenElse';

  constructor(
    private readonly condition: IValidator<T, unknown>,
    private readonly thenValidator: IValidator<T, U>,
    private readonly elseValidator?: IValidator<T, U>,
  ) {
    super();
  }

  validate(value: T, context: ValidationContext): ValidationResult<U> {
    const conditionResult = this.condition.validate(value, context);

    if (conditionResult.success) {
      return this.thenValidator.validate(value, context);
    }

    if (this.elseValidator) {
      return this.elseValidator.validate(value, context);
    }

    return this.success(value as unknown as U, context);
  }
}
