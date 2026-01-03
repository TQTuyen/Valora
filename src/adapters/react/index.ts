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

  useField<K extends keyof T>(field: K): ReactFieldState<T[K]> {
    const [fieldState, setFieldState] = useState<FieldState<T[K]>>(() => {
      const state = this.getFieldState(field);
      return (
        state ?? {
          value: undefined,
          touched: false,
          dirty: false,
          validating: false,
          errors: [],
          isValid: true,
        }
      );
    });

    useEffect(() => {
      const unsubscribe = this.subscribeToField(field, (state: FieldState<T[K]>) => {
        setFieldState({ ...state });
      });

      return () => {
        unsubscribe();
      };
    }, [field]);

    // Memoize computed properties
    const hasError = useMemo(() => hasFieldErrors(fieldState), [fieldState.errors]);
    const firstError = useMemo(() => getFirstError(fieldState), [fieldState.errors]);
    const shouldShowError = useMemo(
      () => shouldShowErrors(fieldState),
      [fieldState.touched, fieldState.errors],
    );
    const errorMessages = useMemo(() => formatErrors(fieldState), [fieldState.errors]);

    return {
      ...fieldState,
      hasError,
      firstError,
      shouldShowError,
      errorMessages,
    };
  }


  useForm(): ReactFormState<T> {
    const [formState, setFormState] = useState<FormState<T>>(() => this.getFormState());

    useEffect(() => {
      const unsubscribe = this.subscribeToForm((state: FormState<T>) => {
        setFormState({ ...state });
      });

      return () => {
        unsubscribe();
      };
    }, []);

    const canSubmitValue = useMemo(() => canSubmit(formState), [formState.isValid, formState.validating]);

    return {
      ...formState,
      canSubmit: canSubmitValue,
    };
  }


  getFieldBindings<K extends keyof T>(field: K) {
    const fieldState = this.getFieldState(field);

    return {
      value: fieldState?.value ?? ('' as T[K]),
      onChange: (value: T[K]) => {
        this.setFieldValue(field, value);
      },
      onBlur: () => {
        this.touchField(field);
      },
      error: getFirstError(fieldState),
      hasError: hasFieldErrors(fieldState),
      shouldShowError: shouldShowErrors(fieldState),
      errorMessages: formatErrors(fieldState),
    };
  }
}


export function createReactAdapter<T extends Record<string, unknown>>(
  validators: ValidatorMap<T>,
  options?: FormStateOptions<T>,
): ReactAdapter<T> {
  return new ReactAdapter(validators, options);
}


export function useFormValidation<T extends Record<string, unknown>>(
  validators: ValidatorMap<T>,
  options?: FormStateOptions<T>,
) {
  const [adapter] = useState(() => new ReactAdapter(validators, options));
  const formState = adapter.useForm();

  useEffect(() => {
    return () => {
      adapter.destroy();
    };
  }, [adapter]);

  const validateAll = useCallback(() => adapter.validateAll(), [adapter]);
  const resetAll = useCallback((values?: Partial<T>) => adapter.resetAll(values), [adapter]);
  const getValues = useCallback(() => adapter.getValues(), [adapter]);
  const setValues = useCallback(
    (values: Partial<T>, opts?: { validate?: boolean }) => adapter.setValues(values, opts),
    [adapter],
  );

  return {
    adapter,
    formState,
    validateAll,
    resetAll,
    getValues,
    setValues,
  };
}


export function useFieldValidation<T extends Record<string, unknown>, K extends keyof T>(
  adapter: ReactAdapter<T>,
  field: K,
) {
  const fieldState = adapter.useField(field);

  const setValue = useCallback((value: T[K]) => adapter.setFieldValue(field, value), [adapter, field]);
  const touch = useCallback(() => adapter.touchField(field), [adapter, field]);
  const reset = useCallback((value?: T[K]) => adapter.resetField(field, value), [adapter, field]);
  const validate = useCallback(() => adapter.validateField(field), [adapter, field]);

  return {
    ...fieldState,
    setValue,
    touch,
    reset,
    validate,
  };
}


export type { ValidatorMap, FormStateOptions };
