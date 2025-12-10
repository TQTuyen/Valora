/**
 * GoF Design Pattern Types
 * Chain of Responsibility, Observer, and Factory patterns
 * @module types/patterns
 */

import type { ValidationContext, ValidationResult } from './results';
import type { IValidator } from './validators';

// ============================================================================
// Chain of Responsibility Pattern Types
// ============================================================================

/**
 * Handler in the validation chain (Chain of Responsibility Pattern)
 * @template T - Type of value being validated
 */
export interface IValidationHandler<T = unknown> {
  /**
   * Set the next handler in the chain
   * @param handler - Next handler
   * @returns The next handler for chaining
   */
  setNext(handler: IValidationHandler<T>): IValidationHandler<T>;

  /**
   * Handle the validation
   * @param value - Value to validate
   * @param context - Validation context
   * @returns Validation result
   */
  handle(value: T, context: ValidationContext): ValidationResult<T>;
}

/**
 * Pipeline for executing validation handlers
 * @template T - Type of value being validated
 */
export interface IValidationPipeline<T = unknown> {
  /**
   * Add a handler to the pipeline
   * @param handler - Handler to add
   * @returns This pipeline for chaining
   */
  addHandler(handler: IValidationHandler<T>): this;

  /**
   * Execute the pipeline
   * @param value - Value to validate
   * @param context - Validation context
   * @returns Validation result
   */
  execute(value: T, context: ValidationContext): ValidationResult<T>;
}

// ============================================================================
// Observer Pattern Types
// ============================================================================

/**
 * Validation event for observer pattern
 */
export interface ValidationEvent<T = unknown> {
  /** Type of event */
  type: 'start' | 'end' | 'error';
  /** Field being validated */
  field: string;
  /** Value being validated */
  value: T;
  /** Validation result (for end/error events) */
  result: ValidationResult<T>;
  /** Timestamp */
  timestamp: number;
}

/**
 * Observer for validation events (Observer Pattern)
 */
export interface IValidationObserver<T = unknown> {
  /** Called when validation starts */
  onValidationStart?(event: ValidationEvent<T>): void;
  /** Called when validation ends */
  onValidationEnd?(event: ValidationEvent<T>): void;
  /** Called when validation has an error */
  onValidationError?(event: ValidationEvent<T>): void;
}

/**
 * Subject that observers can subscribe to (Observer Pattern)
 */
export interface IValidationSubject<T = unknown> {
  /**
   * Subscribe an observer
   * @param observer - Observer to subscribe
   */
  addObserver(observer: IValidationObserver<T>): void;

  /**
   * Unsubscribe an observer
   * @param observer - Observer to unsubscribe
   */
  removeObserver(observer: IValidationObserver<T>): void;

  /**
   * Notify all observers of an event
   * @param event - Event to notify
   */
  notifyObservers(event: ValidationEvent<T>): void;
}

// ============================================================================
// Factory Pattern Types
// ============================================================================

/**
 * Registration entry for a validator (Factory Pattern)
 * @template T - Type of validator
 */
export interface ValidatorRegistration<T extends IValidator = IValidator> {
  /** Unique name for this validator */
  name: string;
  /** Factory function to create the validator */
  factory: () => T;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Factory for creating validators (Factory Pattern)
 */
export interface IValidatorFactory {
  /**
   * Register a validator
   * @param registration - Registration entry
   */
  register<T extends IValidator>(registration: ValidatorRegistration<T>): void;

  /**
   * Create a validator by name
   * @param name - Name of the validator
   * @returns New validator instance
   */
  create(name: string): IValidator | undefined;

  /**
   * Check if a validator is registered
   * @param name - Name to check
   * @returns true if registered
   */
  has(name: string): boolean;

  /**
   * Get all registrations
   * @returns Array of all registrations
   */
  getAll(): ValidatorRegistration[];
}
