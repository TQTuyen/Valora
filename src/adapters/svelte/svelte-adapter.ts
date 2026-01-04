/**
 * Svelte Adapter Implementation
 * @module adapters/svelte/svelte-adapter
 */

import { derived, writable } from 'svelte/store';

import {
  canSubmit,
  formatErrors,
  getFirstError,
  hasFieldErrors,
  shouldShowErrors,
} from '../adapter-utils';
import { BaseFrameworkAdapter } from '../base-adapter';

import type { SvelteFieldBindings, SvelteFieldState, SvelteFormState } from './types';
import type { FieldState, FormState } from '@notification/types';

/**
 * Svelte adapter for Valora
 */
export class SvelteAdapter<T extends Record<string, unknown>> extends BaseFrameworkAdapter<T> {
  private fieldStates = new Map<keyof T, SvelteFieldState<T[keyof T]>>();
  private formStateRef: SvelteFormState<T> | null = null;

  /**
   * Create or get reactive field state
   */
  useField<K extends keyof T>(field: K): SvelteFieldState<T[K]> {
    const existing = this.fieldStates.get(field);
    if (existing) {
      return existing as SvelteFieldState<T[K]>;
    }

    const state = this.getFieldState(field);

    const value = writable<T[K] | undefined>(state?.value);
    const touched = writable<boolean>(state?.touched ?? false);
    const dirty = writable<boolean>(state?.dirty ?? false);
    const validating = writable<boolean>(state?.validating ?? false);
    const errors = writable<FieldState<T[K]>['errors']>(state?.errors ?? []);
    const isValid = writable<boolean>(state?.isValid ?? true);

    const hasError = derived(errors, ($errors) =>
      hasFieldErrors({ errors: $errors } as FieldState<T[K]>),
    );
    const firstError = derived(errors, ($errors) =>
      getFirstError({ errors: $errors } as FieldState<T[K]>),
    );
    const shouldShowError = derived([touched, errors], ([$touched, $errors]) =>
      shouldShowErrors({ touched: $touched, errors: $errors } as FieldState<T[K]>),
    );
    const errorMessages = derived(errors, ($errors) =>
      formatErrors({ errors: $errors } as FieldState<T[K]>),
    );

    this.subscribeToField(field, (next: FieldState<T[K]>) => {
      value.set(next.value);
      touched.set(next.touched);
      dirty.set(next.dirty);
      validating.set(next.validating);
      errors.set(next.errors);
      isValid.set(next.isValid);
    });

    const reactiveState: SvelteFieldState<T[K]> = {
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

    this.fieldStates.set(field, reactiveState as SvelteFieldState<T[keyof T]>);
    return reactiveState;
  }

  /**
   * Create or get reactive form state
   */
  useForm(): SvelteFormState<T> {
    if (this.formStateRef) {
      return this.formStateRef;
    }

    const state = this.getFormState();

    const fields = writable<{ [K in keyof T]?: FieldState<T[K]> }>(state.fields);
    const isValid = writable<boolean>(state.isValid);
    const validating = writable<boolean>(state.validating);
    const touched = writable<boolean>(state.touched);
    const dirty = writable<boolean>(state.dirty);
    const errors = writable<FormState<T>['errors']>(state.errors);

    const canSubmitStore = derived([isValid, validating], ([$isValid, $validating]) =>
      canSubmit({ isValid: $isValid, validating: $validating } as FormState<T>),
    );

    this.subscribeToForm((next: FormState<T>) => {
      fields.set({ ...next.fields });
      isValid.set(next.isValid);
      validating.set(next.validating);
      touched.set(next.touched);
      dirty.set(next.dirty);
      errors.set(next.errors);
    });

    this.formStateRef = {
      fields,
      isValid,
      validating,
      touched,
      dirty,
      errors,
      canSubmit: canSubmitStore,
    };

    return this.formStateRef;
  }

  /**
   * Get Svelte-friendly field bindings
   */
  getFieldBindings<K extends keyof T>(field: K): SvelteFieldBindings<T[K]> {
    const fieldState = this.useField(field);

    return {
      value: fieldState.value,
      onInput: (newValue: T[K]) => {
        this.setFieldValue(field, newValue);
      },
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
   * Cleanup Svelte-specific resources
   */
  override destroy(): void {
    this.fieldStates.clear();
    this.formStateRef = null;
    super.destroy();
  }
}
