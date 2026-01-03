/**
 * @IsUrl Decorator
 * @module decorators/property/string/is-url
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that the value is a URL
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Website {
 *   @IsUrl()
 *   homepage: string;
 * }
 * ```
 */
export function IsUrl(options?: ValidationOptions): PropertyDecorator {
  return createTypeDecorator(() => string().url(options))();
}
