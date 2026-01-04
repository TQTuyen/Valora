/**
 * Svelte Adapter Types
 * @module adapters/svelte/types
 */

import type { SvelteAdapter } from './svelte-adapter';
import type { FieldState } from '@notification/types';
import type { ValidationResult } from '#types/index';
import type { Readable } from 'svelte/store';

/**
 * Svelte reactive field state
 */
export interface SvelteFieldState<T = unknown> {
  value: Readable<T | undefined>;
  touched: Readable<boolean>;
  dirty: Readable<boolean>;
  validating: Readable<boolean>;
  errors: Readable<ValidationResult['errors']>;
  isValid: Readable<boolean>;
  hasError: Readable<boolean>;
  firstError: Readable<string | undefined>;
  shouldShowError: Readable<boolean>;
  errorMessages: Readable<string[]>;
}

/**
 * Svelte reactive form state
 */
export interface SvelteFormState<T extends Record<string, unknown>> {
  fields: Readable<{ [K in keyof T]?: FieldState<T[K]> }>;
  isValid: Readable<boolean>;
  validating: Readable<boolean>;
  touched: Readable<boolean>;
  dirty: Readable<boolean>;
  errors: Readable<ValidationResult['errors']>;
  canSubmit: Readable<boolean>;
}

/**
 * Field bindings for Svelte inputs
 */
export interface SvelteFieldBindings<T> {
  value: Readable<T | undefined>;
  onInput: (value: T) => void;
  onBlur: () => void;
  error: Readable<string | undefined>;
  hasError: Readable<boolean>;
  shouldShowError: Readable<boolean>;
  errorMessages: Readable<string[]>;
}

/**
 * Return type for createFormValidation helper
 */
export interface CreateFormValidationReturn<T extends Record<string, unknown>> {
  adapter: SvelteAdapter<T>;
  formState: SvelteFormState<T>;
  validateAll: () => ValidationResult<T>;
  resetAll: (values?: Partial<T>) => void;
  getValues: () => Partial<T>;
  setValues: (values: Partial<T>, opts?: { validate?: boolean }) => void;
}

/**
 * Return type for createFieldValidation helper
 */
export type CreateFieldValidationReturn<
  T extends Record<string, unknown>,
  K extends keyof T,
> = SvelteFieldState<T[K]> &
  SvelteFieldBindings<T[K]> & {
    setValue: (value: T[K]) => void;
    touch: () => void;
    reset: (value?: T[K]) => void;
    validate: () => ValidationResult<T[K]>;
  };
