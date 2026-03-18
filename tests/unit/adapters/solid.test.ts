/**
 * Solid Adapter Tests
 *
 * Mocks solid-js to test the SolidAdapter in a Node environment.
 */

import { vi, describe, expect, it } from 'vitest';

// ── Solid-js mock ─────────────────────────────────────────────────────────────

type Setter<T> = (v: T | ((prev: T) => T)) => void;

vi.mock('solid-js', () => {
  const createSignal = <T>(initial: T): [() => T, Setter<T>] => {
    let value = initial;
    const getter = () => value;
    const setter: Setter<T> = (v) => {
      value = typeof v === 'function' ? (v as (prev: T) => T)(value) : v;
    };
    return [getter, setter];
  };

  const createMemo = <T>(fn: () => T): (() => T) => fn;

  const onCleanup = vi.fn();

  return { createSignal, createMemo, onCleanup };
});

// ── Import after mocks ────────────────────────────────────────────────────────

import { SolidAdapter } from '@adapters/solid/solid-adapter';
import { createSolidAdapter } from '@adapters/solid/factory';
import { createFormValidation, createFieldValidation } from '@adapters/solid/composables';
import { string } from '@validators/string';
import { number } from '@validators/number';

type TestForm = { name: string; email: string; age: number };

function makeAdapter(opts?: Parameters<typeof SolidAdapter>[1]) {
  return new SolidAdapter<TestForm>(
    { name: string().required(), email: string().email(), age: number().min(0) },
    opts,
  );
}

describe('SolidAdapter', () => {
  describe('constructor / factory', () => {
    it('should instantiate correctly', () => {
      const adapter = makeAdapter();
      expect(adapter).toBeInstanceOf(SolidAdapter);
    });

    it('createSolidAdapter factory should return SolidAdapter', () => {
      const adapter = createSolidAdapter({ name: string() });
      expect(adapter).toBeInstanceOf(SolidAdapter);
    });
  });

  describe('useField()', () => {
    it('should return Solid signals for a field', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('name');
      expect(typeof field.value).toBe('function');
      expect(typeof field.touched).toBe('function');
      expect(typeof field.dirty).toBe('function');
      expect(typeof field.validating).toBe('function');
      expect(typeof field.errors).toBe('function');
      expect(typeof field.isValid).toBe('function');
      expect(typeof field.hasError).toBe('function');
      expect(typeof field.firstError).toBe('function');
      expect(typeof field.shouldShowError).toBe('function');
      expect(typeof field.errorMessages).toBe('function');
    });

    it('should return same state object on repeated calls', () => {
      const adapter = makeAdapter();
      const a = adapter.useField('name');
      const b = adapter.useField('name');
      expect(a).toBe(b);
    });

    it('value signal should update when setFieldValue is called', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('name');
      adapter.setFieldValue('name', 'Alice', { validate: false });
      expect(field.value()).toBe('Alice');
    });

    it('dirty signal should become true after setFieldValue', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('name');
      adapter.setFieldValue('name', 'Bob', { validate: false });
      expect(field.dirty()).toBe(true);
    });

    it('touched signal should become true after touchField', () => {
      const adapter = makeAdapter({ validationMode: 'onChange' });
      const field = adapter.useField('name');
      adapter.touchField('name');
      expect(field.touched()).toBe(true);
    });

    it('isValid signal should be false for invalid email', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('email');
      adapter.setFieldValue('email', 'bad-email');
      expect(field.isValid()).toBe(false);
    });

    it('hasError memo should reflect error state', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('email');
      adapter.setFieldValue('email', 'bad');
      expect(field.hasError()).toBe(true);
    });

    it('firstError memo should return first error', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('email');
      adapter.setFieldValue('email', 'bad');
      expect(field.firstError()).toBeDefined();
    });

    it('shouldShowError memo should be true when touched and has error', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('email');
      adapter.setFieldValue('email', 'bad');
      adapter.touchField('email');
      expect(field.shouldShowError()).toBe(true);
    });

    it('errorMessages memo should return array', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('email');
      adapter.setFieldValue('email', 'bad');
      expect(Array.isArray(field.errorMessages())).toBe(true);
    });
  });

  describe('useForm()', () => {
    it('should return reactive form state', () => {
      const adapter = makeAdapter();
      const form = adapter.useForm();
      expect(typeof form.isValid).toBe('function');
      expect(typeof form.validating).toBe('function');
      expect(typeof form.touched).toBe('function');
      expect(typeof form.dirty).toBe('function');
      expect(typeof form.errors).toBe('function');
      expect(typeof form.canSubmit).toBe('function');
    });

    it('should return same reference on repeated calls', () => {
      const adapter = makeAdapter();
      const a = adapter.useForm();
      const b = adapter.useForm();
      expect(a).toBe(b);
    });

    it('isValid signal should update when validation fails', () => {
      const adapter = makeAdapter();
      const form = adapter.useForm();
      adapter.setFieldValue('email', 'bad');
      expect(form.isValid()).toBe(false);
    });

    it('canSubmit memo should be false when invalid', () => {
      const adapter = makeAdapter();
      const form = adapter.useForm();
      adapter.setFieldValue('email', 'bad');
      expect(form.canSubmit()).toBe(false);
    });
  });

  describe('getFieldBindings()', () => {
    it('should return bindings with value and handlers', () => {
      const adapter = makeAdapter();
      const bindings = adapter.getFieldBindings('name');
      expect(typeof bindings.value).toBe('function');
      expect(typeof bindings.onInput).toBe('function');
      expect(typeof bindings.onBlur).toBe('function');
    });

    it('onInput should update field value', () => {
      const adapter = makeAdapter();
      const bindings = adapter.getFieldBindings('name');
      bindings.onInput('Charlie');
      expect(adapter.getFieldState('name')?.value).toBe('Charlie');
    });

    it('onBlur should mark field as touched', () => {
      const adapter = makeAdapter();
      const bindings = adapter.getFieldBindings('name');
      bindings.onBlur();
      expect(adapter.getFieldState('name')?.touched).toBe(true);
    });
  });

  describe('destroy()', () => {
    it('should clear field states and form ref', () => {
      const adapter = makeAdapter();
      adapter.useField('name');
      adapter.useForm();
      adapter.destroy();
      const form = adapter.useForm();
      expect(form).toBeDefined();
    });
  });
});

describe('createFormValidation composable (Solid)', () => {
  it('should return adapter, formState, and helpers', () => {
    const result = createFormValidation<{ name: string }>({ name: string() });
    expect(result.adapter).toBeInstanceOf(SolidAdapter);
    expect(result.formState).toBeDefined();
    expect(typeof result.validateAll).toBe('function');
    expect(typeof result.resetAll).toBe('function');
    expect(typeof result.getValues).toBe('function');
    expect(typeof result.setValues).toBe('function');
  });

  it('validateAll should validate all fields', () => {
    const { adapter, validateAll } = createFormValidation<{ email: string }>({
      email: string().email(),
    });
    adapter.setFieldValue('email', 'bad', { validate: false });
    const result = validateAll();
    expect(result.success).toBe(false);
  });

  it('resetAll should reset all fields', () => {
    const { adapter, resetAll } = createFormValidation<{ name: string }>({ name: string() });
    adapter.setFieldValue('name', 'Test', { validate: false });
    resetAll();
    expect(adapter.getFieldState('name')?.value).toBeUndefined();
  });

  it('getValues should return current values', () => {
    const { adapter, getValues } = createFormValidation<{ name: string }>({ name: string() });
    adapter.setFieldValue('name', 'Hello', { validate: false });
    expect(getValues().name).toBe('Hello');
  });

  it('setValues should update fields', () => {
    const { adapter, setValues } = createFormValidation<{ name: string }>({ name: string() });
    setValues({ name: 'Dave' }, { validate: false });
    expect(adapter.getFieldState('name')?.value).toBe('Dave');
  });
});

describe('createFieldValidation composable (Solid)', () => {
  it('should return field state and helpers', () => {
    const adapter = makeAdapter();
    const field = createFieldValidation(adapter, 'name');
    expect(typeof field.setValue).toBe('function');
    expect(typeof field.touch).toBe('function');
    expect(typeof field.reset).toBe('function');
    expect(typeof field.validate).toBe('function');
  });

  it('setValue should update field value', () => {
    const adapter = makeAdapter();
    const field = createFieldValidation(adapter, 'name');
    field.setValue('Eve');
    expect(adapter.getFieldState('name')?.value).toBe('Eve');
  });

  it('touch should mark field as touched', () => {
    const adapter = makeAdapter();
    const field = createFieldValidation(adapter, 'name');
    field.touch();
    expect(adapter.getFieldState('name')?.touched).toBe(true);
  });

  it('reset should reset field', () => {
    const adapter = makeAdapter();
    const field = createFieldValidation(adapter, 'name');
    field.setValue('Frank');
    field.reset();
    expect(adapter.getFieldState('name')?.value).toBeUndefined();
  });

  it('validate should return validation result', () => {
    const adapter = makeAdapter();
    adapter.setFieldValue('email', 'bad', { validate: false });
    const field = createFieldValidation(adapter, 'email');
    const result = field.validate();
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Branch coverage: useField() with uninitialized state covers ?? defaults
// ---------------------------------------------------------------------------

describe('SolidAdapter - undefined state defaults', () => {
  it('useField() with no initial state uses default values for signals', () => {
    // Create adapter with empty validators so getFieldState returns undefined
    const adapter = new SolidAdapter<{ name: string }>({} as Record<string, never>);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const field = adapter.useField('name' as any);
    expect(field.value()).toBeUndefined();
    expect(field.touched()).toBe(false);
    expect(field.dirty()).toBe(false);
    expect(field.validating()).toBe(false);
    expect(field.isValid()).toBe(true);
    expect(Array.isArray(field.errors())).toBe(true);
  });
});
