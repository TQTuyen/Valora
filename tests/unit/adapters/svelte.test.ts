/**
 * Svelte Adapter Tests
 *
 * Mocks svelte/store and svelte to test the SvelteAdapter in a Node environment.
 */

import { vi, describe, expect, it, beforeEach } from 'vitest';

// ── Minimal Svelte store mock ─────────────────────────────────────────────────

type Subscriber<T> = (value: T) => void;
type Unsubscriber = () => void;

interface WritableStore<T> {
  set(value: T): void;
  update(fn: (v: T) => T): void;
  subscribe(fn: Subscriber<T>): Unsubscriber;
  _get(): T;
}

function makeMockWritable<T>(initial: T): WritableStore<T> {
  let value = initial;
  const subs = new Set<Subscriber<T>>();
  return {
    set(v: T) {
      value = v;
      subs.forEach((fn) => fn(v));
    },
    update(fn: (v: T) => T) {
      value = fn(value);
      subs.forEach((f) => f(value));
    },
    subscribe(fn: Subscriber<T>) {
      subs.add(fn);
      fn(value);
      return () => subs.delete(fn);
    },
    _get: () => value,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeMockDerived(stores: any, fn: (...args: any[]) => any) {
  const storesArray = Array.isArray(stores) ? stores : [stores];
  const values: unknown[] = storesArray.map((s: WritableStore<unknown>) => {
    let v: unknown;
    const unsub = s.subscribe((val) => {
      v = val;
    });
    unsub();
    return v;
  });
  let currentValue = fn(Array.isArray(stores) ? [...values] : values[0]);
  const subs = new Set<Subscriber<unknown>>();

  // React to upstream changes
  storesArray.forEach((store: WritableStore<unknown>, i: number) => {
    store.subscribe((val) => {
      values[i] = val;
      currentValue = fn(Array.isArray(stores) ? [...values] : values[0]);
      subs.forEach((f) => f(currentValue));
    });
  });

  return {
    subscribe(fn: Subscriber<unknown>) {
      subs.add(fn);
      fn(currentValue);
      return () => subs.delete(fn);
    },
    _get: () => currentValue,
  };
}

vi.mock('svelte/store', () => ({
  writable: makeMockWritable,
  derived: makeMockDerived,
}));

vi.mock('svelte', () => ({
  onDestroy: vi.fn(),
}));

// ── Import after mocks ────────────────────────────────────────────────────────

import { SvelteAdapter } from '@adapters/svelte/svelte-adapter';
import { createSvelteAdapter } from '@adapters/svelte/factory';
import { createFormValidation, createFieldValidation } from '@adapters/svelte/composables';
import { string } from '@validators/string';
import { number } from '@validators/number';

type TestForm = { name: string; email: string; age: number };

function makeAdapter(opts?: Parameters<typeof SvelteAdapter>[1]) {
  return new SvelteAdapter<TestForm>(
    { name: string().required(), email: string().email(), age: number().min(0) },
    opts,
  );
}

function readStore<T>(store: { subscribe: (fn: (v: T) => void) => () => void }): T {
  let val!: T;
  const unsub = store.subscribe((v) => (val = v));
  unsub();
  return val;
}

describe('SvelteAdapter', () => {
  describe('constructor / factory', () => {
    it('should instantiate correctly', () => {
      const adapter = makeAdapter();
      expect(adapter).toBeInstanceOf(SvelteAdapter);
    });

    it('createSvelteAdapter factory should return SvelteAdapter', () => {
      const adapter = createSvelteAdapter({ name: string() });
      expect(adapter).toBeInstanceOf(SvelteAdapter);
    });
  });

  describe('useField()', () => {
    it('should return Svelte stores for a field', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('name');
      expect(field.value).toBeDefined();
      expect(field.touched).toBeDefined();
      expect(field.dirty).toBeDefined();
      expect(field.validating).toBeDefined();
      expect(field.errors).toBeDefined();
      expect(field.isValid).toBeDefined();
      expect(field.hasError).toBeDefined();
      expect(field.firstError).toBeDefined();
      expect(field.shouldShowError).toBeDefined();
      expect(field.errorMessages).toBeDefined();
    });

    it('should return the same store on repeated calls', () => {
      const adapter = makeAdapter();
      const a = adapter.useField('name');
      const b = adapter.useField('name');
      expect(a).toBe(b);
    });

    it('value store should update when setFieldValue is called', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('name');
      adapter.setFieldValue('name', 'Alice', { validate: false });
      expect(readStore(field.value)).toBe('Alice');
    });

    it('dirty store should become true after setFieldValue', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('name');
      adapter.setFieldValue('name', 'Bob', { validate: false });
      expect(readStore(field.dirty)).toBe(true);
    });

    it('touched store should become true after touchField', () => {
      const adapter = makeAdapter({ validationMode: 'onChange' });
      const field = adapter.useField('name');
      adapter.touchField('name');
      expect(readStore(field.touched)).toBe(true);
    });

    it('isValid store should be false for invalid email', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('email');
      adapter.setFieldValue('email', 'bad-email');
      expect(readStore(field.isValid)).toBe(false);
    });

    it('hasError derived store should reflect error state', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('email');
      adapter.setFieldValue('email', 'bad');
      expect(readStore(field.hasError)).toBe(true);
    });

    it('firstError should return first error message', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('email');
      adapter.setFieldValue('email', 'bad');
      expect(readStore(field.firstError)).toBeDefined();
    });

    it('shouldShowError should be true when touched and has error', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('email');
      adapter.setFieldValue('email', 'bad');
      adapter.touchField('email');
      expect(readStore(field.shouldShowError)).toBe(true);
    });

    it('errorMessages derived should return array of messages', () => {
      const adapter = makeAdapter();
      const field = adapter.useField('email');
      adapter.setFieldValue('email', 'bad');
      expect(Array.isArray(readStore(field.errorMessages))).toBe(true);
    });
  });

  describe('useForm()', () => {
    it('should return reactive form state', () => {
      const adapter = makeAdapter();
      const form = adapter.useForm();
      expect(form.isValid).toBeDefined();
      expect(form.validating).toBeDefined();
      expect(form.touched).toBeDefined();
      expect(form.dirty).toBeDefined();
      expect(form.errors).toBeDefined();
      expect(form.canSubmit).toBeDefined();
    });

    it('should return the same reference on repeated calls', () => {
      const adapter = makeAdapter();
      const a = adapter.useForm();
      const b = adapter.useForm();
      expect(a).toBe(b);
    });

    it('isValid store should update when validation fails', () => {
      const adapter = makeAdapter();
      const form = adapter.useForm();
      adapter.setFieldValue('email', 'bad');
      expect(readStore(form.isValid)).toBe(false);
    });

    it('canSubmit derived should be false when invalid', () => {
      const adapter = makeAdapter();
      const form = adapter.useForm();
      adapter.setFieldValue('email', 'bad');
      expect(readStore(form.canSubmit)).toBe(false);
    });
  });

  describe('getFieldBindings()', () => {
    it('should return bindings with value and handlers', () => {
      const adapter = makeAdapter();
      const bindings = adapter.getFieldBindings('name');
      expect(bindings.value).toBeDefined();
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
      // After destroy, useForm returns new state
      const form = adapter.useForm();
      expect(form).toBeDefined();
    });
  });
});

describe('createFormValidation composable', () => {
  it('should return adapter, formState, and helpers', () => {
    const result = createFormValidation<{ name: string }>({ name: string() });
    expect(result.adapter).toBeInstanceOf(SvelteAdapter);
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

  it('setValues should update multiple fields', () => {
    const { adapter, setValues } = createFormValidation<{ name: string; email: string }>({
      name: string(),
      email: string(),
    });
    setValues({ name: 'Dave' }, { validate: false });
    expect(adapter.getFieldState('name')?.value).toBe('Dave');
  });
});

describe('createFieldValidation composable', () => {
  it('should return field state and helpers', () => {
    const adapter = makeAdapter();
    const field = createFieldValidation(adapter, 'name');
    expect(field.value).toBeDefined();
    expect(typeof field.setValue).toBe('function');
    expect(typeof field.touch).toBe('function');
    expect(typeof field.reset).toBe('function');
    expect(typeof field.validate).toBe('function');
  });

  it('setValue should update the field value', () => {
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

  it('reset should reset field state', () => {
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

describe('SvelteAdapter - undefined state defaults', () => {
  it('useField() with no initial state uses default values for stores', () => {
    const adapter = new SvelteAdapter<{ name: string }>({} as Record<string, never>);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const field = adapter.useField('name' as any);
    expect(readStore(field.touched)).toBe(false);
    expect(readStore(field.dirty)).toBe(false);
    expect(readStore(field.validating)).toBe(false);
    expect(readStore(field.isValid)).toBe(true);
    expect(Array.isArray(readStore(field.errors))).toBe(true);
  });
});
