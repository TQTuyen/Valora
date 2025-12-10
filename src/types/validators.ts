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
