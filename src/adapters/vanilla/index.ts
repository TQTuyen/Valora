/**
 * Vanilla JS adapter
 * @module adapters/vanilla
 */

// Main exports
export { createVanillaAdapter } from './factory';
export { VanillaAdapter } from './vanilla-adapter';

// Types
export type {
  ErrorDisplayConfig,
  FieldBinding,
  FieldBindingConfig,
  FormBindingOptions,
} from './types';

// Low-level utilities (advanced use)
export { bindField, bindForm } from './dom-binder';
export { clearFieldErrors, clearFormErrors, renderFieldErrors } from './error-renderer';
export { EventManager } from './event-manager';
export { getFieldElement, getFieldValue, setFieldValue } from './field-selector';
