/**
 * @MaxDate Decorator
 * @module decorators/property/date/max-date
 */

import { date as dateVal } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that date is before or equal to the maximum date
 *
 * @param maxDate - Maximum valid date
 * @param options - Validation options
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Event {
 *   @MaxDate(new Date('2025-12-31'))
 *   endDate: Date;
 * }
 * ```
 */
export function MaxDate(maxDate: Date | string, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((max: Date | string, opts?: ValidationOptions) =>
    dateVal().max(max, opts),
  )(maxDate, options);
}
