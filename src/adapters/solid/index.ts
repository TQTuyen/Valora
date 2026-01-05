/**
 * Svelte adapter
 * @module adapters/svelte
 */

export type { ValidatorMap } from '../types';
export { createFieldValidation, createFormValidation } from './composables';
export { createSolidAdapter } from './factory';
export { SolidAdapter } from './solid-adapter';
export type {
  CreateFieldValidationReturn,
  CreateFormValidationReturn,
  SolidFieldBindings,
  SolidFieldState,
  SolidFormState,
} from './types';
export type { FormStateOptions } from '@notification/types';
