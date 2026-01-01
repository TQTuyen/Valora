/**
 * Field Selector Utilities
 * @module adapters/vanilla/field-selector
 */

import type { FieldBindingConfig } from './types';

/**
 * Default field selector - finds field by name attribute
 */
export function defaultFieldSelector(fieldName: string, form: HTMLFormElement): HTMLElement | null {
  // Try by name attribute
  const byName = form.querySelector<HTMLElement>(`[name="${fieldName}"]`);
  if (byName) {
    return byName;
  }

  // Try by id
  const byId = form.querySelector<HTMLElement>(`#${fieldName}`);
  if (byId) {
    return byId;
  }

  return null;
}

/**
 * Get field element using configuration
 */
export function getFieldElement(
  fieldName: string,
  form: HTMLFormElement,
  config?: FieldBindingConfig,
): HTMLElement | null {
  const selector = config?.fieldSelector ?? defaultFieldSelector;
  return selector(fieldName, form);
}

/**
 * Extract value from field element
 */
export function getFieldValue(element: HTMLElement): unknown {
  if (element instanceof HTMLInputElement) {
    if (element.type === 'checkbox') {
      return element.checked;
    }
    if (element.type === 'number' || element.type === 'range') {
      return element.valueAsNumber;
    }
    if (element.type === 'date' || element.type === 'datetime-local') {
      return element.valueAsDate;
    }
    return element.value;
  }

  if (element instanceof HTMLSelectElement) {
    if (element.multiple) {
      return Array.from(element.selectedOptions).map((opt) => opt.value);
    }
    return element.value;
  }

  if (element instanceof HTMLTextAreaElement) {
    return element.value;
  }

  // Custom elements or other inputs
  return (element as HTMLInputElement).value;
}

/**
 * Set value on field element
 */
export function setFieldValue(element: HTMLElement, value: unknown): void {
  if (element instanceof HTMLInputElement) {
    if (element.type === 'checkbox') {
      element.checked = Boolean(value);
    } else if (element.type === 'radio') {
      element.checked = element.value === value;
    } else {
      element.value = String(value);
    }
  } else if (element instanceof HTMLSelectElement) {
    if (element.multiple && Array.isArray(value)) {
      Array.from(element.options).forEach((opt) => {
        opt.selected = value.includes(opt.value);
      });
    } else {
      element.value = String(value);
    }
  } else if (element instanceof HTMLTextAreaElement) {
    element.value = String(value);
  }
}
