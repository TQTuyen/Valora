/**
 * @IsWeekday Decorator
 * @module decorators/property/date/is-weekday
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is a weekday
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class WorkDay {
 *   @IsWeekday()
 *   date: Date;
 * }
 * ```
 */
export function IsWeekday(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => date().weekday(opts))(options);
}
