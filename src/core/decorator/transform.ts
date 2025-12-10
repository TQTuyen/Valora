/**
 * Decorator Pattern - Transform Decorator
 * Transforms the output value
 * @module core/decorator
 */

import { createError, createFailureResult, createSuccessResult } from '../utils/results';

import { ValidatorDecorator } from './base-decorator';

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Transforms the output value
 */
export class TransformDecorator<TInput, TOutput, TTransformed> extends ValidatorDecorator<
  TInput,
  TTransformed
> {
  constructor(
    wrapped: IValidator<TInput, TOutput>,
    private readonly transformer: (value: TOutput) => TTransformed,
  ) {
    super(wrapped as unknown as IValidator<TInput, TTransformed>);
  }

  validate(value: TInput, context?: ValidationContext): ValidationResult<TTransformed> {
    const result = (this.wrapped as unknown as IValidator<TInput, TOutput>).validate(
      value,
      context,
    );

    if (!result.success || result.data === undefined) {
      return result as unknown as ValidationResult<TTransformed>;
    }

    try {
      const transformed = this.transformer(result.data);
      return createSuccessResult(transformed);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transform failed';
      return createFailureResult<TTransformed>([
        createError('common.transform', message, context?.path ?? []),
      ]);
    }
  }
}
