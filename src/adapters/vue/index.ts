/**
 * Vue Adapter
 * @module adapters/vue
 *
 * Vue 3 Composition API adapter for Valora validation framework.
 */

import { computed, onBeforeUnmount, ref, type ComputedRef, type Ref } from 'vue';

import { BaseFrameworkAdapter } from '../base-adapter';
import {
  canSubmit,
  formatErrors,
  getFirstError,
  hasFieldErrors,
  shouldShowErrors,
} from '../adapter-utils';

import type { ValidatorMap } from '../types';
import type { FieldState, FormState, FormStateOptions } from '@notification/types';
import type { ValidationResult } from '#types/index';

/**
 * Vue reactive field state
 */
export interface VueFieldState<T = unknown> {
  value: Ref<T | undefined>;
  touched: Ref<boolean>;
  dirty: Ref<boolean>;
  validating: Ref<boolean>;
  errors: Ref<ValidationResult['errors']>;
  isValid: Ref<boolean>;
  hasError: ComputedRef<boolean>;
  firstError: ComputedRef<string | undefined>;
  shouldShowError: ComputedRef<boolean>;
  errorMessages: ComputedRef<string[]>;
}

/**
 * Vue reactive form state
 */
export interface VueFormState<T extends Record<string, unknown>> {
  fields: Ref<{ [K in keyof T]?: FieldState<T[K]> }>;
  isValid: Ref<boolean>;
  validating: Ref<boolean>;
  touched: Ref<boolean>;
  dirty: Ref<boolean>;
  errors: Ref<ValidationResult['errors']>;
  canSubmit: ComputedRef<boolean>;
}
