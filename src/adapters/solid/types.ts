/**
 * Solid Adapter Types
 * @module adapters/solid/types
 */

import type { SolidAdapter } from './solid-adapter';
import type { FieldState } from '@notification/types';
import type { ValidationResult } from '#types/index';
import type { Accessor } from 'solid-js';

/**
 * Solid reactive field state
 */
export interface SolidFieldState<T = unknown> {
  value: Accessor<T | undefined>;
  touched: Accessor<boolean>;
  dirty: Accessor<boolean>;
  validating: Accessor<boolean>;
  errors: Accessor<ValidationResult['errors']>;
  isValid: Accessor<boolean>;
  hasError: Accessor<boolean>;
  firstError: Accessor<string | undefined>;
  shouldShowError: Accessor<boolean>;
  errorMessages: Accessor<string[]>;
}

/**
 * Solid reactive form state
 */
export interface SolidFormState<T extends Record<string, unknown>> {
  fields: Accessor<{ [K in keyof T]?: FieldState<T[K]> }>;
  isValid: Accessor<boolean>;
  validating: Accessor<boolean>;
  touched: Accessor<boolean>;
  dirty: Accessor<boolean>;
  errors: Accessor<ValidationResult['errors']>;
  canSubmit: Accessor<boolean>;
}

/**
 * Field bindings for Solid inputs
 */
export interface SolidFieldBindings<T> {
  value: Accessor<T | undefined>;
  onInput: (value: T) => void;
  onBlur: () => void;
  error: Accessor<string | undefined>;
  hasError: Accessor<boolean>;
  shouldShowError: Accessor<boolean>;
  errorMessages: Accessor<string[]>;
}

/**
 * Return type for createFormValidation helper
 */
export interface CreateFormValidationReturn<T extends Record<string, unknown>> {
  adapter: SolidAdapter<T>;
  formState: SolidFormState<T>;
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
> = SolidFieldState<T[K]> &
  SolidFieldBindings<T[K]> & {
    setValue: (value: T[K]) => void;
    touch: () => void;
    reset: (value?: T[K]) => void;
    validate: () => ValidationResult<T[K]>;
  };
