/**
 * Logic Validator Class
 * @module validators/logic/validator
 */

import { BaseValidator } from '@validators/common/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Logic combinator validator
 *
 * @example
 * ```typescript
 * // Union type
 * const stringOrNumber = union(string(), number());
 *
 * // Intersection
 * const namedPerson = intersection(
 *   object({ name: string() }),
 *   object({ age: number() })
 * );
 * ```
 */
export class LogicValidator<T, U> extends BaseValidator<T, U> {
  readonly _type = 'logic';

  protected clone(): LogicValidator<T, U> {
    const cloned = new LogicValidator<T, U>();
    cloned.strategies = [...this.strategies];
    cloned.isRequired = this.isRequired;
    if (this.customMessage !== undefined) {
      cloned.customMessage = this.customMessage;
    }
    return cloned;
  }

  protected override checkType(value: T, context: ValidationContext): ValidationResult<U> {
    // Logic validators don't have a specific type check
    // They rely on their strategies to validate
    return this.succeed(value as unknown as U, context);
  }
}
