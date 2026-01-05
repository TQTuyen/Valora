/**
 * Svelte helpers for Valora
 * @module adapters/svelte/composables
 */

import { onDestroy } from 'svelte';

import { SvelteAdapter } from './svelte-adapter';

import type { ValidatorMap } from '../types';
import type { CreateFieldValidationReturn, CreateFormValidationReturn } from './types';
import type { FormStateOptions } from '@notification/types';

/**
 * Create a Svelte adapter instance with automatic cleanup
 */
export function createFormValidation<T extends Record<string, unknown>>(
  validators: ValidatorMap<T>,
  options?: FormStateOptions<T>,
): CreateFormValidationReturn<T> {
  const adapter = new SvelteAdapter(validators, options);
  const formState = adapter.useForm();

  onDestroy(() => {
    adapter.destroy();
  });

  return {
    adapter,
    formState,
    validateAll: () => adapter.validateAll(),
    resetAll: (values?: Partial<T>) => {
      adapter.resetAll(values);
    },
    getValues: () => adapter.getValues(),
    setValues: (values: Partial<T>, opts?: { validate?: boolean }) => {
      adapter.setValues(values, opts);
    },
  };
}

/**
 * Svelte helper for a single field
 */
export function createFieldValidation<T extends Record<string, unknown>, K extends keyof T>(
  adapter: SvelteAdapter<T>,
  field: K,
): CreateFieldValidationReturn<T, K> {
  const fieldState = adapter.useField(field);
  const bindings = adapter.getFieldBindings(field);

  return {
    ...fieldState,
    ...bindings,
    setValue: (value: T[K]) => {
      adapter.setFieldValue(field, value);
    },
    touch: () => {
      adapter.touchField(field);
    },
    reset: (value?: T[K]) => {
      adapter.resetField(field, value);
    },
    validate: () => adapter.validateField(field),
  };
}
