/**
 * Form State Manager
 * Manages validation state for forms with Observer pattern
 * @module notification/form-state-manager
 */

import type {
  FieldChangeCallback,
  FieldState,
  FormChangeCallback,
  FormState,
  FormStateOptions,
  Unsubscribe,
  ValidationMode,
} from './types';
import type {
  IValidationObserver,
  IValidator,
  ValidationContext,
  ValidationEvent,
  ValidationResult,
} from '#types/index';

/**
 * Form state manager with Observer pattern
 *
 * Manages validation state for forms and provides subscription capabilities
 * for reactive UI updates.
 */
export class FormStateManager<T extends Record<string, unknown>> implements IValidationObserver {
  private validators: { [K in keyof T]?: IValidator<unknown, T[K]> };
  private fieldStates: { [K in keyof T]?: FieldState<T[K]> } = {};
  private fieldSubscribers: Map<keyof T, Set<FieldChangeCallback>> = new Map();
  private formSubscribers: Set<FormChangeCallback<T>> = new Set();
  private validationMode: ValidationMode = 'onChange';

  constructor(
    validators: { [K in keyof T]?: IValidator<unknown, T[K]> },
    options?: FormStateOptions<T>,
  ) {
    this.validators = validators;
    this.validationMode = options?.validationMode ?? 'onChange';

    // Initialize field states
    for (const field of Object.keys(validators) as (keyof T)[]) {
      this.fieldStates[field] = {
        value: options?.initialValues?.[field],
        touched: false,
        dirty: false,
        validating: false,
        errors: [],
        isValid: true,
      };
    }
  }

  // -------------------------------------------------------------------------
  // Observer Implementation
  // -------------------------------------------------------------------------

  onValidationStart(event: ValidationEvent): void {
    const field = event.field as keyof T;
    if (this.fieldStates[field]) {
      this.fieldStates[field].validating = true;
      this.notifyFieldChange(field);
    }
  }

  onValidationEnd(event: ValidationEvent): void {
    const field = event.field as keyof T;
    if (this.fieldStates[field]) {
      this.fieldStates[field].validating = false;
      this.fieldStates[field].errors = event.result.errors;
      this.fieldStates[field].isValid = event.result.success;
      this.notifyFieldChange(field);
    }
  }

  onValidationError(event: ValidationEvent): void {
    const field = event.field as keyof T;
    if (this.fieldStates[field]) {
      this.fieldStates[field].validating = false;
      this.fieldStates[field].errors = event.result.errors;
      this.fieldStates[field].isValid = false;
      this.notifyFieldChange(field);
    }
  }

  // -------------------------------------------------------------------------
  // Field Operations
  // -------------------------------------------------------------------------

  /** Get current state of a field */
  getFieldState<K extends keyof T>(field: K): FieldState<T[K]> | undefined {
    return this.fieldStates[field];
  }

  /** Get all field states */
  getAllFieldStates(): { [K in keyof T]?: FieldState<T[K]> } {
    return { ...this.fieldStates };
  }

  /** Set field value and optionally validate */
  setFieldValue<K extends keyof T>(field: K, value: T[K], options?: { validate?: boolean }): void {
    if (!this.fieldStates[field]) {
      this.fieldStates[field] = {
        value: undefined,
        touched: false,
        dirty: false,
        validating: false,
        errors: [],
        isValid: true,
      };
    }

    this.fieldStates[field].value = value;
    this.fieldStates[field].dirty = true;

    const shouldValidate = options?.validate ?? this.validationMode === 'onChange';

    if (shouldValidate) {
      this.validateField(field);
    } else {
      this.notifyFieldChange(field);
    }
  }

  /** Mark field as touched */
  touchField(field: keyof T): void {
    if (this.fieldStates[field]) {
      this.fieldStates[field].touched = true;

      if (this.validationMode === 'onBlur') {
        this.validateField(field);
      } else {
        this.notifyFieldChange(field);
      }
    }
  }

  /** Validate a single field */
  validateField<K extends keyof T>(field: K): ValidationResult<T[K]> {
    const validator = this.validators[field];
    const state = this.fieldStates[field];

    if (!validator || !state) {
      return {
        success: true,
        data: state?.value as T[K],
        errors: [],
      };
    }

    const context: ValidationContext = {
      path: [String(field)],
      field: String(field),
      locale: 'en',
      data: this.getValues(),
    };

    state.validating = true;
    this.notifyFieldChange(field);

    const result = validator.validate(state.value, context);

    state.validating = false;
    state.errors = result.errors;
    state.isValid = result.success;

    this.notifyFieldChange(field);
    this.notifyFormChange();

    return result;
  }

  /** Validate all fields */
  validateAll(): ValidationResult<T> {
    const allErrors: ValidationResult['errors'] = [];
    const values: Partial<T> = {};

    for (const field of Object.keys(this.validators) as (keyof T)[]) {
      const result = this.validateField(field);
      if (!result.success) {
        allErrors.push(...result.errors);
      } else {
        values[field] = result.data;
      }
    }

    return {
      success: allErrors.length === 0,
      data: allErrors.length === 0 ? (values as T) : undefined,
      errors: allErrors,
    };
  }

  /** Reset field to initial state */
  resetField<K extends keyof T>(field: K, value?: T[K]): void {
    if (this.fieldStates[field]) {
      this.fieldStates[field] = {
        value,
        touched: false,
        dirty: false,
        validating: false,
        errors: [],
        isValid: true,
      };
      this.notifyFieldChange(field);
      this.notifyFormChange();
    }
  }

  /** Reset all fields */
  resetAll(values?: Partial<T>): void {
    for (const field of Object.keys(this.validators) as (keyof T)[]) {
      this.resetField(field, values?.[field]);
    }
  }

  /** Clear all errors */
  clearErrors(): void {
    for (const field of Object.keys(this.fieldStates) as (keyof T)[]) {
      if (this.fieldStates[field]) {
        this.fieldStates[field].errors = [];
        this.fieldStates[field].isValid = true;
      }
    }
    this.notifyFormChange();
  }

  // -------------------------------------------------------------------------
  // Value Access
  // -------------------------------------------------------------------------

  /** Get all current values */
  getValues(): Partial<T> {
    const values: Partial<T> = {};
    for (const field of Object.keys(this.fieldStates) as (keyof T)[]) {
      values[field] = this.fieldStates[field]?.value;
    }
    return values;
  }

  /** Set multiple values at once */
  setValues(values: Partial<T>, options?: { validate?: boolean }): void {
    for (const [field, value] of Object.entries(values) as [keyof T, T[keyof T]][]) {
      this.setFieldValue(field, value, { validate: false });
    }

    if (options?.validate ?? this.validationMode === 'onChange') {
      this.validateAll();
    } else {
      this.notifyFormChange();
    }
  }

  // -------------------------------------------------------------------------
  // Subscription
  // -------------------------------------------------------------------------

  /** Subscribe to field changes */
  subscribeToField<K extends keyof T>(field: K, callback: FieldChangeCallback<T[K]>): Unsubscribe {
    if (!this.fieldSubscribers.has(field)) {
      this.fieldSubscribers.set(field, new Set());
    }

    this.fieldSubscribers.get(field)?.add(callback as FieldChangeCallback);

    // Immediately notify with current state
    const state = this.fieldStates[field];
    if (state) {
      callback(state);
    }

    return () => {
      this.fieldSubscribers.get(field)?.delete(callback as FieldChangeCallback);
    };
  }

  /** Subscribe to form-level changes */
  subscribeToForm(callback: FormChangeCallback<T>): Unsubscribe {
    this.formSubscribers.add(callback);

    // Immediately notify with current state
    callback(this.getFormState());

    return () => {
      this.formSubscribers.delete(callback);
    };
  }

  /** Alias for subscribeToField */
  subscribe<K extends keyof T>(field: K, callback: FieldChangeCallback<T[K]>): Unsubscribe {
    return this.subscribeToField(field, callback);
  }

  // -------------------------------------------------------------------------
  // Form State
  // -------------------------------------------------------------------------

  /** Get current form state */
  getFormState(): FormState<T> {
    const allErrors: ValidationResult['errors'] = [];
    let isValid = true;
    let touched = false;
    let dirty = false;
    let validating = false;

    for (const state of Object.values(this.fieldStates) as FieldState[]) {
      allErrors.push(...state.errors);
      if (!state.isValid) isValid = false;
      if (state.touched) touched = true;
      if (state.dirty) dirty = true;
      if (state.validating) validating = true;
    }

    return {
      fields: this.fieldStates,
      isValid,
      validating,
      touched,
      dirty,
      errors: allErrors,
    };
  }

  // -------------------------------------------------------------------------
  // Private Methods
  // -------------------------------------------------------------------------

  private notifyFieldChange(field: keyof T): void {
    const state = this.fieldStates[field];
    if (!state) return;

    const subscribers = this.fieldSubscribers.get(field);
    if (subscribers) {
      for (const callback of subscribers) {
        callback(state);
      }
    }

    this.notifyFormChange();
  }

  private notifyFormChange(): void {
    const formState = this.getFormState();
    for (const callback of this.formSubscribers) {
      callback(formState);
    }
  }
}

/**
 * Create a form state manager
 *
 * @example
 * ```typescript
 * const formState = createFormState({
 *   email: v.string().email(),
 *   password: v.string().minLength(8),
 * });
 *
 * formState.setFieldValue('email', 'test@example.com');
 * const result = formState.validateAll();
 * ```
 */
export function createFormState<T extends Record<string, unknown>>(
  validators: { [K in keyof T]?: IValidator<unknown, T[K]> },
  options?: FormStateOptions<T>,
): FormStateManager<T> {
  return new FormStateManager(validators, options);
}
