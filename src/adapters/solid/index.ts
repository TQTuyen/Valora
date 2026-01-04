/**
 * Solid adapter entry point
 * @module adapters/solid
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
