/**
 * Object Type Check Strategy
 * @module validators/common/strategies/object-type
 */

import { TypeCheckStrategy } from './type-check';

/**
 * Object type check strategy
 */
export class ObjectTypeStrategy extends TypeCheckStrategy<Record<string, unknown>> {
  readonly name = 'objectType';
  readonly expectedType = 'object';

  protected isCorrectType(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
