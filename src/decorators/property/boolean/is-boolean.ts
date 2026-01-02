/**
 * @IsBoolean Decorator
 * @module decorators/property/boolean/is-boolean
 */

import { boolean } from '@validators/boolean';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that the value is a boolean
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsBoolean()
 *   isActive: boolean;
 * }
 * ```
 */
export function IsBoolean(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => {
    const v = boolean();
    if (opts?.message) {
      v.withMessage(opts.message);
    }
    return v;
  })(options);
}
