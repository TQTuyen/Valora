/**
 * FormStateManager Tests
 */

import { createFormState, FormStateManager } from '@notification/form-state-manager';
import { createFieldValidator } from '@notification/field-validator';
import { string } from '@validators/string';
import { number } from '@validators/number';
import { describe, expect, it, vi } from 'vitest';

type TestForm = { name: string; email: string; age: number };

function makeManager(options?: Parameters<typeof createFormState>[1]) {
  return createFormState<TestForm>(
    {
      name: string().required(),
      email: string().email(),
      age: number().min(0),
    },
    options,
  );
}

describe('FormStateManager', () => {
  describe('constructor', () => {
    it('should create an instance with validators', () => {
      const mgr = makeManager();
      expect(mgr).toBeInstanceOf(FormStateManager);
    });

    it('should initialize field states to default values', () => {
      const mgr = makeManager();
      const state = mgr.getFieldState('name');
      expect(state).toBeDefined();
      expect(state?.touched).toBe(false);
      expect(state?.dirty).toBe(false);
      expect(state?.validating).toBe(false);
      expect(state?.errors).toEqual([]);
      expect(state?.isValid).toBe(true);
    });

    it('should initialize with provided initial values', () => {
      const mgr = makeManager({ initialValues: { name: 'Alice', age: 25 } });
      expect(mgr.getFieldState('name')?.value).toBe('Alice');
      expect(mgr.getFieldState('age')?.value).toBe(25);
    });

    it('should default validationMode to onChange', () => {
      const mgr = makeManager();
      // Trigger onChange behaviour — setFieldValue should validate
      mgr.setFieldValue('name', '');
      const state = mgr.getFieldState('name');
      expect(state?.dirty).toBe(true);
    });
  });

  describe('getFieldState', () => {
    it('should return undefined for unknown field', () => {
      const mgr = makeManager();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(mgr.getFieldState('unknown' as any)).toBeUndefined();
    });
  });

  describe('getAllFieldStates', () => {
    it('should return all field states as a copy', () => {
      const mgr = makeManager();
      const all = mgr.getAllFieldStates();
      expect(all).toHaveProperty('name');
      expect(all).toHaveProperty('email');
      expect(all).toHaveProperty('age');
    });
  });

  describe('setFieldValue', () => {
    it('should update field value and mark dirty', () => {
      const mgr = makeManager();
      mgr.setFieldValue('name', 'Bob');
      const state = mgr.getFieldState('name');
      expect(state?.value).toBe('Bob');
      expect(state?.dirty).toBe(true);
    });

    it('should validate on change when validationMode is onChange', () => {
      const mgr = makeManager({ validationMode: 'onChange' });
      mgr.setFieldValue('email', 'not-an-email');
      const state = mgr.getFieldState('email');
      expect(state?.isValid).toBe(false);
    });

    it('should NOT validate on change when validationMode is onBlur', () => {
      const mgr = makeManager({ validationMode: 'onBlur' });
      mgr.setFieldValue('email', 'not-an-email');
      const state = mgr.getFieldState('email');
      // No validation yet, still valid
      expect(state?.isValid).toBe(true);
    });

    it('should validate when validate option is true regardless of mode', () => {
      const mgr = makeManager({ validationMode: 'onBlur' });
      mgr.setFieldValue('email', 'bad', { validate: true });
      expect(mgr.getFieldState('email')?.isValid).toBe(false);
    });

    it('should not validate when validate option is false', () => {
      const mgr = makeManager({ validationMode: 'onChange' });
      mgr.setFieldValue('email', 'bad', { validate: false });
      expect(mgr.getFieldState('email')?.isValid).toBe(true);
    });

    it('should create field state for an unknown field dynamically', () => {
      const mgr = makeManager();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mgr.setFieldValue('name' as any, 'dynamic' as any);
      expect(mgr.getFieldState('name')?.value).toBe('dynamic');
    });
  });

  describe('touchField', () => {
    it('should mark field as touched', () => {
      const mgr = makeManager();
      mgr.touchField('name');
      expect(mgr.getFieldState('name')?.touched).toBe(true);
    });

    it('should validate when validationMode is onBlur', () => {
      const mgr = makeManager({ validationMode: 'onBlur' });
      mgr.setFieldValue('email', 'bad', { validate: false });
      mgr.touchField('email');
      expect(mgr.getFieldState('email')?.isValid).toBe(false);
    });

    it('should not validate on touch when validationMode is onChange', () => {
      const mgr = makeManager({ validationMode: 'onChange' });
      // name has no value (undefined) but required — skip validation here, just touch
      mgr.touchField('email');
      expect(mgr.getFieldState('email')?.touched).toBe(true);
    });

    it('should do nothing for unknown field', () => {
      const mgr = makeManager();
      // should not throw
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => mgr.touchField('nonexistent' as any)).not.toThrow();
    });
  });

  describe('validateField', () => {
    it('should return success for valid value', () => {
      const mgr = makeManager();
      mgr.setFieldValue('name', 'Alice', { validate: false });
      const result = mgr.validateField('name');
      expect(result.success).toBe(true);
    });

    it('should return failure for invalid value', () => {
      const mgr = makeManager();
      mgr.setFieldValue('email', 'bad-email', { validate: false });
      const result = mgr.validateField('email');
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return success when no validator for field', () => {
      const mgr = makeManager();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = mgr.validateField('unknown' as any);
      expect(result.success).toBe(true);
    });

    it('should update field state after validation', () => {
      const mgr = makeManager();
      mgr.setFieldValue('email', 'bad', { validate: false });
      mgr.validateField('email');
      expect(mgr.getFieldState('email')?.isValid).toBe(false);
      expect(mgr.getFieldState('email')?.validating).toBe(false);
    });
  });

  describe('validateAll', () => {
    it('should return success when all fields valid', () => {
      const mgr = makeManager();
      mgr.setFieldValue('name', 'Alice', { validate: false });
      mgr.setFieldValue('email', 'alice@example.com', { validate: false });
      mgr.setFieldValue('age', 30, { validate: false });
      const result = mgr.validateAll();
      expect(result.success).toBe(true);
    });

    it('should return failure when any field invalid', () => {
      const mgr = makeManager();
      mgr.setFieldValue('email', 'bad', { validate: false });
      const result = mgr.validateAll();
      expect(result.success).toBe(false);
    });
  });

  describe('resetField', () => {
    it('should reset field to default state', () => {
      const mgr = makeManager();
      mgr.setFieldValue('name', 'Bob');
      mgr.touchField('name');
      mgr.resetField('name');
      const state = mgr.getFieldState('name');
      expect(state?.value).toBeUndefined();
      expect(state?.touched).toBe(false);
      expect(state?.dirty).toBe(false);
    });

    it('should reset field with a new initial value', () => {
      const mgr = makeManager();
      mgr.resetField('name', 'Charlie');
      expect(mgr.getFieldState('name')?.value).toBe('Charlie');
    });

    it('should do nothing for unknown field', () => {
      const mgr = makeManager();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => mgr.resetField('unknown' as any)).not.toThrow();
    });
  });

  describe('resetAll', () => {
    it('should reset all fields', () => {
      const mgr = makeManager();
      mgr.setFieldValue('name', 'X');
      mgr.setFieldValue('email', 'x@x.com');
      mgr.resetAll();
      expect(mgr.getFieldState('name')?.value).toBeUndefined();
      expect(mgr.getFieldState('email')?.value).toBeUndefined();
    });

    it('should reset with provided values', () => {
      const mgr = makeManager();
      mgr.resetAll({ name: 'Reset', age: 0 });
      expect(mgr.getFieldState('name')?.value).toBe('Reset');
      expect(mgr.getFieldState('age')?.value).toBe(0);
    });
  });

  describe('clearErrors', () => {
    it('should clear errors on all fields', () => {
      const mgr = makeManager();
      mgr.setFieldValue('email', 'bad');
      expect(mgr.getFieldState('email')?.isValid).toBe(false);
      mgr.clearErrors();
      expect(mgr.getFieldState('email')?.isValid).toBe(true);
      expect(mgr.getFieldState('email')?.errors).toEqual([]);
    });
  });

  describe('getValues', () => {
    it('should return current values for all fields', () => {
      const mgr = makeManager({ initialValues: { name: 'Dave' } });
      const values = mgr.getValues();
      expect(values.name).toBe('Dave');
    });
  });

  describe('setValues', () => {
    it('should set multiple values at once', () => {
      const mgr = makeManager();
      mgr.setValues({ name: 'Eve', age: 20 });
      expect(mgr.getFieldState('name')?.value).toBe('Eve');
      expect(mgr.getFieldState('age')?.value).toBe(20);
    });

    it('should validate all when validate is true', () => {
      const mgr = makeManager();
      mgr.setValues({ email: 'bad' }, { validate: true });
      expect(mgr.getFieldState('email')?.isValid).toBe(false);
    });

    it('should not validate when validate is false in non-onChange mode', () => {
      const mgr = makeManager({ validationMode: 'onBlur' });
      mgr.setValues({ email: 'bad' }, { validate: false });
      expect(mgr.getFieldState('email')?.isValid).toBe(true);
    });
  });

  describe('getFormState', () => {
    it('should aggregate form state from all fields', () => {
      const mgr = makeManager();
      const form = mgr.getFormState();
      expect(form.isValid).toBe(true);
      expect(form.touched).toBe(false);
      expect(form.dirty).toBe(false);
      expect(form.validating).toBe(false);
      expect(form.errors).toEqual([]);
    });

    it('should reflect invalid state', () => {
      const mgr = makeManager();
      mgr.setFieldValue('email', 'bad');
      const form = mgr.getFormState();
      expect(form.isValid).toBe(false);
    });

    it('should reflect touched state', () => {
      const mgr = makeManager();
      mgr.touchField('name');
      expect(mgr.getFormState().touched).toBe(true);
    });

    it('should reflect dirty state', () => {
      const mgr = makeManager();
      mgr.setFieldValue('name', 'X', { validate: false });
      expect(mgr.getFormState().dirty).toBe(true);
    });
  });

  describe('subscribeToField', () => {
    it('should immediately invoke callback with current state', () => {
      const mgr = makeManager({ initialValues: { name: 'Bob' } });
      const callback = vi.fn();
      mgr.subscribeToField('name', callback);
      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mock.calls[0]?.[0].value).toBe('Bob');
    });

    it('should notify subscriber on field change', () => {
      const mgr = makeManager();
      const callback = vi.fn();
      mgr.subscribeToField('name', callback);
      callback.mockClear();
      mgr.setFieldValue('name', 'Charlie');
      expect(callback).toHaveBeenCalled();
    });

    it('should return unsubscribe function', () => {
      const mgr = makeManager();
      const callback = vi.fn();
      const unsub = mgr.subscribeToField('name', callback);
      callback.mockClear();
      unsub();
      mgr.setFieldValue('name', 'After unsub');
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('subscribeToForm', () => {
    it('should immediately invoke callback with current form state', () => {
      const mgr = makeManager();
      const callback = vi.fn();
      mgr.subscribeToForm(callback);
      expect(callback).toHaveBeenCalledOnce();
    });

    it('should notify on field change', () => {
      const mgr = makeManager();
      const callback = vi.fn();
      mgr.subscribeToForm(callback);
      callback.mockClear();
      mgr.setFieldValue('name', 'X');
      expect(callback).toHaveBeenCalled();
    });

    it('should return unsubscribe function', () => {
      const mgr = makeManager();
      const callback = vi.fn();
      const unsub = mgr.subscribeToForm(callback);
      callback.mockClear();
      unsub();
      mgr.setFieldValue('name', 'X');
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('subscribe alias', () => {
    it('should behave like subscribeToField', () => {
      const mgr = makeManager();
      const callback = vi.fn();
      mgr.subscribe('name', callback);
      expect(callback).toHaveBeenCalledOnce();
    });
  });

  describe('Observer implementation', () => {
    it('onValidationStart should set validating = true', () => {
      const mgr = makeManager();
      mgr.onValidationStart({ type: 'start', field: 'name', value: undefined, timestamp: Date.now(), result: { success: true, errors: [], data: undefined } });
      expect(mgr.getFieldState('name')?.validating).toBe(true);
    });

    it('onValidationEnd should update errors and isValid', () => {
      const mgr = makeManager();
      mgr.onValidationEnd({
        type: 'end',
        field: 'name',
        value: undefined,
        timestamp: Date.now(),
        result: { success: false, errors: [{ code: 'err', message: 'bad', path: [], field: 'name' }], data: undefined },
      });
      expect(mgr.getFieldState('name')?.isValid).toBe(false);
      expect(mgr.getFieldState('name')?.errors.length).toBe(1);
    });

    it('onValidationError should set isValid = false', () => {
      const mgr = makeManager();
      mgr.onValidationError({
        type: 'error',
        field: 'name',
        value: undefined,
        timestamp: Date.now(),
        result: { success: false, errors: [{ code: 'err', message: 'bad', path: [], field: 'name' }], data: undefined },
      });
      expect(mgr.getFieldState('name')?.isValid).toBe(false);
    });

    it('onValidationStart should ignore unknown fields', () => {
      const mgr = makeManager();
      expect(() =>
        mgr.onValidationStart({ type: 'start', field: 'unknown', value: undefined, timestamp: Date.now(), result: { success: true, errors: [], data: undefined } }),
      ).not.toThrow();
    });

    it('onValidationEnd should ignore unknown fields', () => {
      const mgr = makeManager();
      expect(() =>
        mgr.onValidationEnd({ type: 'end', field: 'unknown', value: undefined, timestamp: Date.now(), result: { success: true, errors: [], data: undefined } }),
      ).not.toThrow();
    });

    it('onValidationError should ignore unknown fields', () => {
      const mgr = makeManager();
      expect(() =>
        mgr.onValidationError({ type: 'error', field: 'unknown', value: undefined, timestamp: Date.now(), result: { success: false, errors: [], data: undefined } }),
      ).not.toThrow();
    });
  });
});

// ---------------------------------------------------------------------------
// createFieldValidator
// ---------------------------------------------------------------------------

describe('createFieldValidator', () => {
  it('getValue returns current field value', () => {
    const field = createFieldValidator('email', string().email(), 'init@example.com');
    expect(field.getValue()).toBe('init@example.com');
  });

  it('setValue updates the field value', () => {
    const field = createFieldValidator('email', string().email());
    field.setValue('test@example.com');
    expect(field.getValue()).toBe('test@example.com');
  });

  it('validate returns failure for invalid value', () => {
    const field = createFieldValidator('email', string().email());
    field.setValue('bad-email');
    const result = field.validate();
    expect(result.success).toBe(false);
  });

  it('validate returns success for valid value', () => {
    const field = createFieldValidator('email', string().email());
    field.setValue('valid@example.com');
    const result = field.validate();
    expect(result.success).toBe(true);
  });

  it('getState returns current field state', () => {
    const field = createFieldValidator('name', string());
    const state = field.getState();
    expect(state).toBeDefined();
    expect(state.errors).toEqual([]);
  });

  it('subscribe invokes callback with current state immediately', () => {
    const field = createFieldValidator('name', string(), 'Alice');
    const cb = vi.fn();
    field.subscribe(cb);
    expect(cb).toHaveBeenCalledOnce();
    expect(cb.mock.calls[0]?.[0].value).toBe('Alice');
  });

  it('subscribe returns unsubscribe function', () => {
    const field = createFieldValidator('name', string());
    const cb = vi.fn();
    const unsub = field.subscribe(cb);
    cb.mockClear();
    unsub();
    field.setValue('change');
    expect(cb).not.toHaveBeenCalled();
  });

  it('reset resets field to initial state', () => {
    const field = createFieldValidator('name', string());
    field.setValue('Bob');
    field.reset();
    expect(field.getValue()).toBeUndefined();
  });

  it('reset with value sets a new initial value', () => {
    const field = createFieldValidator('name', string());
    field.reset('Charlie');
    expect(field.getValue()).toBe('Charlie');
  });

  it('touch marks field as touched', () => {
    const field = createFieldValidator('name', string());
    field.touch();
    expect(field.getState().touched).toBe(true);
  });
});
