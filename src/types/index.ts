/**
 * Valora Type Definitions
 * Core type definitions for the validation framework
 * @module types
 */

// Error Types
export type { ValidationError } from './errors';

// Result Types
export type { ValidationContext, ValidationResult } from './results';

// Validator Types
export type {
  IAsyncValidationStrategy,
  IAsyncValidator,
  IValidationStrategy,
  IValidator,
  ValidationOptions,
} from './validators';

// Pattern Types (Chain of Responsibility, Observer, Factory)
export type {
  IValidationHandler,
  IValidationObserver,
  IValidationPipeline,
  IValidationSubject,
  IValidatorFactory,
  ValidationEvent,
  ValidatorRegistration,
} from './patterns';

// Schema Types
export type { Infer, InferInput, InferSchema, SchemaDefinition } from './schema';

// i18n Types
export type { II18nPlugin, LocaleMessages, MessageParams, SupportedLocale } from './i18n';

// Utility Types
export type { DeepPartial, DeepReadonly, Primitive } from './utility';
