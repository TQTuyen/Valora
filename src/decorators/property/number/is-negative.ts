/**
 * @IsNegative Decorator
 * @module decorators/property/number/is-negative
 */

import { number } from '@validators/number';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that number is negative (< 0)
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Transaction {
 *   @IsNumber()
 *   @IsNegative()
 *   debit: number;
 * }
 * ```
 */
export function IsNegative(): PropertyDecorator {
  return createTypeDecorator(() => number().negative())();
}
