/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @IsRequired Decorator
 * @module decorators/property/common/is-required
 */

import { createPropertyDecorator } from '../../core/factory';

import type {
  IValidator,
  ValidationContext,
  ValidationOptions,
  ValidationResult,
} from '#types/index';

/**
 * Mark a property as required (cannot be null or undefined)
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsRequired()
 *   @IsString()
 *   name: string;
 * }
 * ```
 */
export function IsRequired(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => {
    return {
      _type: 'required',
      validate(value: unknown, context?: ValidationContext): ValidationResult<any> {
        if (value === null || value === undefined) {
          return {
            success: false,
            data: undefined,
            errors: [
              {
                code: 'required',
                message: opts?.message ?? 'This field is required',
                path: context?.path ?? [],
                field: context?.field ?? '',
              },
            ],
          };
        }
        return { success: true, data: value, errors: [] };
      },
    } as IValidator;
  })(options);
}
