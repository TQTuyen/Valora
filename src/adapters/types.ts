/**
 * Framework Adapter Types
 * @module adapters/types
 *
 * Type definitions for framework adapter interfaces.
 */

import type {
  FieldChangeCallback,
  FieldState,
  FormChangeCallback,
  FormState,
  Unsubscribe,
} from '@notification/types';
import type { IValidator, ValidationResult } from '#types/index';

/**
 * Framework adapter interface
 *
 * Defines the contract that all framework adapters must implement.
 * Provides a unified API for form validation across different frameworks.
 *
 * @template T - The form data type (must be a record)
 */
export interface IFrameworkAdapter<T extends Record<string, unknown>> {
  // -------------------------------------------------------------------------
  // State Access
  // -------------------------------------------------------------------------

  /** Get current form state */
  getFormState(): FormState<T>;

  /** Get state of a specific field */
  getFieldState<K extends keyof T>(field: K): FieldState<T[K]> | undefined;

  /** Get all field states */
  getAllFieldStates(): { [K in keyof T]?: FieldState<T[K]> };

  /** Get all current values */
  getValues(): Partial<T>;

  // -------------------------------------------------------------------------
  // Field Operations
  // -------------------------------------------------------------------------

  /** Set field value and optionally validate */
  setFieldValue<K extends keyof T>(field: K, value: T[K], options?: { validate?: boolean }): void;

  /** Set multiple values at once */
  setValues(values: Partial<T>, options?: { validate?: boolean }): void;

  /** Mark field as touched */
  touchField(field: keyof T): void;

  /** Clear all errors */
  clearErrors(): void;

  // -------------------------------------------------------------------------
  // Validation
  // -------------------------------------------------------------------------

  /** Validate a single field */
  validateField<K extends keyof T>(field: K): ValidationResult<T[K]>;

  /** Validate all fields */
  validateAll(): ValidationResult<T>;

  // -------------------------------------------------------------------------
  // Reset
  // -------------------------------------------------------------------------

  /** Reset field to initial state */
  resetField<K extends keyof T>(field: K, value?: T[K]): void;

  /** Reset all fields */
  resetAll(values?: Partial<T>): void;

  // -------------------------------------------------------------------------
  // Subscription
  // -------------------------------------------------------------------------

  /** Subscribe to field changes */
  subscribeToField<K extends keyof T>(field: K, callback: FieldChangeCallback<T[K]>): Unsubscribe;

  /** Subscribe to form-level changes */
  subscribeToForm(callback: FormChangeCallback<T>): Unsubscribe;

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  /** Cleanup subscriptions and resources */
  destroy(): void;
}

/**
 * Validator map for form fields
 */
export type ValidatorMap<T extends Record<string, unknown>> = {
  [K in keyof T]?: IValidator<unknown, T[K]>;
};
