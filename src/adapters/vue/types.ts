/**
 * Vue Adapter Types
 * @module adapters/vue/types
 */

import type { VueAdapter } from './vue-adapter';
import type { FieldState } from '@notification/types';
import type { ValidationResult } from '#types/index';
import type { ComputedRef, Ref } from 'vue';

/**
 * Vue reactive field state
 *
 * Wraps field state in Vue refs and computed properties for reactivity.
 */
export interface VueFieldState<T = unknown> {
  /** Current field value */
  value: Ref<T | undefined>;
  /** Whether field has been touched (focused and blurred) */
  touched: Ref<boolean>;
  /** Whether field value has changed from initial */
  dirty: Ref<boolean>;
  /** Whether field validation is in progress */
  validating: Ref<boolean>;
  /** Validation errors for this field */
  errors: Ref<ValidationResult['errors']>;
  /** Whether field has no validation errors */
  isValid: Ref<boolean>;
  /** Computed: whether field has any errors */
  hasError: ComputedRef<boolean>;
  /** Computed: first error message (if any) */
  firstError: ComputedRef<string | undefined>;
  /** Computed: whether errors should be displayed */
  shouldShowError: ComputedRef<boolean>;
  /** Computed: all error messages as strings */
  errorMessages: ComputedRef<string[]>;
}

/**
 * Vue reactive form state
 *
 * Wraps form state in Vue refs and computed properties for reactivity.
 */
export interface VueFormState<T extends Record<string, unknown>> {
  /** All field states */
  fields: Ref<{ [K in keyof T]?: FieldState<T[K]> }>;
  /** Whether entire form is valid */
  isValid: Ref<boolean>;
  /** Whether any field is validating */
  validating: Ref<boolean>;
  /** Whether any field has been touched */
  touched: Ref<boolean>;
  /** Whether any field is dirty */
  dirty: Ref<boolean>;
  /** All form validation errors */
  errors: Ref<ValidationResult['errors']>;
  /** Computed: whether form can be submitted */
  canSubmit: ComputedRef<boolean>;
}

/**
 * Field bindings for v-model and event handlers
 *
 * Provides Vue-compatible bindings for form fields.
 */
export interface VueFieldBindings<T> {
  /** v-model compatible value binding */
  modelValue: ComputedRef<T | undefined>;
  /** Blur event handler */
  onBlur: () => void;
  /** Computed: first error message */
  error: ComputedRef<string | undefined>;
  /** Computed: whether field has errors */
  hasError: ComputedRef<boolean>;
  /** Computed: whether to show errors */
  shouldShowError: ComputedRef<boolean>;
  /** Computed: all error messages */
  errorMessages: ComputedRef<string[]>;
}

/**
 * Return type for useFormValidation composable
 */
export interface UseFormValidationReturn<T extends Record<string, unknown>> {
  /** Vue adapter instance */
  adapter: VueAdapter<T>;
  /** Reactive form state */
  formState: VueFormState<T>;
  /** Validate all fields */
  validateAll: () => ValidationResult<T>;
  /** Reset all fields to initial state */
  resetAll: (values?: Partial<T>) => void;
  /** Get current form values */
  getValues: () => Partial<T>;
  /** Set form values (optionally validate) */
  setValues: (values: Partial<T>, opts?: { validate?: boolean }) => void;
}

/**
 * Return type for useFieldValidation composable
 */
export type UseFieldValidationReturn<
  T extends Record<string, unknown>,
  K extends keyof T,
> = VueFieldState<T[K]> &
  VueFieldBindings<T[K]> & {
    /** Set field value */
    setValue: (value: T[K]) => void;
    /** Mark field as touched */
    touch: () => void;
    /** Reset field to initial state */
    reset: (value?: T[K]) => void;
    /** Validate field */
    validate: () => ValidationResult<T[K]>;
  };
