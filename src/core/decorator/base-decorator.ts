/**
 * Decorator Pattern - Base Decorator
 * @module core/decorator
 */

import { DefaultDecorator } from './default';
import { MessageDecorator } from './message';
import { NullableDecorator } from './nullable';
import { OptionalDecorator } from './optional';
import { TransformDecorator } from './transform';

import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Base decorator for validators (Decorator Pattern)
 */
export abstract class ValidatorDecorator<TInput, TOutput> implements IValidator<TInput, TOutput> {
  constructor(protected readonly wrapped: IValidator<TInput, TOutput>) {}

  get _type(): string {
    return this.wrapped._type;
  }

  abstract validate(value: TInput, context?: ValidationContext): ValidationResult<TOutput>;

  optional(): IValidator<TInput | undefined, TOutput | undefined> {
    return new OptionalDecorator(this);
  }

  nullable(): IValidator<TInput | null, TOutput | null> {
    return new NullableDecorator(this);
  }

  default(defaultValue: TOutput): IValidator<TInput | undefined | null, TOutput> {
    return new DefaultDecorator(this, defaultValue);
  }

  transform<U>(fn: (value: TOutput) => U): IValidator<TInput, U> {
    return new TransformDecorator(this, fn);
  }

  withMessage(message: string): IValidator<TInput, TOutput> {
    return new MessageDecorator(this, message);
  }
}
