/**
 * @IsObject Decorator
 * @module decorators/property/object/is-object
 */

import { object } from '@validators/object';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that the value is an object
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsObject()
 *   metadata: Record<string, unknown>;
 * }
 * ```
 */
export function IsObject(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => {
    const v = object();
    if (opts?.message) {
      v.withMessage(opts.message);
    }
    return v;
  })(options);
}
