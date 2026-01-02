/**
 * @IsAfter Decorator
 * @module decorators/property/date/is-after
 */

import { date as dateVal } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that date is after the given reference date
 *
 * @param referenceDate - Date must be after this
 * @param options - Validation options
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Event {
 *   @IsAfter(new Date('2024-01-01'))
 *   endDate: Date;
 * }
 * ```
 */
export function IsAfter(
  referenceDate: Date | string,
  options?: ValidationOptions,
): PropertyDecorator {
  return createPropertyDecorator((ref: Date | string, opts?: ValidationOptions) =>
    dateVal().after(ref, opts),
  )(referenceDate, options);
}
