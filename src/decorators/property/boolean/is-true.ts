/**
 * @IsTrue Decorator
 * @module decorators/property/boolean/is-true
 */

import { boolean } from '@validators/boolean';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is true
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Terms {
 *   @IsBoolean()
 *   @IsTrue()
 *   accepted: boolean;
 * }
 * ```
 */
export function IsTrue(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => boolean().isTrue(opts))(options);
}
