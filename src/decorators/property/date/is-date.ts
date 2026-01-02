/**
 * @IsDate Decorator
 * @module decorators/property/date/is-date
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that the value is a date
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Event {
 *   @IsDate()
 *   startDate: Date;
 * }
 * ```
 */
export function IsDate(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => {
    const v = date();
    if (opts?.message) {
      v.withMessage(opts.message);
    }
    return v;
  })(options);
}
