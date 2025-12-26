/**
 * Base Framework Adapter
 * @module adapters/base
 *
 * Provides base adapter interface and implementation that wraps FormStateManager
 * for framework-specific integrations.
 */

import { FormStateManager } from '@notification/form-state-manager';

import type {
  FieldChangeCallback,
  FieldState,
  FormChangeCallback,
  FormState,
  FormStateOptions,
  Unsubscribe,
} from '@notification/types';
import type { IValidator, ValidationResult } from '#types/index';

/**
 * Framework adapter interface
 *
 * Defines the contract that all framework adapters must implement.
 * Provides a unified API for form validation across different frameworks.
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
 * Base framework adapter implementation
 *
 * Abstract class that provides common adapter functionality by wrapping
 * FormStateManager. Framework-specific adapters should extend this class.
 *
 * @example
 * ```typescript
 * class ReactAdapter<T> extends BaseFrameworkAdapter<T> {
 *   // React-specific implementation
 * }
 * ```
 */
export abstract class BaseFrameworkAdapter<
  T extends Record<string, unknown>,
> implements IFrameworkAdapter<T> {
  protected formManager: FormStateManager<T>;
  private subscriptions: Unsubscribe[] = [];

  constructor(
    validators: { [K in keyof T]?: IValidator<unknown, T[K]> },
    options?: FormStateOptions<T>,
  ) {
    this.formManager = new FormStateManager(validators, options);
  }

  // -------------------------------------------------------------------------
  // State Access
  // -------------------------------------------------------------------------

  getFormState(): FormState<T> {
    return this.formManager.getFormState();
  }

  getFieldState<K extends keyof T>(field: K): FieldState<T[K]> | undefined {
    return this.formManager.getFieldState(field);
  }

  getAllFieldStates(): { [K in keyof T]?: FieldState<T[K]> } {
    return this.formManager.getAllFieldStates();
  }

  getValues(): Partial<T> {
    return this.formManager.getValues();
  }

  // -------------------------------------------------------------------------
  // Field Operations
  // -------------------------------------------------------------------------

  setFieldValue<K extends keyof T>(field: K, value: T[K], options?: { validate?: boolean }): void {
    this.formManager.setFieldValue(field, value, options);
  }

  setValues(values: Partial<T>, options?: { validate?: boolean }): void {
    this.formManager.setValues(values, options);
  }

  touchField(field: keyof T): void {
    this.formManager.touchField(field);
  }

  clearErrors(): void {
    this.formManager.clearErrors();
  }

  // -------------------------------------------------------------------------
  // Validation
  // -------------------------------------------------------------------------

  validateField<K extends keyof T>(field: K): ValidationResult<T[K]> {
    return this.formManager.validateField(field);
  }

  validateAll(): ValidationResult<T> {
    return this.formManager.validateAll();
  }

  // -------------------------------------------------------------------------
  // Reset
  // -------------------------------------------------------------------------

  resetField<K extends keyof T>(field: K, value?: T[K]): void {
    this.formManager.resetField(field, value);
  }

  resetAll(values?: Partial<T>): void {
    this.formManager.resetAll(values);
  }

  // -------------------------------------------------------------------------
  // Subscription
  // -------------------------------------------------------------------------

  subscribeToField<K extends keyof T>(field: K, callback: FieldChangeCallback<T[K]>): Unsubscribe {
    const unsubscribe = this.formManager.subscribeToField(field, callback);
    this.subscriptions.push(unsubscribe);
    return unsubscribe;
  }

  subscribeToForm(callback: FormChangeCallback<T>): Unsubscribe {
    const unsubscribe = this.formManager.subscribeToForm(callback);
    this.subscriptions.push(unsubscribe);
    return unsubscribe;
  }

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  destroy(): void {
    // Cleanup all subscriptions
    for (const unsubscribe of this.subscriptions) {
      unsubscribe();
    }
    this.subscriptions = [];
  }
}

/**
 * Adapter utilities
 *
 * Common helper functions for framework adapters
 */
export const AdapterUtils = {
  /**
   * Check if field has errors
   */
  hasFieldErrors<T>(fieldState?: FieldState<T>): boolean {
    return fieldState ? fieldState.errors.length > 0 : false;
  },

  /**
   * Get first error message for a field
   */
  getFirstError<T>(fieldState?: FieldState<T>): string | undefined {
    return fieldState?.errors[0]?.message;
  },

  /**
   * Check if field should show errors
   * (typically shown only after field is touched)
   */
  shouldShowErrors<T>(fieldState?: FieldState<T>): boolean {
    return fieldState ? fieldState.touched && fieldState.errors.length > 0 : false;
  },

  /**
   * Format errors for display
   */
  formatErrors<T>(fieldState?: FieldState<T>): string[] {
    return fieldState?.errors.map((err) => err.message) ?? [];
  },

  /**
   * Check if form is submittable
   */
  canSubmit<T extends Record<string, unknown>>(formState: FormState<T>): boolean {
    return formState.isValid && !formState.validating;
  },

  /**
   * Get field binding helpers for common input props
   */
  getFieldBindings<T extends Record<string, unknown>, K extends keyof T>(
    adapter: IFrameworkAdapter<T>,
    field: K,
  ): {
    value: T[K] | undefined;
    onChange: (value: T[K]) => void;
    onBlur: () => void;
    error: string | undefined;
    hasError: boolean;
  } {
    const fieldState = adapter.getFieldState(field);

    return {
      value: fieldState?.value,
      onChange: (value: T[K]) => {
        adapter.setFieldValue(field, value);
      },
      onBlur: () => {
        adapter.touchField(field);
      },
      error: this.getFirstError(fieldState),
      hasError: this.hasFieldErrors(fieldState),
    };
  },
};
