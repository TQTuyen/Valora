/**
 * Valora - TypeScript-First Validation Framework
 * @module valora
 *
 * A production-grade validation framework featuring:
 * - 6 GoF Design Patterns (Strategy, Chain of Responsibility, Observer, Factory, Decorator, Composite)
 * - Full TypeScript type inference with `Infer<typeof schema>`
 * - Fluent chainable API like `v.string().email().required()`
 * - i18n support (English & Vietnamese)
 * - Tree-shakeable architecture
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
 *
 * const result = userSchema.validate(data);
 * if (result.success) {
 *   console.log(result.data); // User type inferred!
 * }
 * ```
 */

// -------------------------------------------------------------------------
// Schema Builder (Main API)
// -------------------------------------------------------------------------
export type { Infer, InferInput } from './schema/index';
export { v } from './schema/index';

// -------------------------------------------------------------------------
// Core Engine (6 GoF Patterns)
// -------------------------------------------------------------------------
export {
  // Chain of Responsibility Pattern
  BaseValidationHandler,
  // Strategy Pattern
  BaseValidationStrategy,
  // Composite Pattern
  CompositeValidator,
  DefaultDecorator,
  // TypeScript Decorators
  field,
  MessageDecorator,
  NullableDecorator,
  OptionalDecorator,
  SimpleObserver,
  TransformDecorator,
  validate,
  ValidationPipeline,
  // Observer Pattern
  ValidationSubject,
  // Decorator Pattern
  ValidatorDecorator,
  // Factory Pattern (Singleton)
  ValidatorFactory,
} from './core/index';

// -------------------------------------------------------------------------
// Validators
// -------------------------------------------------------------------------
export {
  allOf,
  and,
  anyOf,
  array,
  // Array
  ArrayValidator,
  // Base
  BaseValidator,
  // Boolean
  boolean,
  BooleanValidator,
  compare,
  // Comparison
  ComparisonValidator,
  // Date
  date,
  DateValidator,
  ifThenElse,
  intersection,
  lazy,
  literal,
  // Logic Combinators
  LogicValidator,
  nativeEnum,
  negate,
  not,
  nullable,
  nullish,
  number,
  // Number
  NumberValidator,
  object,
  // Object
  type ObjectSchema,
  ObjectValidator,
  oneOf,
  optional,
  or,
  ref,
  // String
  string,
  StringValidator,
  union,
  when,
  xor,
} from './validators/index';

// -------------------------------------------------------------------------
// Notification (Observer Pattern for UI)
// -------------------------------------------------------------------------
export {
  createEventEmitter,
  createFieldValidator,
  createFormState,
  type EventListener,
  type FieldChangeCallback,
  // Types
  type FieldState,
  type FormChangeCallback,
  type FormState,
  // Form State Manager
  FormStateManager,
  type Unsubscribe,
  // Event Emitter
  ValidationEventEmitter,
  type ValidationEventType,
} from './notification/index';

// -------------------------------------------------------------------------
// i18n Plugin
// -------------------------------------------------------------------------
export { configureI18n, getI18n, type I18nConfig, I18nPlugin, setI18n } from './plugins/i18n/index';
export type { LocaleMessages, MessageParams } from './types/index';

// -------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------
export type {
  // Observer Pattern Types
  IValidationObserver,
  IValidationStrategy,
  IValidationSubject,
  IValidator,
  // Factory Pattern Types
  IValidatorFactory,
  ValidationContext,
  ValidationError,
  ValidationEvent,
  // Core Types
  ValidationResult,
  ValidatorRegistration,
} from './types/index';

// -------------------------------------------------------------------------
// Utilities
// -------------------------------------------------------------------------
export {
  createError,
  // Result Helpers
  createFailureResult,
  createSuccessResult,
  // Deep Clone
  deepClone,
  isArray,
  isBoolean,
  isDate,
  isEmpty,
  isFunction,
  isNumber,
  // Type Guards
  isObject,
  isString,
  // Path Utilities
  pathToString,
  // Validation Patterns
  patterns,
  stringToPath,
} from './utils/index';
