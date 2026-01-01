/**
 * DOM Binder - Bidirectional DOM-Adapter synchronization
 * @module adapters/vanilla/dom-binder
 */

import { clearFieldErrors, clearFormErrors, renderFieldErrors } from './error-renderer';
import { EventManager } from './event-manager';
import { getFieldElement, getFieldValue, setFieldValue } from './field-selector';

import type { BaseFrameworkAdapter } from '../base-adapter';
import type { FieldBinding, FormBindingOptions } from './types';

/**
 * Bind a single field for bidirectional synchronization
 */
export function bindField<T extends Record<string, unknown>>(
  fieldName: keyof T,
  form: HTMLFormElement,
  adapter: BaseFrameworkAdapter<T>,
  options: FormBindingOptions,
  eventManager: EventManager,
): FieldBinding | null {
  const element = getFieldElement(String(fieldName), form, options.fieldBinding);

  if (!element) {
    console.warn(`Field "${String(fieldName)}" not found in form`);
    return null;
  }

  // Adapter → DOM: Subscribe to field state changes
  const unsubscribe = adapter.subscribeToField(fieldName, (state) => {
    // Update element value if changed
    if (state.value !== getFieldValue(element)) {
      setFieldValue(element, state.value);
    }

    // Update error display
    if (state.errors.length > 0) {
      const errorMessages = state.errors.map((err) => err.message);
      renderFieldErrors(element, errorMessages, options.errorDisplay);
    } else {
      clearFieldErrors(element, options.errorDisplay);
    }
  });

  // DOM → Adapter: Listen to input events
  if (options.validateOnChange !== false) {
    eventManager.addEventListener(element, 'input', () => {
      const value = getFieldValue(element);
      adapter.setFieldValue(fieldName, value as T[keyof T], { validate: true });
    });
  }

  // DOM → Adapter: Listen to blur events
  if (options.validateOnBlur !== false) {
    eventManager.addEventListener(element, 'blur', () => {
      adapter.touchField(fieldName);
      const value = getFieldValue(element);
      adapter.setFieldValue(fieldName, value as T[keyof T], { validate: true });
    });
  }

  // Return binding with cleanup
  return {
    element,
    cleanup: () => {
      unsubscribe();
      clearFieldErrors(element, options.errorDisplay);
    },
  };
}

/**
 * Bind entire form with all fields
 */
export function bindForm<T extends Record<string, unknown>>(
  adapter: BaseFrameworkAdapter<T>,
  options: FormBindingOptions,
): () => void {
  const { form } = options;
  const eventManager = new EventManager();
  const fieldBindings: FieldBinding[] = [];

  // Get all field names from adapter
  const formState = adapter.getFormState();
  const fieldNames = Object.keys(formState.fields) as Array<keyof T>;

  // Bind all fields
  fieldNames.forEach((fieldName) => {
    const binding = bindField(fieldName, form, adapter, options, eventManager);
    if (binding) {
      fieldBindings.push(binding);
    }
  });

  // Setup form submission
  if (options.validateOnSubmit !== false) {
    eventManager.addSubmitListener(
      form,
      async () => {
        // Validate all fields
        const result = adapter.validateAll();

        if (result.success) {
          // Form is valid, call onSubmit if provided
          if (options.onSubmit) {
            const values = adapter.getValues();
            await options.onSubmit(values as Record<string, unknown>, form);
          }
        }
        // Errors are already displayed via field subscriptions
      },
      options.preventDefaultSubmit !== false,
    );
  }

  // Return cleanup function
  return () => {
    // Cleanup field bindings
    fieldBindings.forEach((binding) => {
      binding.cleanup();
    });

    // Cleanup event listeners
    eventManager.cleanup();

    // Clear all form errors
    clearFormErrors(form, options.errorDisplay);
  };
}
