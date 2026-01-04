/**
 * Vue Composables for Validation
 * @module adapters/vue/composables
 */

import { onBeforeUnmount } from 'vue';

import { VueAdapter } from './vue-adapter';

import type { ValidatorMap } from '../types';
import type { UseFieldValidationReturn, UseFormValidationReturn } from './types';
import type { FormStateOptions } from '@notification/types';

/**
 * Vue composable for form validation
 *
 * Creates a Vue adapter instance with automatic lifecycle management.
 * The adapter is automatically destroyed when the component unmounts.
 *
 * @template T - The form data type
 * @param validators - Validator map for each field
 * @param options - Optional form state configuration
 * @returns Object with adapter, form state, and helper methods
 *
 * @example
 * ```typescript
 * const { adapter, formState, validateAll, getValues } = useFormValidation({
 *   email: string().email().required(),
 *   password: string().minLength(8).required()
 * });
 *
 * const handleSubmit = async () => {
 *   const result = validateAll();
 *   if (result.success) {
 *     await api.submit(getValues());
 *   }
 * };
 * ```
 */
export function useFormValidation<T extends Record<string, unknown>>(
  validators: ValidatorMap<T>,
  options?: FormStateOptions<T>,
): UseFormValidationReturn<T> {
  const adapter = new VueAdapter(validators, options);
  const formState = adapter.useForm();

  // Automatic cleanup on component unmount
  onBeforeUnmount(() => {
    adapter.destroy();
  });

  return {
    /** Vue adapter instance */
    adapter,
    /** Reactive form state */
    formState,
    /** Validate all fields */
    validateAll: () => adapter.validateAll(),
    /** Reset all fields to initial state */
    resetAll: (values?: Partial<T>) => {
      adapter.resetAll(values);
    },
    /** Get current form values */
    getValues: () => adapter.getValues(),
    /** Set form values (optionally validate) */
    setValues: (values: Partial<T>, opts?: { validate?: boolean }) => {
      adapter.setValues(values, opts);
    },
  };
}

/**
 * Vue composable for single field validation
 *
 * Provides reactive field state and helper methods for a specific field.
 * Should be used with an existing adapter instance.
 *
 * @template T - The form data type
 * @template K - The field key
 * @param adapter - Vue adapter instance
 * @param field - Field name
 * @returns Object with reactive field state and helper methods
 *
 * @example
 * ```typescript
 * const { adapter } = useFormValidation({ email: string().email() });
 * const email = useFieldValidation(adapter, 'email');
 *
 * // Access field state
 * console.log(email.value.value, email.hasError.value);
 *
 * // Use helper methods
 * email.setValue('test@example.com');
 * email.touch();
 * email.validate();
 * ```
 */
export function useFieldValidation<T extends Record<string, unknown>, K extends keyof T>(
  adapter: VueAdapter<T>,
  field: K,
): UseFieldValidationReturn<T, K> {
  const fieldState = adapter.useField(field);
  const bindings = adapter.getFieldBindings(field);

  return {
    // Field state (refs and computed)
    ...fieldState,
    // v-model bindings
    ...bindings,
    /** Set field value */
    setValue: (value: T[K]) => {
      adapter.setFieldValue(field, value);
    },
    /** Mark field as touched */
    touch: () => {
      adapter.touchField(field);
    },
    /** Reset field to initial state */
    reset: (value?: T[K]) => {
      adapter.resetField(field, value);
    },
    /** Validate field */
    validate: () => adapter.validateField(field),
  };
}
