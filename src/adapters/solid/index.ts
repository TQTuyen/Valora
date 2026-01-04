/**
 * Solid adapter entry point
 * @module adapters/solid
 */

export { SolidAdapter } from './solid-adapter';
export { createSolidAdapter } from './factory';
export { createFieldValidation, createFormValidation } from './composables';

export type {
  SolidFieldBindings,
  SolidFieldState,
  SolidFormState,
  CreateFieldValidationReturn,
  CreateFormValidationReturn,
} from './types';

export type { ValidatorMap } from '../types';
export type { FormStateOptions } from '@notification/types';
