/**
 * React Adapter
 * @module adapters/react
 *
 * React Hooks adapter for Valora validation framework.
 */

export { createReactAdapter, ReactAdapter } from './adapter';
export {
  type UseFieldReturn,
  useFieldValidation,
  type UseFormReturn,
  useFormValidation,
} from './hooks';
export type { ReactFieldBindings, ReactFieldState, ReactFormState } from './types';

import type { ValidatorMap } from '../types';
import type { FormStateOptions } from '@notification/types';

export type { FormStateOptions, ValidatorMap };
