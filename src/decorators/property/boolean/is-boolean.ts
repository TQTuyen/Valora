/**
 * @IsBoolean Decorator
 * @module decorators/property/boolean/is-boolean
 */

import { boolean } from '@validators/boolean';

import { createTypeDecorator } from '../../core/factory';

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
export function IsBoolean(): PropertyDecorator {
  return createTypeDecorator(() => boolean())();
}
