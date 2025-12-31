/**
 * @IsTrue Decorator
 * @module decorators/property/boolean/is-true
 */

import { boolean } from '@validators/boolean';

import { createTypeDecorator } from '../../core/factory';

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
export function IsTrue(): PropertyDecorator {
  return createTypeDecorator(() => boolean().isTrue())();
}
