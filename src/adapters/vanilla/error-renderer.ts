/**
 * Error Renderer Utilities
 * @module adapters/vanilla/error-renderer
 */

import type { ErrorDisplayConfig } from './types';

/**
 * Default CSS classes
 */
const DEFAULT_ERROR_CLASS = 'valora-error';
const DEFAULT_ERROR_MESSAGE_CLASS = 'valora-error-message';
const DEFAULT_INVALID_INPUT_CLASS = 'valora-invalid';

/**
 * Generate unique error container ID for a field
 */
function getErrorContainerId(fieldName: string): string {
  return `valora-error-${fieldName}`;
}

/**
 * Create error element with accessibility attributes
 */
export function createErrorElement(
  fieldName: string,
  errors: string[],
  config?: ErrorDisplayConfig,
): HTMLElement {
  const container = document.createElement('div');
  const errorId = getErrorContainerId(fieldName);

  container.id = errorId;
  container.className = config?.errorClass ?? DEFAULT_ERROR_CLASS;
  container.setAttribute('role', 'alert');
  container.setAttribute('aria-live', 'polite');

  errors.forEach((error) => {
    const errorMessage = document.createElement('div');
    errorMessage.className = config?.errorMessageClass ?? DEFAULT_ERROR_MESSAGE_CLASS;
    errorMessage.textContent = error;
    container.appendChild(errorMessage);
  });

  return container;
}

/**
 * Render errors for a field with accessibility
 */
export function renderFieldErrors(
  field: HTMLElement,
  errors: string[],
  config?: ErrorDisplayConfig,
): void {
  // Use custom renderer if provided
  if (config?.customRenderer) {
    config.customRenderer(field, errors);
    return;
  }

  // Clear existing errors first
  clearFieldErrors(field, config);

  if (errors.length === 0) {
    return;
  }

  const fieldName = field.getAttribute('name') ?? field.id;
  if (!fieldName) {
    console.warn('Field has no name or id attribute, cannot render errors');
    return;
  }

  // Mark field as invalid
  field.setAttribute('aria-invalid', 'true');
  field.classList.add(config?.invalidInputClass ?? DEFAULT_INVALID_INPUT_CLASS);

  // Create error element
  const errorElement = createErrorElement(fieldName, errors, config);
  const errorId = getErrorContainerId(fieldName);

  // Link field to error with aria-describedby
  const existingDescribedBy = field.getAttribute('aria-describedby');
  if (existingDescribedBy) {
    field.setAttribute('aria-describedby', `${existingDescribedBy} ${errorId}`);
  } else {
    field.setAttribute('aria-describedby', errorId);
  }

  // Insert error element based on placement
  const placement = config?.errorPlacement ?? 'after';

  if (placement === 'after') {
    field.parentElement?.insertBefore(errorElement, field.nextSibling);
  } else if (placement === 'before') {
    field.parentElement?.insertBefore(errorElement, field);
  }
  // For 'custom' placement, customRenderer should be used
}

/**
 * Clear errors from a field
 */
export function clearFieldErrors(field: HTMLElement, config?: ErrorDisplayConfig): void {
  const fieldName = field.getAttribute('name') ?? field.id;
  if (!fieldName) {
    return;
  }

  // Remove aria-invalid
  field.removeAttribute('aria-invalid');
  field.classList.remove(config?.invalidInputClass ?? DEFAULT_INVALID_INPUT_CLASS);

  // Remove aria-describedby reference to error
  const errorId = getErrorContainerId(fieldName);
  const describedBy = field.getAttribute('aria-describedby');
  if (describedBy) {
    const newDescribedBy = describedBy
      .split(' ')
      .filter((id) => id !== errorId)
      .join(' ');

    if (newDescribedBy) {
      field.setAttribute('aria-describedby', newDescribedBy);
    } else {
      field.removeAttribute('aria-describedby');
    }
  }

  // Remove error element from DOM
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.remove();
  }
}

/**
 * Clear all errors from a form
 */
export function clearFormErrors(form: HTMLFormElement, config?: ErrorDisplayConfig): void {
  // Find all invalid fields
  const invalidClass = config?.invalidInputClass ?? DEFAULT_INVALID_INPUT_CLASS;
  const invalidFields = form.querySelectorAll<HTMLElement>(`.${invalidClass}`);

  invalidFields.forEach((field) => {
    clearFieldErrors(field, config);
  });

  // Also find and remove any error containers that might be orphaned
  const errorClass = config?.errorClass ?? DEFAULT_ERROR_CLASS;
  const errorContainers = form.querySelectorAll(`.${errorClass}`);

  errorContainers.forEach((container) => {
    container.remove();
  });
}
