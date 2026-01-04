/**
 * Svelte adapter entry point
 * @module adapters/svelte
 */

export { SvelteAdapter } from './svelte-adapter';
export { createSvelteAdapter } from './factory';
export { createFieldValidation, createFormValidation } from './composables';

export type {
  SvelteFieldBindings,
  SvelteFieldState,
  SvelteFormState,
  CreateFieldValidationReturn,
  CreateFormValidationReturn,
} from './types';

export type { ValidatorMap } from '../types';
export type { FormStateOptions } from '@notification/types';
