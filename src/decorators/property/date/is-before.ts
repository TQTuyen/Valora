/**
 * @IsBefore Decorator
 * @module decorators/property/date/is-before
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that date is before the given reference date
 *
 * @param referenceDate - Date must be before this
 * @param options - Validation options
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Event {
 *   @IsBefore(new Date('2025-12-31'))
 *   startDate: Date;
 * }
 * ```
 */
export function IsBefore(
  referenceDate: Date | string,
  options?: ValidationOptions,
): PropertyDecorator {
  return createPropertyDecorator((ref: Date | string, opts?: ValidationOptions) =>
    date().before(ref, opts),
  )(referenceDate, options);
}
