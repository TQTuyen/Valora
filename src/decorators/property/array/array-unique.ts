/**
 * @ArrayUnique Decorator
 * @module decorators/property/array/array-unique
 */

import { array } from '@validators/array';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that all array items are unique
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsArray()
 *   @ArrayUnique()
 *   emails: string[];
 * }
 * ```
 */
export function ArrayUnique(): PropertyDecorator {
  return createTypeDecorator(() => array().unique())();
}
