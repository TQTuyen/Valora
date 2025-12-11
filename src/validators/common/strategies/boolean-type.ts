/**
 * Boolean Type Check Strategy
 * @module validators/common/strategies/boolean-type
 */

import { TypeCheckStrategy } from './type-check';

/**
 * Boolean type check strategy
 */
export class BooleanTypeStrategy extends TypeCheckStrategy<boolean> {
  readonly name = 'booleanType';
  readonly expectedType = 'boolean';

  protected isCorrectType(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }
}
