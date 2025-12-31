/**
 * @IsUuid Decorator
 * @module decorators/property/string/is-uuid
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that the value is a UUID v4
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Resource {
 *   @IsUuid()
 *   id: string;
 * }
 * ```
 */
export function IsUuid(): PropertyDecorator {
  return createTypeDecorator(() => string().uuid())();
}
