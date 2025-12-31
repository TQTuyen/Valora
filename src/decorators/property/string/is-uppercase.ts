/**
 * @IsUppercase Decorator
 * @module decorators/property/string/is-uppercase
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that string is all uppercase
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Config {
 *   @IsString()
 *   @IsUppercase()
 *   countryCode: string;
 * }
 * ```
 */
export function IsUppercase(): PropertyDecorator {
  return createTypeDecorator(() => string().uppercase())();
}
