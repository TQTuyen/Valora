/**
 * String Type Check Strategy
 * @module validators/common/strategies/string-type
 */

import { TypeCheckStrategy } from './type-check';

/**
 * String type check strategy
 */
export class StringTypeStrategy extends TypeCheckStrategy<string> {
  readonly name = 'stringType';
  readonly expectedType = 'string';

  protected isCorrectType(value: unknown): value is string {
    return typeof value === 'string';
  }
}
