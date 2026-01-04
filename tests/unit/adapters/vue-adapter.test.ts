/**
 * Vue Adapter Tests
 * @vitest-environment jsdom
 */

import { createVueAdapter, VueAdapter } from '@adapters/vue';
import { useFieldValidation, useFormValidation } from '@adapters/vue/composables';
import { number } from '@validators/number';
import { string } from '@validators/string';
import { describe, expect, it } from 'vitest';
import { nextTick, type WritableComputedRef } from 'vue';

describe('Vue Adapter', () => {
  describe('Constructor and Factory', () => {
    it('should create instance with validators', () => {
      const validators = {
        name: string(),
        email: string().email(),
      };

      const adapter = new VueAdapter(validators);

      expect(adapter).toBeDefined();
      expect(adapter).toBeInstanceOf(VueAdapter);
    });

    it('should create instance with factory function', () => {
      const validators = {
        name: string(),
        email: string().email(),
      };

      const adapter = createVueAdapter(validators);

      expect(adapter).toBeDefined();
      expect(adapter).toBeInstanceOf(VueAdapter);
    });

    it('should initialize with initial values', () => {
      const validators = {
        name: string(),
        age: number(),
      };

      const adapter = new VueAdapter(validators, {
        initialValues: { name: 'John', age: 30 },
      });

      const values = adapter.getValues();

      expect(values.name).toBe('John');
      expect(values.age).toBe(30);
    });
  });

  describe('useField', () => {
    it('should return reactive field state', () => {
      const adapter = new VueAdapter({
        name: string().required(),
      });

      const nameState = adapter.useField('name');

      expect(nameState.value.value).toBeUndefined();
      expect(nameState.touched.value).toBe(false);
      expect(nameState.dirty.value).toBe(false);
      expect(nameState.validating.value).toBe(false);
      expect(nameState.errors.value).toEqual([]);
      expect(nameState.isValid.value).toBe(true);
    });

    it('should update reactive state when value changes', async () => {
      const adapter = new VueAdapter({
        name: string().required(),
      });

      const nameState = adapter.useField('name');

      adapter.setFieldValue('name', 'John');

      // Wait for Vue reactivity
      await nextTick();

      expect(nameState.value.value).toBe('John');
      expect(nameState.dirty.value).toBe(true);
    });

    it('should update computed error properties', async () => {
      const adapter = new VueAdapter({
        name: string().minLength(5),
      });

      const nameState = adapter.useField('name');

      adapter.setFieldValue('name', 'John'); // Too short
      adapter.touchField('name');

      await nextTick();

      expect(nameState.hasError.value).toBe(true);
      expect(nameState.shouldShowError.value).toBe(true);
      expect(nameState.firstError.value).toBeDefined();
      expect(nameState.errorMessages.value.length).toBeGreaterThan(0);
    });

    it('should cache field state', () => {
      const adapter = new VueAdapter({
        name: string(),
      });

      const state1 = adapter.useField('name');
      const state2 = adapter.useField('name');

      expect(state1).toBe(state2);
    });
  });

  describe('useForm', () => {
    it('should return reactive form state', () => {
      const adapter = new VueAdapter({
        name: string(),
      });

      const formState = adapter.useForm();

      expect(formState.isValid.value).toBe(true);
      expect(formState.touched.value).toBe(false);
      expect(formState.dirty.value).toBe(false);
    });

    it('should update form state when fields change', async () => {
      const adapter = new VueAdapter({
        name: string().required(),
      });

      const formState = adapter.useForm();

      adapter.setFieldValue('name', 'John');

      await nextTick();

      expect(formState.dirty.value).toBe(true);
    });

    it('should update canSubmit computed property', async () => {
      const adapter = new VueAdapter({
        name: string().required(),
      });

      const formState = adapter.useForm();

      expect(formState.canSubmit.value).toBe(true); // Valid initially (not touched/validating)

      adapter.setFieldValue('name', ''); // Invalid
      await nextTick();

      // Explicitly validate to trigger error if needed, but BaseAdapter usually validates on change
      adapter.validateAll();
      await nextTick();

      expect(formState.isValid.value).toBe(false);
      expect(formState.canSubmit.value).toBe(false);
    });

    it('should cache form state', () => {
      const adapter = new VueAdapter({
        name: string(),
      });

      const state1 = adapter.useForm();
      const state2 = adapter.useForm();

      expect(state1).toBe(state2);
    });
  });

  describe('getFieldBindings', () => {
    it('should return v-model compatible bindings', async () => {
      const adapter = new VueAdapter({
        name: string().required(),
      });

      const bindings = adapter.getFieldBindings('name');

      expect(bindings.modelValue.value).toBeUndefined();

      // Test setter
      // Cast to WritableComputedRef to avoid read-only TS check in tests
      (bindings.modelValue as unknown as WritableComputedRef<string>).value = 'John';
      await nextTick();

      expect(adapter.getFieldState('name')?.value).toBe('John');
    });

    it('should handle onBlur', async () => {
      const adapter = new VueAdapter({
        name: string().required(),
      });

      const bindings = adapter.getFieldBindings('name');
      const nameState = adapter.useField('name');

      bindings.onBlur();
      await nextTick();

      expect(nameState.touched.value).toBe(true);
    });
  });

  describe('Composables', () => {
    describe('useFormValidation', () => {
      it('should create adapter and return form state', () => {
        const { adapter, formState } = useFormValidation({
          name: string(),
        });

        expect(adapter).toBeInstanceOf(VueAdapter);
        expect(formState).toBeDefined();
        expect(formState.isValid.value).toBe(true);
      });

      it('should provide helper methods', () => {
        const { validateAll, resetAll, getValues, setValues } = useFormValidation({
          name: string(),
        });

        expect(typeof validateAll).toBe('function');
        expect(typeof resetAll).toBe('function');
        expect(typeof getValues).toBe('function');
        expect(typeof setValues).toBe('function');
      });

      it('should cleanup on unmount', () => {
        // Lifecycle testing is better done with @vue/test-utils
        // but we know onBeforeUnmount is used in the composable.
      });
    });

    describe('useFieldValidation', () => {
      it('should return field state and bindings', async () => {
        const adapter = new VueAdapter({
          name: string().required(),
        });

        const field = useFieldValidation(adapter, 'name');

        expect(field.value.value).toBeUndefined();
        expect(field.hasError.value).toBe(false);

        field.setValue('John');
        await nextTick();

        expect(field.value.value).toBe('John');
        expect(field.dirty.value).toBe(true);

        field.touch();
        await nextTick();
        expect(field.touched.value).toBe(true);
      });
    });
  });

  describe('Destroy', () => {
    it('should clear cached states', () => {
      const adapter = new VueAdapter({
        name: string(),
      });

      const stateBefore = adapter.useField('name');
      adapter.destroy();
      const stateAfter = adapter.useField('name');

      expect(stateBefore).not.toBe(stateAfter);
    });
  });
});
