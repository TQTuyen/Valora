/**
 * IF-THEN-ELSE Strategy
 * @module validators/logic/strategies/if-then-else
 */

import { BaseValidationStrategy } from '@core/index';

import type {
  IValidator,
  ValidationContext,
  ValidationOptions,
  ValidationResult,
} from '#types/index';

/** IF-THEN-ELSE conditional validator */
export class IfThenElseStrategy<T, U> extends BaseValidationStrategy<T, U> {
  readonly name = 'ifThenElse';

  constructor(
    private readonly condition: IValidator<T, unknown>,
    private readonly thenValidator: IValidator<T, U>,
    private readonly elseValidator?: IValidator<T, U>,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: T, context: ValidationContext): ValidationResult<U> {
    const conditionResult = this.condition.validate(value, context);

    if (conditionResult.success) {
      const result = this.thenValidator.validate(value, context);
      if (!result.success && this.customMessage) {
        return this.failure('logic.ifThenElse', context);
      }
      return result;
    }

    if (this.elseValidator) {
      const result = this.elseValidator.validate(value, context);
      if (!result.success && this.customMessage) {
        return this.failure('logic.ifThenElse', context);
      }
      return result;
    }

    return this.success(value as unknown as U, context);
  }
}
