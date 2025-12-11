/**
 * Schema Builder API
 * @module schema
 *
 * Provides a fluent API for building validation schemas with full TypeScript inference.
 *
 * @example
 * ```typescript
 * import { v, Infer } from 'valora';
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

import { ArrayValidator } from '@validators/array/index';
import { BooleanValidator } from '@validators/boolean/index';
import { DateValidator } from '@validators/date/index';
import { NumberValidator } from '@validators/number/index';
import { ObjectValidator } from '@validators/object/index';
import { StringValidator } from '@validators/string/index';

import type { ObjectSchema } from '@validators/object/index';
import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

// -------------------------------------------------------------------------
// Type Inference
// -------------------------------------------------------------------------

/**
 * Infer the output type from a validator
 *
 * @example
 * ```typescript
 * const schema = v.object({
 *   name: v.string(),
 *   age: v.number().optional(),
 * });
 *
 * type User = Infer<typeof schema>;
 * // { name: string; age?: number }
 * ```
 */
export type Infer<T> = T extends IValidator<unknown, infer U> ? U : never;

/**
 * Infer the input type for a validator
 */
export type InferInput<T> = T extends IValidator<infer I, unknown> ? I : never;

// -------------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------------

// Schema Builder
export { v } from './builder';

// Special Validators
export {
  AnyValidator,
  NeverValidator,
  NullValidator,
  UndefinedValidator,
  UnknownValidator,
  VoidValidator,
} from './special/index';

// Record and Tuple Validators
export { RecordValidator } from './record';
export { TupleValidator } from './tuple';

// Coercion Validators
export {
  CoerceBooleanValidator,
  CoerceDateValidator,
  CoerceNumberValidator,
  CoerceStringValidator,
} from './coerce/index';

// Re-export validators for direct import
export {
  ArrayValidator,
  BooleanValidator,
  DateValidator,
  type IValidator,
  NumberValidator,
  type ObjectSchema,
  ObjectValidator,
  StringValidator,
  type ValidationContext,
  type ValidationResult,
};
