/**
 * @IsFuture Decorator
 * @module decorators/property/date/is-future
 */

import { date } from '@validators/date';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that date is in the future
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Event {
 *   @IsDate()
 *   @IsFuture()
 *   scheduledDate: Date;
 * }
 * ```
 */
export function IsFuture(): PropertyDecorator {
  return createTypeDecorator(() => date().future())();
}
