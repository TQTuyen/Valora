/**
 * @IsFalse Decorator
 * @module decorators/property/boolean/is-false
 */

import { boolean } from '@validators/boolean';

import { createTypeDecorator } from '../../core/factory';

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
export function IsFalse(): PropertyDecorator {
  return createTypeDecorator(() => boolean().isFalse())();
}
