/**
 * React Adapter
 * @module adapters/react
 *
 * React Hooks adapter for Valora validation framework.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

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

/**
 * React field state with computed helpers
 */
export interface ReactFieldState<T = unknown> extends FieldState<T> {
  hasError: boolean;
  firstError: string | undefined;
  shouldShowError: boolean;
  errorMessages: string[];
}

/**
 * React form state with computed helpers
 */
export interface ReactFormState<T extends Record<string, unknown>> extends FormState<T> {
  canSubmit: boolean;
}


export class ReactAdapter<T extends Record<string, unknown>> extends BaseFrameworkAdapter<T> {
  constructor(validators: ValidatorMap<T>, options?: FormStateOptions<T>) {
    super(validators, options);
  }

  
