/**
 * @IsPast Decorator
 * @module decorators/property/date/is-past
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is in the past
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsPast()
 *   birthDate: Date;
 * }
 * ```
 */
export function IsPast(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => date().past(opts))(options);
}
