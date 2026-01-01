/**
 * Vanilla Adapter Types
 * @module adapters/vanilla/types
 */

/**
 * Configuration for error display
 */
export interface ErrorDisplayConfig {
  /** CSS class for error container */
  errorClass?: string;
  /** CSS class for error message */
  errorMessageClass?: string;
  /** CSS class for invalid input */
  invalidInputClass?: string;
  /** Where to insert errors: 'after' | 'before' | 'custom' */
  errorPlacement?: 'after' | 'before' | 'custom';
  /** Custom error renderer function */
  customRenderer?: (field: HTMLElement, errors: string[]) => void;
}

/**
 * Configuration for field binding
 */
export interface FieldBindingConfig {
  /** Attribute to use for field names (default: 'name') */
  fieldAttribute?: string;
  /** Custom field selector function */
  fieldSelector?: (fieldName: string, form: HTMLFormElement) => HTMLElement | null;
}

/**
 * Form binding options
 */
export interface FormBindingOptions {
  /** The form element to bind */
  form: HTMLFormElement;
  /** Validate on input change (default: true) */
  validateOnChange?: boolean;
  /** Validate on blur (default: true) */
  validateOnBlur?: boolean;
  /** Validate on submit (default: true) */
  validateOnSubmit?: boolean;
  /** Prevent default submit (default: true) */
  preventDefaultSubmit?: boolean;
  /** Error display configuration */
  errorDisplay?: ErrorDisplayConfig;
  /** Field binding configuration */
  fieldBinding?: FieldBindingConfig;
  /** Custom submit handler */
  onSubmit?: (values: Record<string, unknown>, form: HTMLFormElement) => void | Promise<void>;
}

/**
 * Field binding result
 */
export interface FieldBinding {
  element: HTMLElement;
  cleanup: () => void;
}
