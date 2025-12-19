/**
 * Field Validator
 * Single field validator with reactive state
 * @module notification/field-validator
 */

import { createFormState } from './form-state-manager';

import type { FieldChangeCallback, FieldState, Unsubscribe } from './types';
import type { IValidator, ValidationResult } from '#types/index';

/**
 * Create a single field validator with reactive state
 *
 * @example
 * ```typescript
 * const emailField = createFieldValidator('email', v.string().email());
 *
 * emailField.subscribe((state) => {
 *   console.log('Email state:', state);
 * });
 *
 * emailField.setValue('test@example.com');
 * ```
 */
export function createFieldValidator<T>(
  name: string,
  validator: IValidator<unknown, T>,
  initialValue?: T,
): {
  getValue: () => T | undefined;
  setValue: (value: T) => void;
  validate: () => ValidationResult<T>;
  getState: () => FieldState<T>;
  subscribe: (callback: FieldChangeCallback<T>) => Unsubscribe;
  reset: (value?: T) => void;
  touch: () => void;
} {
  const form = createFormState({ [name]: validator }, { initialValues: { [name]: initialValue } });

  return {
    getValue: () => form.getFieldState(name)?.value,
    setValue: (value: T) => {
      form.setFieldValue(name, value);
    },
    validate: () => form.validateField(name) as ValidationResult<T>,
    getState: () => form.getFieldState(name) as FieldState<T>,
    subscribe: (callback: FieldChangeCallback<T>) =>
      form.subscribeToField(name, callback as FieldChangeCallback),
    reset: (value?: T) => {
      form.resetField(name, value);
    },
    touch: () => {
      form.touchField(name);
    },
  };
}
