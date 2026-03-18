/**
 * Vue Composables — supplemental tests for uncovered helper function calls
 * @vitest-environment jsdom
 */

import { VueAdapter } from '@adapters/vue';
import { useFieldValidation, useFormValidation } from '@adapters/vue/composables';
import { string } from '@validators/string';
import { number } from '@validators/number';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

type TestForm = { name: string; email: string; age: number };

describe('useFormValidation - helper methods', () => {
  it('validateAll helper should validate all fields', () => {
    const { adapter, validateAll } = useFormValidation<TestForm>({
      name: string().required(),
      email: string().email(),
      age: number().min(0),
    });
    adapter.setFieldValue('email', 'bad', { validate: false });
    const result = validateAll();
    expect(result.success).toBe(false);
  });

  it('validateAll helper should succeed when all valid', () => {
    const { adapter, validateAll } = useFormValidation<TestForm>({
      name: string().required(),
      email: string().email(),
      age: number().min(0),
    });
    adapter.setFieldValue('name', 'Alice', { validate: false });
    adapter.setFieldValue('email', 'alice@example.com', { validate: false });
    adapter.setFieldValue('age', 25, { validate: false });
    const result = validateAll();
    expect(result.success).toBe(true);
  });

  it('resetAll helper should reset all fields', () => {
    const { adapter, resetAll } = useFormValidation<TestForm>({
      name: string(),
      email: string(),
      age: number(),
    });
    adapter.setFieldValue('name', 'Test', { validate: false });
    resetAll();
    expect(adapter.getFieldState('name')?.value).toBeUndefined();
  });

  it('resetAll helper should reset with provided values', () => {
    const { adapter, resetAll } = useFormValidation<TestForm>({
      name: string(),
      email: string(),
      age: number(),
    });
    resetAll({ name: 'Reset Name', age: 42 });
    expect(adapter.getFieldState('name')?.value).toBe('Reset Name');
    expect(adapter.getFieldState('age')?.value).toBe(42);
  });

  it('getValues helper should return current form values', () => {
    const { adapter, getValues } = useFormValidation<TestForm>({
      name: string(),
      email: string(),
      age: number(),
    });
    adapter.setFieldValue('name', 'Bob', { validate: false });
    const values = getValues();
    expect(values.name).toBe('Bob');
  });

  it('setValues helper should update multiple fields', async () => {
    const { adapter, setValues } = useFormValidation<TestForm>({
      name: string(),
      email: string(),
      age: number(),
    });
    setValues({ name: 'Charlie', age: 30 }, { validate: false });
    await nextTick();
    expect(adapter.getFieldState('name')?.value).toBe('Charlie');
    expect(adapter.getFieldState('age')?.value).toBe(30);
  });

  it('setValues with validate option should trigger validation', async () => {
    const { adapter, setValues } = useFormValidation<TestForm>({
      name: string(),
      email: string().email(),
      age: number(),
    });
    setValues({ email: 'bad-email' }, { validate: true });
    await nextTick();
    expect(adapter.getFieldState('email')?.isValid).toBe(false);
  });
});

describe('useFieldValidation - helper methods', () => {
  it('reset helper should reset field to undefined', async () => {
    const adapter = new VueAdapter<TestForm>({
      name: string(),
      email: string(),
      age: number(),
    });
    const field = useFieldValidation(adapter, 'name');
    field.setValue('Alice');
    await nextTick();
    field.reset();
    await nextTick();
    expect(adapter.getFieldState('name')?.value).toBeUndefined();
  });

  it('reset helper should reset field with a value', async () => {
    const adapter = new VueAdapter<TestForm>({
      name: string(),
      email: string(),
      age: number(),
    });
    const field = useFieldValidation(adapter, 'name');
    field.reset('Default Name');
    await nextTick();
    expect(adapter.getFieldState('name')?.value).toBe('Default Name');
  });

  it('validate helper should return validation result', async () => {
    const adapter = new VueAdapter<TestForm>({
      name: string(),
      email: string().email(),
      age: number(),
    });
    adapter.setFieldValue('email', 'bad-email', { validate: false });
    const field = useFieldValidation(adapter, 'email');
    const result = field.validate();
    expect(result.success).toBe(false);
  });

  it('validate helper should succeed for valid field', async () => {
    const adapter = new VueAdapter<TestForm>({
      name: string(),
      email: string().email(),
      age: number(),
    });
    adapter.setFieldValue('email', 'user@example.com', { validate: false });
    const field = useFieldValidation(adapter, 'email');
    const result = field.validate();
    expect(result.success).toBe(true);
  });
});
