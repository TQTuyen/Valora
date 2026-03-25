/**
 * Vue Adapter Implementation
 * @module adapters/vue/vue-adapter
 */

import { computed, type Ref, ref } from 'vue';

import {
  canSubmit,
  formatErrors,
  getFirstError,
  hasFieldErrors,
  shouldShowErrors,
} from '../adapter-utils';
import { BaseFrameworkAdapter } from '../base-adapter';

import type { VueFieldBindings, VueFieldState, VueFormState } from './types';
import type { FieldState, FormState } from '@notification/types';

/**
 * Vue adapter for Valora validation framework
 *
 * Provides Vue 3 Composition API integration with reactive refs and computed properties.
 * Extends BaseFrameworkAdapter to add Vue-specific reactive state management.
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

  /**
   * Create or get reactive field state
   *
   * Returns a cached reactive field state if it already exists for the given field,
   * otherwise creates a new one with Vue refs and computed properties.
   *
   * @param field - Field name
   * @returns Reactive field state with Vue refs
   */
  useField<K extends keyof T>(field: K): VueFieldState<T[K]> {
    // Return cached state if exists
    const existing = this.fieldStates.get(field);
    if (existing) {
      return existing as VueFieldState<T[K]>;
    }

    // Get initial field state
    const fieldState = this.getFieldState(field);

    // Create reactive refs from field state
    const value = ref(fieldState?.value) as Ref<T[K] | undefined>;
    const touched = ref(fieldState?.touched ?? false);
    const dirty = ref(fieldState?.dirty ?? false);
    const validating = ref(fieldState?.validating ?? false);
    const errors = ref(fieldState?.errors ?? []);
    const isValid = ref(fieldState?.isValid ?? true);

    // Create computed properties using adapter utils
    const hasError = computed(() => hasFieldErrors({ errors: errors.value } as FieldState<T[K]>));
    const firstError = computed(() => getFirstError({ errors: errors.value } as FieldState<T[K]>));
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

    // Subscribe to field changes and update refs
    this.subscribeToField(field, (state: FieldState<T[K]>) => {
      value.value = state.value;
      touched.value = state.touched;
      dirty.value = state.dirty;
      validating.value = state.validating;
      errors.value = state.errors;
      isValid.value = state.isValid;
    });

    // Cache and return
    this.fieldStates.set(field, reactiveState as VueFieldState<T[keyof T]>);
    return reactiveState;
  }

  /**
   * Create or get reactive form state
   *
   * Returns a singleton reactive form state with Vue refs for the entire form.
   * Subsequent calls return the same cached instance.
   *
   * @returns Reactive form state with Vue refs
   */
  useForm(): VueFormState<T> {
    if (this.formStateRef) {
      return this.formStateRef;
    }

    // Get initial form state
    const formState = this.getFormState();

    // Create reactive refs from form state
    const fields = ref(formState.fields) as Ref<{ [K in keyof T]?: FieldState<T[K]> }>;
    const isValid = ref(formState.isValid);
    const validating = ref(formState.validating);
    const touched = ref(formState.touched);
    const dirty = ref(formState.dirty);
    const errors = ref(formState.errors);

    // Create computed property for submit readiness
    const canSubmitComputed = computed(() =>
      canSubmit({
        isValid: isValid.value,
        validating: validating.value,
      } as FormState<T>),
    );

    // Subscribe to form changes and update refs
    this.subscribeToForm((state: FormState<T>) => {
      fields.value = state.fields;
      isValid.value = state.isValid;
      validating.value = state.validating;
      touched.value = state.touched;
      dirty.value = state.dirty;
      errors.value = state.errors;
    });

    // Cache and return
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
   * Provides Vue-compatible bindings for form fields including v-model,
   * event handlers, and computed error properties.
   *
   * @param field - Field name
   * @returns Object with v-model bindings and event handlers
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
  getFieldBindings<K extends keyof T>(field: K): VueFieldBindings<T[K]> {
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
   * Cleanup Vue-specific resources
   *
   * Clears field states cache, form state, and calls parent cleanup
   * for subscriptions.
   */
  override destroy(): void {
    this.fieldStates.clear();
    this.formStateRef = null;
    super.destroy();
  }
}
