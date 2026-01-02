/**
 * @IsToday Decorator
 * @module decorators/property/date/is-today
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is today
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Report {
 *   @IsToday()
 *   generatedAt: Date;
 * }
 * ```
 */
export function IsToday(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => date().today(opts))(options);
}
