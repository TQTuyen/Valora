/**
 * @IsFuture Decorator
 * @module decorators/property/date/is-future
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is in the future
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Event {
 *   @IsFuture()
 *   startDate: Date;
 * }
 * ```
 */
export function IsFuture(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => date().future(opts))(options);
}
