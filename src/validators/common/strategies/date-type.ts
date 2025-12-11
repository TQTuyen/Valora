/**
 * Date Type Check Strategy
 * @module validators/common/strategies/date-type
 */

import { TypeCheckStrategy } from './type-check';

/**
 * Date type check strategy
 */
export class DateTypeStrategy extends TypeCheckStrategy<Date> {
  readonly name = 'dateType';
  readonly expectedType = 'date';

  protected isCorrectType(value: unknown): value is Date {
    return value instanceof Date && !Number.isNaN(value.getTime());
  }
}
