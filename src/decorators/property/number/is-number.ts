/**
 * @IsNumber Decorator
 * @module decorators/property/number/is-number
 */

import { number } from '@validators/number';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is a number
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsNumber()
 *   age: number;
 * }
 * ```
 */
export function IsNumber(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => {
    const v = number();
    if (opts?.message) {
      v.withMessage(opts.message);
    }
    return v;
  })(options);
}
