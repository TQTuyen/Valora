/**
 * @MinDate Decorator
 * @module decorators/property/date/min-date
 */

import { date as dateVal } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that date is after or equal to the minimum date
 *
 * @param minDate - Minimum valid date
 * @param options - Validation options
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Event {
 *   @MinDate(new Date('2024-01-01'))
 *   startDate: Date;
 * }
 * ```
 */
export function MinDate(minDate: Date | string, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((min: Date | string, opts?: ValidationOptions) =>
    dateVal().min(min, opts),
  )(minDate, options);
}
