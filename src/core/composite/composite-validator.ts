/**
 * Composite Pattern - Composite Validator
 * Combines multiple validators with a uniform interface
 * @module core/composite
 */

import { createFailureResult, createSuccessResult } from '../utils/results';

import type {
  IValidator,
  ValidationContext,
  ValidationError,
  ValidationResult,
} from '#types/index';

/**
 * Composite validator that combines multiple validators (Composite Pattern)
 */
export class CompositeValidator<TInput, TOutput = TInput> implements IValidator<TInput, TOutput> {
  readonly _type = 'composite';
  private validators: IValidator<unknown, unknown>[];

  constructor(validators: IValidator<unknown, unknown>[] = []) {
    this.validators = validators;
  }

  add(validator: IValidator<unknown, unknown>): this {
    this.validators.push(validator);
    return this;
  }

  remove(validator: IValidator<unknown, unknown>): this {
    const index = this.validators.indexOf(validator);
    if (index !== -1) {
      this.validators.splice(index, 1);
    }
    return this;
  }

  validate(value: TInput, context?: ValidationContext): ValidationResult<TOutput> {
    if (this.validators.length === 0) {
      return createSuccessResult(value as unknown as TOutput);
    }

    const ctx = context ?? { path: [], field: '', locale: 'en' };
    const allErrors: ValidationError[] = [];
    let currentValue: unknown = value;

    for (const validator of this.validators) {
      const result = validator.validate(currentValue, ctx);

      if (!result.success) {
        allErrors.push(...result.errors);
      } else if (result.data !== undefined) {
        currentValue = result.data;
      }
    }

    if (allErrors.length > 0) {
      return createFailureResult<TOutput>(allErrors);
    }

    return createSuccessResult(currentValue as TOutput);
  }

  get length(): number {
    return this.validators.length;
  }
}
