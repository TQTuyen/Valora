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

/**
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

  /**
   * Create or get reactive form state
   */
  useForm(): VueFormState<T> {
    if (this.formStateRef) {
      return this.formStateRef;
    }

    const formState = this.getFormState();

    const fields = ref(formState.fields) as Ref<{ [K in keyof T]?: FieldState<T[K]> }>;
    const isValid = ref(formState.isValid);
    const validating = ref(formState.validating);
    const touched = ref(formState.touched);
    const dirty = ref(formState.dirty);
    const errors = ref(formState.errors);

    const canSubmitComputed = computed(() =>
      canSubmit({
        isValid: isValid.value,
        validating: validating.value,
      } as FormState<T>),
    );

    // Subscribe to form changes
    this.subscribeToForm((state: FormState<T>) => {
      fields.value = state.fields;
      isValid.value = state.isValid;
      validating.value = state.validating;
      touched.value = state.touched;
      dirty.value = state.dirty;
      errors.value = state.errors;
    });

    this.formStateRef = {
      fields,
      isValid,
      validating,
      touched,
      dirty,
      errors,
      canSubmit: canSubmitComputed,
    };

    return this.formStateRef;
  }

  /**
   * Get field bindings for v-model and event handlers
   *
   * @example
   * ```vue
   * <script setup>
   * const { modelValue, onBlur, error, hasError } = adapter.getFieldBindings('email');
   * </script>
   *
   * <template>
   *   <input v-model="modelValue" @blur="onBlur" />
   *   <span v-if="hasError">{{ error }}</span>
   * </template>
   * ```
   */
  getFieldBindings<K extends keyof T>(field: K) {
    const fieldState = this.useField(field);

    return {
      modelValue: computed({
        get: () => fieldState.value.value,
        set: (newValue: T[K]) => {
          this.setFieldValue(field, newValue);
        },
      }),
      onBlur: () => {
        this.touchField(field);
      },
      error: fieldState.firstError,
      hasError: fieldState.hasError,
      shouldShowError: fieldState.shouldShowError,
      errorMessages: fieldState.errorMessages,
    };
  }

  /**
   * Override destroy to cleanup Vue-specific resources
   */
  override destroy(): void {
    this.fieldStates.clear();
    this.formStateRef = null;
    super.destroy();
  }
}

/**
 * Create a Vue adapter instance
 *
 * @example
 * ```typescript
 * const adapter = createVueAdapter({
 *   email: string().email().required(),
 *   password: string().minLength(8).required()
 * });
 * ```
 */
export function createVueAdapter<T extends Record<string, unknown>>(
  validators: ValidatorMap<T>,
  options?: FormStateOptions<T>,
): VueAdapter<T> {
  return new VueAdapter(validators, options);
}

/**
 * Vue composable for form validation
 *
 * @example
 * ```typescript
 * const { adapter, formState } = useFormValidation({
 *   email: string().email().required(),
 *   password: string().minLength(8).required()
 * });
 * ```
 */
export function useFormValidation<T extends Record<string, unknown>>(
  validators: ValidatorMap<T>,
  options?: FormStateOptions<T>,
) {
  const adapter = new VueAdapter(validators, options);
  const formState = adapter.useForm();

  // Cleanup on unmount
  onBeforeUnmount(() => {
    adapter.destroy();
  });

  return {
    adapter,
    formState,
    validateAll: () => adapter.validateAll(),
    resetAll: (values?: Partial<T>) => adapter.resetAll(values),
    getValues: () => adapter.getValues(),
    setValues: (values: Partial<T>, opts?: { validate?: boolean }) =>
      adapter.setValues(values, opts),
  };
}

/**
 * Vue composable for single field validation
 *
 * @example
 * ```typescript
 * const email = useFieldValidation(adapter, 'email');
 * ```
 */
export function useFieldValidation<T extends Record<string, unknown>, K extends keyof T>(
  adapter: VueAdapter<T>,
  field: K,
) {
  const fieldState = adapter.useField(field);
  const bindings = adapter.getFieldBindings(field);

  return {
    ...fieldState,
    ...bindings,
    setValue: (value: T[K]) => adapter.setFieldValue(field, value),
    touch: () => adapter.touchField(field),
    reset: (value?: T[K]) => adapter.resetField(field, value),
    validate: () => adapter.validateField(field),
  };
}

// Export types
export type { ValidatorMap, FormStateOptions };
