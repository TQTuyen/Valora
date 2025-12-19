/**
 * Notification Layer Types
 * @module notification/types
 */

import type { ValidationResult } from '#types/index';

/** Field validation state */
export interface FieldState<T = unknown> {
  /** Current field value */
  value: T | undefined;
  /** Whether the field has been touched */
  touched: boolean;
  /** Whether the field has been modified */
  dirty: boolean;
  /** Whether validation is pending */
  validating: boolean;
  /** Current validation errors */
  errors: ValidationResult<T>['errors'];
  /** Whether the field is valid */
  isValid: boolean;
}

/** Form validation state */
export interface FormState<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Field states keyed by field name */
  fields: { [K in keyof T]?: FieldState<T[K]> };
  /** Whether all fields are valid */
  isValid: boolean;
  /** Whether the form is currently validating */
  validating: boolean;
  /** Whether any field has been touched */
  touched: boolean;
  /** Whether any field has been modified */
  dirty: boolean;
  /** All current errors */
  errors: ValidationResult['errors'];
}

/** Field change callback */
export type FieldChangeCallback<T = unknown> = (state: FieldState<T>) => void;

/** Form change callback */
export type FormChangeCallback<T extends Record<string, unknown> = Record<string, unknown>> = (
  state: FormState<T>,
) => void;

/** Unsubscribe function */
export type Unsubscribe = () => void;

/** Validation mode */
export type ValidationMode = 'onChange' | 'onBlur' | 'onSubmit';

/** Form state manager options */
export interface FormStateOptions<T extends Record<string, unknown>> {
  validationMode?: ValidationMode;
  initialValues?: Partial<T>;
}

/** Validation event types */
export type ValidationEventType =
  | 'validation:start'
  | 'validation:end'
  | 'validation:error'
  | 'field:change'
  | 'field:touch'
  | 'field:blur'
  | 'form:submit'
  | 'form:reset';

/** Event listener */
export type EventListener<T = unknown> = (event: T) => void;
