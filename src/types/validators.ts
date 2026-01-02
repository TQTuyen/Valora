/**
 * Validator Interface Types
 * @module types/validators
 */

import type { ValidationContext, ValidationResult } from './results';

/**
 * Interface for validation strategies (Strategy Pattern)
 * Each strategy encapsulates a single validation rule
 * @template TInput - Input type for the strategy
 * @template TOutput - Output type after validation
 */
export interface IValidationStrategy<TInput = unknown, TOutput = TInput> {
  /** Unique name for this strategy */
  readonly name: string;
  /** Execute the validation */
  validate(value: TInput, context: ValidationContext): ValidationResult<TOutput>;
}

/**
 * Interface for async validation strategies
 * @template TInput - Input type for the strategy
 * @template TOutput - Output type after validation
 */
export interface IAsyncValidationStrategy<TInput = unknown, TOutput = TInput> {
  /** Unique name for this strategy */
  readonly name: string;
  /** Execute the async validation */
  validate(value: TInput, context: ValidationContext): Promise<ValidationResult<TOutput>>;
}

/**
 * Core validator interface
 * All validators must implement this interface
 * @template TInput - Input type accepted by the validator
 * @template TOutput - Output type after validation/transformation
 */
export interface IValidator<TInput = unknown, TOutput = TInput> {
  /** Type identifier for this validator */
  readonly _type: string;

  /**
   * Validate a value
   * @param value - Value to validate
   * @param context - Optional validation context
   * @returns Validation result
   */
  validate(value: TInput, context?: ValidationContext): ValidationResult<TOutput>;
}

/**
 * Async validator interface
 * @template TInput - Input type accepted by the validator
 * @template TOutput - Output type after validation/transformation
 */
export interface IAsyncValidator<TInput = unknown, TOutput = TInput> {
  /** Type identifier for this validator */
  readonly _type: string;

  /**
   * Validate a value asynchronously
   * @param value - Value to validate
   * @param context - Optional validation context
   * @returns Promise of validation result
   */
  validateAsync(value: TInput, context?: ValidationContext): Promise<ValidationResult<TOutput>>;

  /**
   * Cancel pending validation
   */
  cancel(): void;

  /**
   * Check if validation is currently pending
   */
  isPending(): boolean;
}

/**
 * Common validation options for decorators
 */
export interface ValidationOptions {
  /** Custom error message */
  message?: string;
  /** Groups to which this validation belongs */
  groups?: string[];
  /** Whether to validate always, even if previous validators failed */
  always?: boolean;
}
