import { useCallback, useEffect, useState } from 'react';

import { ReactAdapter } from './adapter';

import type { ValidatorMap } from '../types';
import type { ReactFieldState, ReactFormState } from './types';
import type { FormStateOptions } from '@notification/types';
import type { ValidationResult } from '#types/index';

export interface UseFormReturn<T extends Record<string, unknown>> {
  adapter: ReactAdapter<T>;
  formState: ReactFormState<T>;
  validateAll: () => ValidationResult<T>;
  resetAll: (values?: Partial<T>) => void;
  getValues: () => Partial<T>;
  setValues: (values: Partial<T>, opts?: { validate?: boolean }) => void;
}

export function useFormValidation<T extends Record<string, unknown>>(
  validators: ValidatorMap<T>,
  options?: FormStateOptions<T>,
): UseFormReturn<T> {
  const [adapter] = useState(() => new ReactAdapter(validators, options));
  const formState = adapter.useForm();

  useEffect(() => {
    return () => {
      adapter.destroy();
    };
  }, [adapter]);

  const validateAll = useCallback(() => adapter.validateAll(), [adapter]);
  const resetAll = useCallback(
    (values?: Partial<T>) => {
      adapter.resetAll(values);
    },
    [adapter],
  );
  const getValues = useCallback(() => adapter.getValues(), [adapter]);
  const setValues = useCallback(
    (values: Partial<T>, opts?: { validate?: boolean }) => {
      adapter.setValues(values, opts);
    },
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

export interface UseFieldReturn<T> extends ReactFieldState<T> {
  setValue: (value: T) => void;
  touch: () => void;
  reset: (value?: T) => void;
  validate: () => ValidationResult<T>;
}

export function useFieldValidation<T extends Record<string, unknown>, K extends keyof T>(
  adapter: ReactAdapter<T>,
  field: K,
): UseFieldReturn<T[K]> {
  const fieldState = adapter.useField(field);

  const setValue = useCallback(
    (value: T[K]) => {
      adapter.setFieldValue(field, value);
    },
    [adapter, field],
  );
  const touch = useCallback(() => {
    adapter.touchField(field);
  }, [adapter, field]);
  const reset = useCallback(
    (value?: T[K]) => {
      adapter.resetField(field, value);
    },
    [adapter, field],
  );
  const validate = useCallback(() => adapter.validateField(field), [adapter, field]);

  return {
    ...fieldState,
    setValue,
    touch,
    reset,
    validate,
  };
}
