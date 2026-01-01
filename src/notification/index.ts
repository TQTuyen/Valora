/**
 * Notification Layer (Observer Pattern)
 * @module notification
 *
 * Provides reactive validation state management for UI framework integration.
 * Implements the Observer pattern for subscribing to validation changes.
 *
 * @example
 * ```typescript
 * import { createFormState, createFieldValidator } from '@tqtos/valora/notification';
 *
 * const formState = createFormState({
 *   email: v.string().email(),
 *   password: v.string().minLength(8),
 * });
 *
 * formState.subscribe('email', (state) => {
 *   console.log('Email validation:', state);
 * });
 *
 * formState.setFieldValue('email', 'test@example.com');
 * ```
 */

// Types
export type {
  EventListener,
  FieldChangeCallback,
  FieldState,
  FormChangeCallback,
  FormState,
  FormStateOptions,
  Unsubscribe,
  ValidationEventType,
  ValidationMode,
} from './types';

// Form State Manager
export { createFormState, FormStateManager } from './form-state-manager';

// Field Validator
export { createFieldValidator } from './field-validator';

// Event Emitter
export { createEventEmitter, ValidationEventEmitter } from './event-emitter';

// Re-export from types
export type { IValidationObserver, ValidationEvent } from '#types/index';
