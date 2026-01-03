/**
 * @IsNumeric Decorator
 * @module decorators/property/string/is-numeric
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that string contains only numeric characters
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Order {
 *   @IsString()
 *   @IsNumeric()
 *   orderNumber: string;
 * }
 * ```
 */
export function IsNumeric(options?: ValidationOptions): PropertyDecorator {
  return createTypeDecorator(() => string().numeric(options))();
}
