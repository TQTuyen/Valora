/**
 * @IsOptional Decorator
 * @module decorators/property/common/is-optional
 */

import { createPropertyDecorator } from '../../core/factory';

import type { IValidator } from '#types/index';

/**
 * Mark a property as optional (allows undefined)
 *
 * When applied, the property can be undefined without causing validation errors.
 * This is useful for optional fields in forms or API requests.
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsString()
 *   name: string;
 *
 *   @IsOptional()
 *   @IsString()
 *   middleName?: string;
 * }
 * ```
 */
export function IsOptional(): PropertyDecorator {
  return createPropertyDecorator(() => {
    // Create a pass-through validator that accepts undefined
    return {
      _type: 'optional',
      validate(value: unknown) {
        if (value === undefined) {
          return { success: true, data: undefined, errors: [] };
        }
        // If value is not undefined, let other validators handle it
        return { success: true, data: value, errors: [] };
      },
    } as IValidator;
  })();
}
