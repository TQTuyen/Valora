/**
 * Valora Core Engine
 * Implements 6 GoF Design Patterns for the validation framework
 *
 * Patterns implemented:
 * 1. Strategy Pattern - Pluggable validation algorithms
 * 2. Chain of Responsibility - Validation pipeline with configurable flow
 * 3. Observer Pattern - Validation state change notifications
 * 4. Factory Pattern - Validator creation and registration
 * 5. Decorator Pattern - Stackable validator wrappers
 * 6. Composite Pattern - Uniform interface for single/group validators
 *
 * @module core
 */

// Utility functions
export { createError, createFailureResult, createSuccessResult } from './utils/results';

// Pattern 1: Strategy Pattern
export { BaseValidationStrategy } from './strategy/base-strategy';

// Pattern 2: Chain of Responsibility
export { BaseValidationHandler, StrategyHandler, ValidationPipeline } from './chain/index';

// Pattern 3: Observer Pattern
export { SimpleObserver, ValidationSubject } from './observer/index';

// Pattern 4: Factory Pattern
export { ValidatorFactory } from './factory/validator-factory';

// Pattern 5: Decorator Pattern
export {
  DefaultDecorator,
  MessageDecorator,
  NullableDecorator,
  OptionalDecorator,
  TransformDecorator,
  ValidatorDecorator,
} from './decorator/index';

// Pattern 6: Composite Pattern
export { CompositeValidator } from './composite/composite-validator';

// TypeScript Decorators (Experimental)
export type { ValidateDecoratorOptions } from './decorators/index';
export { field, validate, validateInstance, ValoraValidationError } from './decorators/index';

// Type exports
export type {
  IValidationHandler,
  IValidationObserver,
  IValidationPipeline,
  IValidationStrategy,
  IValidationSubject,
  IValidator,
  IValidatorFactory,
  ValidationContext,
  ValidationError,
  ValidationEvent,
  ValidationResult,
  ValidatorRegistration,
} from '#types/index';
