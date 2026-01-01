/**
 * Vue Adapter
 * @module adapters/vue
 *
 * Vue 3 Composition API adapter for Valora validation framework.
 */

import { computed, onBeforeUnmount, ref, type ComputedRef, type Ref } from 'vue';

import { BaseFrameworkAdapter } from '../base-adapter';
import {
  canSubmit,
  formatErrors,
  getFirstError,
  hasFieldErrors,
  shouldShowErrors,
} from '../adapter-utils';

import type { ValidatorMap } from '../types';
import type { FieldState, FormState, FormStateOptions } from '@notification/types';
import type { ValidationResult } from '#types/index';

/**
 * Vue reactive field state
 */
export interface VueFieldState<T = unknown> {
  value: Ref<T | undefined>;
  touched: Ref<boolean>;
  dirty: Ref<boolean>;
  validating: Ref<boolean>;
  errors: Ref<ValidationResult['errors']>;
  isValid: Ref<boolean>;
  hasError: ComputedRef<boolean>;
  firstError: ComputedRef<string | undefined>;
  shouldShowError: ComputedRef<boolean>;
  errorMessages: ComputedRef<string[]>;
}

/**
 * Vue reactive form state
 */
export interface VueFormState<T extends Record<string, unknown>> {
  fields: Ref<{ [K in keyof T]?: FieldState<T[K]> }>;
  isValid: Ref<boolean>;
  validating: Ref<boolean>;
  touched: Ref<boolean>;
  dirty: Ref<boolean>;
  errors: Ref<ValidationResult['errors']>;
  canSubmit: ComputedRef<boolean>;
}

**
 * Vue adapter for Valora validation framework
 *
 * Provides Vue 3 Composition API integration with reactive refs and computed properties.
 *
 * @template T - The form data type
 *
 * @example
 * ```typescript
 * const adapter = new VueAdapter({
 *   email: string().email().required(),
 *   age: number().min(18).required()
 * });
 *
 * const emailState = adapter.useField('email');
 * const formState = adapter.useForm();
 * ```
 */
export class VueAdapter<T extends Record<string, unknown>> extends BaseFrameworkAdapter<T> {
  private fieldStates = new Map<keyof T, VueFieldState<T[keyof T]>>();
  private formStateRef: VueFormState<T> | null = null;

  constructor(validators: ValidatorMap<T>, options?: FormStateOptions<T>) {
    super(validators, options);
  }

  /**
   * Create or get reactive field state
   */
  useField<K extends keyof T>(field: K): VueFieldState<T[K]> {
    // Check if already exists
    const existing = this.fieldStates.get(field);
    if (existing) {
      return existing as VueFieldState<T[K]>;
    }

    // Create reactive refs
    const fieldState = this.getFieldState(field);

    const value = ref(fieldState?.value) as Ref<T[K] | undefined>;
    const touched = ref(fieldState?.touched ?? false);
    const dirty = ref(fieldState?.dirty ?? false);
    const validating = ref(fieldState?.validating ?? false);
    const errors = ref(fieldState?.errors ?? []);
    const isValid = ref(fieldState?.isValid ?? true);

    // Computed properties
    const hasError = computed(() => hasFieldErrors({ errors: errors.value } as FieldState<T[K]>));
    const firstError = computed(() =>
      getFirstError({ errors: errors.value } as FieldState<T[K]>),
    );
    const shouldShowError = computed(() =>
      shouldShowErrors({
        touched: touched.value,
        errors: errors.value,
      } as FieldState<T[K]>),
    );
    const errorMessages = computed(() =>
      formatErrors({ errors: errors.value } as FieldState<T[K]>),
    );

    const reactiveState: VueFieldState<T[K]> = {
      value,
      touched,
      dirty,
      validating,
      errors,
      isValid,
      hasError,
      firstError,
      shouldShowError,
      errorMessages,
    };

    // Subscribe to changes
    this.subscribeToField(field, (state: FieldState<T[K]>) => {
      value.value = state.value;
      touched.value = state.touched;
      dirty.value = state.dirty;
      validating.value = state.validating;
      errors.value = state.errors;
      isValid.value = state.isValid;
    });

    this.fieldStates.set(field, reactiveState as VueFieldState<T[keyof T]>);
    return reactiveState;
  }

