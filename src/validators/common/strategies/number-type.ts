/**
 * Number Type Check Strategy
 * @module validators/common/strategies/number-type
 */

import { TypeCheckStrategy } from './type-check';

/**
 * Number type check strategy
 */
export class NumberTypeStrategy extends TypeCheckStrategy<number> {
  readonly name = 'numberType';
  readonly expectedType = 'number';

  protected isCorrectType(value: unknown): value is number {
    return typeof value === 'number' && !Number.isNaN(value);
  }
}
