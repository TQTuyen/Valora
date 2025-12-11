/**
 * Array Type Check Strategy
 * @module validators/common/strategies/array-type
 */

import { TypeCheckStrategy } from './type-check';

/**
 * Array type check strategy
 */
export class ArrayTypeStrategy extends TypeCheckStrategy<unknown[]> {
  readonly name = 'arrayType';
  readonly expectedType = 'array';

  protected isCorrectType(value: unknown): value is unknown[] {
    return Array.isArray(value);
  }
}
