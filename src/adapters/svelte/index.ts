/**
 * Svelte adapter entry point
 * @module adapters/svelte
 */

export type { ValidatorMap } from '../types';
export { createFieldValidation, createFormValidation } from './composables';
export { createSvelteAdapter } from './factory';
export { SvelteAdapter } from './svelte-adapter';
export type {
  CreateFieldValidationReturn,
  CreateFormValidationReturn,
  SvelteFieldBindings,
  SvelteFieldState,
  SvelteFormState,
} from './types';
export type { FormStateOptions } from '@notification/types';
