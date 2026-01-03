/**
 * Decorator Pattern - Preprocess Decorator
 * Transforms the input value before validation
 * @module core/decorator
 */

import { ValidatorDecorator } from './base-decorator';

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Transforms the input value before validation
 */
export class PreprocessDecorator<TInput, TPreprocessed, TOutput> extends ValidatorDecorator<
  TInput,
  TOutput
> {
  constructor(
    wrapped: IValidator<TPreprocessed, TOutput>,
    private readonly preprocessor: (value: TInput) => TPreprocessed,
  ) {
    // Cast wrapped to TInput because the input type changes
    super(wrapped as unknown as IValidator<TInput, TOutput>);
  }

  validate(value: TInput, context?: ValidationContext): ValidationResult<TOutput> {
    const preprocessed = this.preprocessor(value);
    return (this.wrapped as unknown as IValidator<TPreprocessed, TOutput>).validate(
      preprocessed,
      context,
    );
  }
}
