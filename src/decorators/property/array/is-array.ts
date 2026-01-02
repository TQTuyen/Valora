/**
 * @IsArray Decorator
 * @module decorators/property/array/is-array
 */

import { array } from '@validators/array';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is an array
 *
 * @decorator
 *
 * @example
 * ```typescript
 * class Example {
 *   @IsArray()
 *   items: any[];
 * }
 * ```
 */
export function IsArray(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => {
    const v = array();
    if (opts?.message) {
      v.withMessage(opts.message);
    }
    return v;
  })(options);
}
