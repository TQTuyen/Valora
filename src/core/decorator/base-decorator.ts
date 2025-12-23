/**
 * Decorator Pattern - Base Decorator
 * @module core/decorator
 */

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
    // Lazy import to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
    const { OptionalDecorator } = require('./optional');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return new OptionalDecorator(this);
  }

  nullable(): IValidator<TInput | null, TOutput | null> {
    // Lazy import to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
    const { NullableDecorator } = require('./nullable');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return new NullableDecorator(this);
  }

  default(defaultValue: TOutput): IValidator<TInput | undefined | null, TOutput> {
    // Lazy import to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
    const { DefaultDecorator } = require('./default');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return new DefaultDecorator(this, defaultValue);
  }

  transform<U>(fn: (value: TOutput) => U): IValidator<TInput, U> {
    // Lazy import to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
    const { TransformDecorator } = require('./transform');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return new TransformDecorator(this, fn);
  }

  withMessage(message: string): IValidator<TInput, TOutput> {
    // Lazy import to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
    const { MessageDecorator } = require('./message');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return new MessageDecorator(this, message);
  }
}
