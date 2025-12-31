/**
 * @IsObject Decorator
 * @module decorators/property/object/is-object
 */

import { object } from '@validators/object';

import { createTypeDecorator } from '../../core/factory';

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
export function IsObject(): PropertyDecorator {
  return createTypeDecorator(() => object())();
}
