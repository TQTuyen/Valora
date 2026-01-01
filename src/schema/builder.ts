/**
 * Schema Builder API
 * @module schema/builder
 *
 * Provides a fluent API for building validation schemas with full TypeScript inference.
 */

import { array } from '@validators/array/index';
import { async } from '@validators/async/index';
import { boolean } from '@validators/boolean/index';
import { business } from '@validators/business/index';
import { compare, literal, nativeEnum, ref } from '@validators/comparison/index';
import { date } from '@validators/date/index';
import { file } from '@validators/file/index';
import {
  and,
  intersection,
  lazy,
  not,
  nullable as logicNullable,
  nullish as logicNullish,
  optional as logicOptional,
  or,
  union,
} from '@validators/logic/index';
import { number } from '@validators/number/index';
import { object } from '@validators/object/index';
import { string } from '@validators/string/index';

import {
  CoerceBooleanValidator,
  CoerceDateValidator,
  CoerceNumberValidator,
  CoerceStringValidator,
} from './coerce/index';
import { RecordValidator } from './record';
import {
  AnyValidator,
  NeverValidator,
  NullValidator,
  UndefinedValidator,
  UnknownValidator,
  VoidValidator,
} from './special/index';
import { TupleValidator } from './tuple';

import type { IValidator } from '#types/index';

/**
 * Schema builder object providing factory functions for all validators.
 * This is the main entry point for creating validation schemas.
 *
 * @example
 * ```typescript
 * import { v, Infer } from '@tqtos/valora';
 *
 * const userSchema = v.object({
 *   name: v.string().minLength(2),
 *   email: v.string().email(),
 *   age: v.number().min(0).optional(),
 * });
 *
 * type User = Infer<typeof userSchema>;
 * // { name: string; email: string; age?: number }
 *
 * const result = userSchema.validate(data);
 * ```
 */
export const v = {
  // Primitive validators
  string,
  number,
  boolean,
  date,
  array,
  object,

  // Specialized validators
  async,
  business,
  file,

  // Logic combinators
  and,
  or,
  not,
  union,
  intersection,
  lazy,

  // Nullability
  optional: logicOptional,
  nullable: logicNullable,
  nullish: logicNullish,

  // Comparison/Literal
  literal,
  enum: nativeEnum,
  nativeEnum,
  ref,
  compare,

  // Shorthand aliases
  str: string,
  num: number,
  bool: boolean,
  arr: array,
  obj: object,

  // Special types
  any: (): AnyValidator => new AnyValidator(),
  unknown: (): UnknownValidator => new UnknownValidator(),
  never: (): NeverValidator => new NeverValidator(),
  void: (): VoidValidator => new VoidValidator(),
  null: (): NullValidator => new NullValidator(),
  undefined: (): UndefinedValidator => new UndefinedValidator(),

  // Record type (object with dynamic keys)
  record: <K extends string | number | symbol, V>(
    keyValidator: IValidator<unknown, K>,
    valueValidator: IValidator<unknown, V>,
  ): RecordValidator<K, V> => new RecordValidator(keyValidator, valueValidator),

  // Tuple type
  tuple: <T extends readonly IValidator<unknown, unknown>[]>(...validators: T): TupleValidator<T> =>
    new TupleValidator(validators),

  // Type utilities
  coerce: {
    string: (): CoerceStringValidator => new CoerceStringValidator(),
    number: (): CoerceNumberValidator => new CoerceNumberValidator(),
    boolean: (): CoerceBooleanValidator => new CoerceBooleanValidator(),
    date: (): CoerceDateValidator => new CoerceDateValidator(),
  },
} as const;
