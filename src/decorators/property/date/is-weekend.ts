/**
 * @IsWeekend Decorator
 * @module decorators/property/date/is-weekend
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is a weekend
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Trip {
 *   @IsWeekend()
 *   date: Date;
 * }
 * ```
 */
export function IsWeekend(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => date().weekend(opts))(options);
}
