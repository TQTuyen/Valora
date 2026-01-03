/**
 * Transform Helper
 * @module plugins/transform/helper
 */

import { TransformDecorator } from '@core/index';

import type { IValidator } from '#types/index';

/**
 * Apply one or more transforms to a validator
 *
 * @param validator - The validator to wrap
 * @param transformers - One or more transform functions
 * @returns A new validator that applies the transforms to the output
 *
 * @example
 * ```typescript
 * const schema = transform(
 *   string().email(),
 *   trim(),
 *   toLowerCase()
 * );
 * ```
 */
export function transform<TInput, TOutput>(
  validator: IValidator<TInput, TOutput>,
  ...transformers: ((value: any) => any)[]
): IValidator<TInput, any> {
  let currentValidator = validator as unknown as IValidator<TInput, any>;

  for (const transformer of transformers) {
    currentValidator = new TransformDecorator(currentValidator, transformer);
  }

  return currentValidator;
}
