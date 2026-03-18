/**
 * React Adapter Tests
 *
 * Mocks React hooks to test the ReactAdapter in a Node environment.
 */

import { vi, describe, expect, it } from 'vitest';

// ── React hooks mock ──────────────────────────────────────────────────────────
vi.mock('react', () => {
  const useState = <T>(init: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void] => {
    const value = typeof init === 'function' ? (init as () => T)() : init;
    const setter = vi.fn();
    return [value, setter];
  };

  const useEffect = (fn: () => (() => void) | void): void => {
    const cleanup = fn(); // execute immediately in tests
    if (typeof cleanup === 'function') cleanup(); // invoke cleanup to cover unmount path
  };

  const useMemo = <T>(fn: () => T): T => fn();

  const useCallback = <T>(fn: T): T => fn;

  return { useState, useEffect, useMemo, useCallback };
});

// ── Import after mocks ────────────────────────────────────────────────────────

import { ReactAdapter, createReactAdapter } from '@adapters/react/adapter';
import { useFormValidation, useFieldValidation } from '@adapters/react/hooks';
import { string } from '@validators/string';
import { number } from '@validators/number';

type TestForm = { name: string; email: string; age: number };

function makeAdapter(opts?: Parameters<typeof ReactAdapter>[1]) {
  return new ReactAdapter<TestForm>(
    { name: string().required(), email: string().email(), age: number().min(0) },
    opts,
  );
}

describe('ReactAdapter', () => {
  describe('constructor / factory', () => {
    it('should instantiate correctly', () => {
      const adapter = makeAdapter();
      expect(adapter).toBeInstanceOf(ReactAdapter);
    });

    it('createReactAdapter factory should return ReactAdapter', () => {
      const adapter = createReactAdapter({ name: string() });
      expect(adapter).toBeInstanceOf(ReactAdapter);
    });

    it('should initialize with initial values', () => {
      const adapter = new ReactAdapter<TestForm>(
        { name: string(), email: string(), age: number() },
        { initialValues: { name: 'Alice', age: 30 } },
      );
      const values = adapter.getValues();
      expect(values.name).toBe('Alice');
      expect(values.age).toBe(30);
    });
  });

  describe('getFieldBindings()', () => {
    it('should return bindings with value and handlers', () => {
      const adapter = makeAdapter();
      const bindings = adapter.getFieldBindings('name');
      expect(bindings).toBeDefined();
      expect(typeof bindings.onChange).toBe('function');
      expect(typeof bindings.onBlur).toBe('function');
      expect(typeof bindings.hasError).toBe('boolean');
      expect(typeof bindings.shouldShowError).toBe('boolean');
      expect(Array.isArray(bindings.errorMessages)).toBe(true);
    });

    it('onChange should update field value', () => {
      const adapter = makeAdapter();
      const bindings = adapter.getFieldBindings('name');
      bindings.onChange('Charlie');
      expect(adapter.getFieldState('name')?.value).toBe('Charlie');
    });

    it('onBlur should mark field as touched', () => {
      const adapter = makeAdapter();
      const bindings = adapter.getFieldBindings('name');
      bindings.onBlur();
      expect(adapter.getFieldState('name')?.touched).toBe(true);
    });

    it('should return empty string value for undefined field', () => {
      const adapter = makeAdapter();
      const bindings = adapter.getFieldBindings('name');
      expect(bindings.value).toBe('');
    });

    it('should return field value when set', () => {
      const adapter = makeAdapter({ initialValues: { name: 'Bob' } });
      const bindings = adapter.getFieldBindings('name');
      expect(bindings.value).toBe('Bob');
    });

    it('error should be defined (null or string)', () => {
      const adapter = makeAdapter();
      const bindings = adapter.getFieldBindings('name');
      // undefined field → no error
      expect(bindings.error === null || bindings.error === undefined || typeof bindings.error === 'string').toBe(true);
    });
  });

  describe('useField()', () => {
    it('should return field state with computed properties', () => {
      const adapter = makeAdapter({ initialValues: { name: 'Alice' } });
      const fieldState = adapter.useField('name');
      expect(fieldState).toBeDefined();
      expect(fieldState.value).toBe('Alice');
      expect(typeof fieldState.hasError).toBe('boolean');
      expect(typeof fieldState.shouldShowError).toBe('boolean');
      expect(Array.isArray(fieldState.errorMessages)).toBe(true);
    });

    it('hasError should be false for valid field', () => {
      const adapter = makeAdapter({ initialValues: { name: 'Alice' } });
      const fieldState = adapter.useField('name');
      expect(fieldState.hasError).toBe(false);
    });
  });

  describe('useForm()', () => {
    it('should return form state with canSubmit', () => {
      const adapter = makeAdapter();
      const formState = adapter.useForm();
      expect(formState).toBeDefined();
      expect(typeof formState.canSubmit).toBe('boolean');
      expect(typeof formState.isValid).toBe('boolean');
    });
  });

  describe('base operations', () => {
    it('should validate a field', () => {
      const adapter = makeAdapter();
      adapter.setFieldValue('email', 'bad', { validate: false });
      const result = adapter.validateField('email');
      expect(result.success).toBe(false);
    });

    it('should validate all fields', () => {
      const adapter = makeAdapter();
      adapter.setFieldValue('name', 'Alice', { validate: false });
      adapter.setFieldValue('email', 'alice@example.com', { validate: false });
      adapter.setFieldValue('age', 25, { validate: false });
      const result = adapter.validateAll();
      expect(result.success).toBe(true);
    });

    it('should reset a field', () => {
      const adapter = makeAdapter();
      adapter.setFieldValue('name', 'Test', { validate: false });
      adapter.resetField('name');
      expect(adapter.getFieldState('name')?.value).toBeUndefined();
    });

    it('should destroy without error', () => {
      const adapter = makeAdapter();
      expect(() => adapter.destroy()).not.toThrow();
    });
  });
});

describe('useFormValidation hook', () => {
  it('should return adapter and helpers', () => {
    const result = useFormValidation<TestForm>({
      name: string().required(),
      email: string().email(),
      age: number().min(0),
    });
    expect(result.adapter).toBeInstanceOf(ReactAdapter);
    expect(typeof result.validateAll).toBe('function');
    expect(typeof result.resetAll).toBe('function');
    expect(typeof result.getValues).toBe('function');
    expect(typeof result.setValues).toBe('function');
  });

  it('validateAll should work', () => {
    const { adapter, validateAll } = useFormValidation<{ email: string }>({
      email: string().email(),
    });
    adapter.setFieldValue('email', 'bad', { validate: false });
    const result = validateAll();
    expect(result.success).toBe(false);
  });

  it('resetAll should reset fields', () => {
    const { adapter, resetAll } = useFormValidation<{ name: string }>({ name: string() });
    adapter.setFieldValue('name', 'Test', { validate: false });
    resetAll();
    expect(adapter.getFieldState('name')?.value).toBeUndefined();
  });

  it('resetAll with values should set initial values', () => {
    const { adapter, resetAll } = useFormValidation<{ name: string }>({ name: string() });
    resetAll({ name: 'Bob' });
    expect(adapter.getFieldState('name')?.value).toBe('Bob');
  });

  it('getValues should return current values', () => {
    const { adapter, getValues } = useFormValidation<{ name: string }>({ name: string() });
    adapter.setFieldValue('name', 'Hello', { validate: false });
    expect(getValues().name).toBe('Hello');
  });

  it('setValues should update multiple fields', () => {
    const { adapter, setValues } = useFormValidation<{ name: string; email: string }>({
      name: string(),
      email: string(),
    });
    setValues({ name: 'Dave' }, { validate: false });
    expect(adapter.getFieldState('name')?.value).toBe('Dave');
  });
});

describe('useFieldValidation hook', () => {
  it('should return field state and helpers', () => {
    const adapter = makeAdapter();
    const field = useFieldValidation(adapter, 'name');
    expect(field).toBeDefined();
    expect(typeof field.setValue).toBe('function');
    expect(typeof field.touch).toBe('function');
    expect(typeof field.reset).toBe('function');
    expect(typeof field.validate).toBe('function');
  });

  it('setValue should update field value', () => {
    const adapter = makeAdapter();
    const field = useFieldValidation(adapter, 'name');
    field.setValue('Eve');
    expect(adapter.getFieldState('name')?.value).toBe('Eve');
  });

  it('touch should mark field as touched', () => {
    const adapter = makeAdapter();
    const field = useFieldValidation(adapter, 'name');
    field.touch();
    expect(adapter.getFieldState('name')?.touched).toBe(true);
  });

  it('reset should reset field', () => {
    const adapter = makeAdapter();
    const field = useFieldValidation(adapter, 'name');
    field.setValue('Frank');
    field.reset();
    expect(adapter.getFieldState('name')?.value).toBeUndefined();
  });

  it('reset with value should set value', () => {
    const adapter = makeAdapter();
    const field = useFieldValidation(adapter, 'name');
    field.reset('Grace');
    expect(adapter.getFieldState('name')?.value).toBe('Grace');
  });

  it('validate should return validation result', () => {
    const adapter = makeAdapter();
    adapter.setFieldValue('email', 'bad', { validate: false });
    const field = useFieldValidation(adapter, 'email');
    const result = field.validate();
    expect(result.success).toBe(false);
  });
});
