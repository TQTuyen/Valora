/**
 * Solid Adapter Implementation
 * @module adapters/solid/solid-adapter
 */

import { createMemo, createSignal } from 'solid-js';

import {
  canSubmit,
  formatErrors,
  getFirstError,
  hasFieldErrors,
  shouldShowErrors,
} from '../adapter-utils';
import { BaseFrameworkAdapter } from '../base-adapter';

import type { SolidFieldBindings, SolidFieldState, SolidFormState } from './types';
import type { FieldState, FormState } from '@notification/types';

/**
 * Solid adapter for Valora
 */
export class SolidAdapter<T extends Record<string, unknown>> extends BaseFrameworkAdapter<T> {
  private fieldStates = new Map<keyof T, SolidFieldState<T[keyof T]>>();
  private formStateRef: SolidFormState<T> | null = null;

  /**
   * Create or get reactive field state
   */
  useField<K extends keyof T>(field: K): SolidFieldState<T[K]> {
    const existing = this.fieldStates.get(field);
    if (existing) {
      return existing as SolidFieldState<T[K]>;
    }

    const state = this.getFieldState(field);

    const [value, setValue] = createSignal<T[K] | undefined>(state?.value);
    const [touched, setTouched] = createSignal<boolean>(state?.touched ?? false);
    const [dirty, setDirty] = createSignal<boolean>(state?.dirty ?? false);
    const [validating, setValidating] = createSignal<boolean>(state?.validating ?? false);
    const [errors, setErrors] = createSignal<FieldState<T[K]>['errors']>(state?.errors ?? []);
    const [isValid, setIsValid] = createSignal<boolean>(state?.isValid ?? true);

    const hasError = createMemo(() => hasFieldErrors({ errors: errors() } as FieldState<T[K]>));
    const firstError = createMemo(() => getFirstError({ errors: errors() } as FieldState<T[K]>));
    const shouldShowError = createMemo(() =>
      shouldShowErrors({ touched: touched(), errors: errors() } as FieldState<T[K]>),
    );
    const errorMessages = createMemo(() => formatErrors({ errors: errors() } as FieldState<T[K]>));

    this.subscribeToField(field, (next: FieldState<T[K]>) => {
      setValue(() => next.value);
      setTouched(() => next.touched);
      setDirty(() => next.dirty);
      setValidating(() => next.validating);
      setErrors(() => next.errors);
      setIsValid(() => next.isValid);
    });

    const reactiveState: SolidFieldState<T[K]> = {
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

    this.fieldStates.set(field, reactiveState as SolidFieldState<T[keyof T]>);
    return reactiveState;
  }

  /**
   * Create or get reactive form state
   */
  useForm(): SolidFormState<T> {
    if (this.formStateRef) {
      return this.formStateRef;
    }

    const state = this.getFormState();

    const [fields, setFields] = createSignal<{ [K in keyof T]?: FieldState<T[K]> }>(state.fields);
    const [isValid, setIsValid] = createSignal<boolean>(state.isValid);
    const [validating, setValidating] = createSignal<boolean>(state.validating);
    const [touched, setTouched] = createSignal<boolean>(state.touched);
    const [dirty, setDirty] = createSignal<boolean>(state.dirty);
    const [errors, setErrors] = createSignal<FormState<T>['errors']>(state.errors);

    const canSubmitMemo = createMemo(() =>
      canSubmit({
        isValid: isValid(),
        validating: validating(),
      } as FormState<T>),
    );

    this.subscribeToForm((next: FormState<T>) => {
      setFields(() => ({ ...next.fields }));
      setIsValid(() => next.isValid);
      setValidating(() => next.validating);
      setTouched(() => next.touched);
      setDirty(() => next.dirty);
      setErrors(() => next.errors);
    });

    this.formStateRef = {
      fields,
      isValid,
      validating,
      touched,
      dirty,
      errors,
      canSubmit: canSubmitMemo,
    };

    return this.formStateRef;
  }

  /**
   * Get Solid-friendly field bindings
   */
  getFieldBindings<K extends keyof T>(field: K): SolidFieldBindings<T[K]> {
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
   * Cleanup Solid-specific resources
   */
  override destroy(): void {
    this.fieldStates.clear();
    this.formStateRef = null;
    super.destroy();
  }
}
