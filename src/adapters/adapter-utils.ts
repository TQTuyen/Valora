/**
 * Adapter Utilities
 * @module adapters/adapter-utils
 *
 * Common helper functions for framework adapters.
 */

import type { IFrameworkAdapter } from './types';
import type { FieldState, FormState } from '@notification/types';

/**
 * Check if field has errors
 */
export function hasFieldErrors<T>(fieldState?: FieldState<T>): boolean {
  return fieldState ? fieldState.errors.length > 0 : false;
}

/**
 * Get first error message for a field
 */
export function getFirstError<T>(fieldState?: FieldState<T>): string | undefined {
  return fieldState?.errors[0]?.message;
}

/**
 * Check if field should show errors
 * (typically shown only after field is touched)
 */
export function shouldShowErrors<T>(fieldState?: FieldState<T>): boolean {
  return fieldState ? fieldState.touched && fieldState.errors.length > 0 : false;
}

/**
 * Format errors for display
 */
export function formatErrors<T>(fieldState?: FieldState<T>): string[] {
  return fieldState?.errors.map((err) => err.message) ?? [];
}

/**
 * Check if form is submittable
 */
export function canSubmit<T extends Record<string, unknown>>(formState: FormState<T>): boolean {
  return formState.isValid && !formState.validating;
}

/**
 * Get field binding helpers for common input props
 *
 * @example
 * ```typescript
 * const bindings = getFieldBindings(adapter, 'email');
 * <input
 *   value={bindings.value}
 *   onChange={e => bindings.onChange(e.target.value)}
 *   onBlur={bindings.onBlur}
 * />
 * {bindings.hasError && <span>{bindings.error}</span>}
 * ```
 */
export function getFieldBindings<T extends Record<string, unknown>, K extends keyof T>(
  adapter: IFrameworkAdapter<T>,
  field: K,
): {
  value: T[K] | undefined;
  onChange: (value: T[K]) => void;
  onBlur: () => void;
  error: string | undefined;
  hasError: boolean;
} {
  const fieldState = adapter.getFieldState(field);

  return {
    value: fieldState?.value,
    onChange: (value: T[K]) => {
      adapter.setFieldValue(field, value);
    },
    onBlur: () => {
      adapter.touchField(field);
    },
    error: getFirstError(fieldState),
    hasError: hasFieldErrors(fieldState),
  };
}
