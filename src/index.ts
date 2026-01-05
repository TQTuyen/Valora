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
  // Async
  async,
  AsyncStrategy,
  type AsyncValidationFn,
  AsyncValidator,
  // Base
  BaseValidator,
  // Boolean
  boolean,
  BooleanValidator,
  // Business
  business,
  BusinessValidator,
  compare,
  // Comparison
  ComparisonValidator,
  type CreditCardStrategy,
  CreditCardType,
  date,
  // Date
  DateValidator,
  DebounceStrategy,
  // File
  file,
  FILE_SIZE_UNITS,
  type FileExtensionStrategy,
  FileValidator,
  ifThenElse,
  intersection,
  lazy,
  literal,
  // Logic Combinators
  LogicValidator,
  MIME_TYPES,
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
  type RetryConfig,
  RetryStrategy,
  slugify,
  // String
  string,
  StringValidator,
  TimeoutStrategy,
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
// Decorators (Class-based validation)
// -------------------------------------------------------------------------
export {
  Validate,
  validateClassInstance,
  type ValidateOptions,
  ValoraValidationError,
} from './decorators/class/index';

// Property Decorators - Export all from decorators/property
export * from './decorators/property/index';

// -------------------------------------------------------------------------
// Plugins
// -------------------------------------------------------------------------
// i18n Plugin
export { configureI18n, getI18n, type I18nConfig, I18nPlugin, setI18n } from './plugins/i18n/index';

// Transform Plugin
export {
  arrayTransforms,
  // Composition utilities
  attempt,
  chain,
  compose,
  configureTransform,
  dateTransforms,
  debounce,
  getTransformPlugin,
  memoize,
  numberTransforms,
  objectTransforms,
  pipe,
  sequence,
  stringTransforms,
  tap,
  transform,
  TransformPlugin,
  when as whenTransform,
} from './plugins/transform/index';

// Transform Plugin Types
export type {
  ITransformPlugin,
  NamedTransformer,
  SameTypeTransformer,
  Transformer,
  TransformerMeta,
  TransformOptions,
} from './plugins/transform/types';

// -------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------
export type {
  // Utility Types
  DeepPartial,
  DeepReadonly,
  // i18n Types
  II18nPlugin,
  // Pattern Types
  IValidationHandler,
  IValidationPipeline,
  LocaleMessages,
  MessageParams,
  Primitive,
  SupportedLocale,
} from './types/index';

// -------------------------------------------------------------------------
// Framework Adapters
// -------------------------------------------------------------------------
export {
  BaseFrameworkAdapter,
  canSubmit,
  formatErrors,
  getFieldBindings,
  getFirstError,
  hasFieldErrors,
  type IFrameworkAdapter,
  shouldShowErrors,
  type ValidatorMap,
} from './adapters/index';

// -------------------------------------------------------------------------
// Vanilla Adapter
// -------------------------------------------------------------------------
export { createVanillaAdapter, VanillaAdapter } from './adapters/vanilla/index';

// -------------------------------------------------------------------------
// Solid Adapter
// -------------------------------------------------------------------------
export type {
  SolidFieldBindings,
  SolidFieldState,
  CreateFieldValidationReturn as SolidFieldValidation,
  SolidFormState,
  CreateFormValidationReturn as SolidFormValidation,
} from './adapters/solid/index';
export {
  createSolidAdapter,
  createFieldValidation as createSolidFieldValidation,
  createFormValidation as createSolidFormValidation,
  SolidAdapter,
} from './adapters/solid/index';

// -------------------------------------------------------------------------
// Svelte Adapter
// -------------------------------------------------------------------------
export type {
  SvelteFieldBindings,
  SvelteFieldState,
  CreateFieldValidationReturn as SvelteFieldValidation,
  SvelteFormState,
  CreateFormValidationReturn as SvelteFormValidation,
} from './adapters/svelte/index';
export {
  createSvelteAdapter,
  createFieldValidation as createSvelteFieldValidation,
  createFormValidation as createSvelteFormValidation,
  SvelteAdapter,
} from './adapters/svelte/index';

// -------------------------------------------------------------------------
// Vue Adapter
// -------------------------------------------------------------------------
export type { VueFieldBindings, VueFieldState, VueFormState } from './adapters/vue/index';
export {
  createVueAdapter,
  useFieldValidation as useVueFieldValidation,
  useFormValidation as useVueFormValidation,
  VueAdapter,
} from './adapters/vue/index';

// -------------------------------------------------------------------------
// Solid Adapter
// -------------------------------------------------------------------------
export type {
  CreateFieldValidationReturn,
  CreateFormValidationReturn,
  SolidFieldBindings,
  SolidFieldState,
  SolidFormState,
} from './adapters/index';
export {
  createSolidAdapter,
  createFieldValidation as createSolidFieldValidation,
  createFormValidation as createSolidFormValidation,
  SolidAdapter,
} from './adapters/index';

// -------------------------------------------------------------------------
// Additional Core Types (from types/index)
// -------------------------------------------------------------------------
export type {
  // Async Validator Types
  IAsyncValidationStrategy,
  IAsyncValidator,
  // Schema Types
  InferSchema,
  // Observer Pattern Types
  IValidationObserver,
  IValidationStrategy,
  IValidationSubject,
  IValidator,
  // Factory Pattern Types
  IValidatorFactory,
  SchemaDefinition,
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
