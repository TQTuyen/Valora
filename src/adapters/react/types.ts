import type { FieldState, FormState } from '@notification/types';

/**
 * React field state with computed helpers
 */
export interface ReactFieldState<T = unknown> extends FieldState<T> {
  hasError: boolean;
  firstError: string | undefined;
  shouldShowError: boolean;
  errorMessages: string[];
}

/**
 * React form state with computed helpers
 */
export interface ReactFormState<T extends Record<string, unknown>> extends FormState<T> {
  canSubmit: boolean;
}

/**
 * React field bindings for input elements
 */
export interface ReactFieldBindings<T> {
  value: T;
  onChange: (value: T) => void;
  onBlur: () => void;
  error: string | undefined;
  hasError: boolean;
  shouldShowError: boolean;
  errorMessages: string[];
}
