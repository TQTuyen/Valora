/**
 * Base Framework Adapter
 * @module adapters/base-adapter
 *
 * Abstract base class for framework-specific adapters.
 */

import { FormStateManager } from '@notification/form-state-manager';

import type { IFrameworkAdapter, ValidatorMap } from './types';
import type {
  FieldChangeCallback,
  FieldState,
  FormChangeCallback,
  FormState,
  FormStateOptions,
  Unsubscribe,
} from '@notification/types';
import type { ValidationResult } from '#types/index';

/**
 * Base framework adapter implementation
 *
 * Abstract class that provides common adapter functionality by wrapping
 * FormStateManager. Framework-specific adapters should extend this class
 * and add framework-specific reactive integrations.
 *
 * @template T - The form data type
 *
 * @example
 * ```typescript
 * class ReactAdapter<T> extends BaseFrameworkAdapter<T> {
 *   // Add React-specific hooks integration
 * }
 * ```
 */
export abstract class BaseFrameworkAdapter<
  T extends Record<string, unknown>,
> implements IFrameworkAdapter<T> {
  protected formManager: FormStateManager<T>;
  private subscriptions: Unsubscribe[] = [];

  constructor(validators: ValidatorMap<T>, options?: FormStateOptions<T>) {
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
    this.trackSubscription(unsubscribe);
    return unsubscribe;
  }

  subscribeToForm(callback: FormChangeCallback<T>): Unsubscribe {
    const unsubscribe = this.formManager.subscribeToForm(callback);
    this.trackSubscription(unsubscribe);
    return unsubscribe;
  }

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  destroy(): void {
    this.cleanupSubscriptions();
  }

  // -------------------------------------------------------------------------
  // Protected Helpers
  // -------------------------------------------------------------------------

  /**
   * Track subscription for automatic cleanup
   */
  protected trackSubscription(unsubscribe: Unsubscribe): void {
    this.subscriptions.push(unsubscribe);
  }

  /**
   * Cleanup all tracked subscriptions
   */
  protected cleanupSubscriptions(): void {
    for (const unsubscribe of this.subscriptions) {
      unsubscribe();
    }
    this.subscriptions = [];
  }
}
