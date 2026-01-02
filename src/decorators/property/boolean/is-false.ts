/**
 * @IsFalse Decorator
 * @module decorators/property/boolean/is-false
 */

import { boolean } from '@validators/boolean';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is false
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Settings {
 *   @IsBoolean()
 *   @IsFalse()
 *   disabled: boolean;
 * }
 * ```
 */
export function IsFalse(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => boolean().isFalse(opts))(options);
}
