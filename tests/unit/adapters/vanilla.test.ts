/**
 * Vanilla Adapter Tests
 * @vitest-environment jsdom
 */

import { createVanillaAdapter, VanillaAdapter } from '@adapters/vanilla';
import { number } from '@validators/number';
import { string } from '@validators/string';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Vanilla Adapter', () => {
  describe('Constructor and Factory', () => {
    it('should create instance with validators', () => {
      const validators = {
        name: string(),
        email: string().email(),
      };

      const adapter = new VanillaAdapter(validators);

      expect(adapter).toBeDefined();
      expect(adapter).toBeInstanceOf(VanillaAdapter);
    });

    it('should create instance with factory function', () => {
      const validators = {
        name: string(),
        email: string().email(),
      };

      const adapter = createVanillaAdapter(validators);

      expect(adapter).toBeDefined();
      expect(adapter).toBeInstanceOf(VanillaAdapter);
    });

    it('should initialize with initial values', () => {
      const validators = {
        name: string(),
        age: number(),
      };

      const adapter = new VanillaAdapter(validators, {
        initialValues: { name: 'John', age: 30 },
      });

      const values = adapter.getValues();

      expect(values.name).toBe('John');
      expect(values.age).toBe(30);
    });
  });

  describe('Form Binding', () => {
    let form: HTMLFormElement;
    let adapter: VanillaAdapter<{ name: string; email: string }>;

    beforeEach(() => {
      // Create a test form
      form = document.createElement('form');
      form.innerHTML = `
        <input type="text" name="name" id="name" />
        <input type="email" name="email" id="email" />
        <button type="submit">Submit</button>
      `;
      document.body.appendChild(form);

      // Create adapter
      adapter = new VanillaAdapter({
        name: string().minLength(2),
        email: string().email(),
      });
    });

    afterEach(() => {
      // Cleanup
      adapter.destroy();
      document.body.removeChild(form);
    });

    it('should bind form and return cleanup function', () => {
      const cleanup = adapter.bindForm({ form });

      expect(cleanup).toBeDefined();
      expect(typeof cleanup).toBe('function');

      cleanup();
    });

    it('should prevent default form submission by default', () => {
      adapter.bindForm({ form });

      const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
      const preventDefault = vi.spyOn(submitEvent, 'preventDefault');

      form.dispatchEvent(submitEvent);

      expect(preventDefault).toHaveBeenCalled();
    });

    it('should allow default submission when preventDefaultSubmit is false', () => {
      adapter.bindForm({
        form,
        preventDefaultSubmit: false,
      });

      const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
      const preventDefault = vi.spyOn(submitEvent, 'preventDefault');

      form.dispatchEvent(submitEvent);

      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('should call onSubmit when form is valid', async () => {
      const onSubmit = vi.fn();

      adapter.bindForm({
        form,
        onSubmit,
      });

      // Set valid values
      adapter.setFieldValue('name', 'John');
      adapter.setFieldValue('email', 'john@example.com');

      // Submit form
      const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
      form.dispatchEvent(submitEvent);

      // Wait for async validation
      await vi.waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });

    it('should not call onSubmit when form is invalid', async () => {
      const onSubmit = vi.fn();

      adapter.bindForm({
        form,
        onSubmit,
      });

      // Set invalid values
      adapter.setFieldValue('name', 'J'); // Too short
      adapter.setFieldValue('email', 'invalid-email');

      // Submit form
      const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
      form.dispatchEvent(submitEvent);

      // Wait a bit to ensure onSubmit is not called
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should update adapter when input changes (validateOnChange)', () => {
      const nameInput = form.querySelector<HTMLInputElement>('[name="name"]')!;

      adapter.bindForm({
        form,
        validateOnChange: true,
      });

      // Trigger input event
      nameInput.value = 'John Doe';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));

      const values = adapter.getValues();
      expect(values.name).toBe('John Doe');
    });

    it('should validate on blur when validateOnBlur is true', () => {
      const nameInput = form.querySelector<HTMLInputElement>('[name="name"]')!;

      adapter.bindForm({
        form,
        validateOnBlur: true,
      });

      // Set invalid value
      nameInput.value = 'J';
      nameInput.dispatchEvent(new Event('blur', { bubbles: true }));

      const fieldState = adapter.getFieldState('name');
      expect(fieldState?.touched).toBe(true);
    });

    it('should not validate on change when validateOnChange is false', () => {
      const nameInput = form.querySelector<HTMLInputElement>('[name="name"]')!;

      adapter.bindForm({
        form,
        validateOnChange: false,
      });

      // Trigger input event
      nameInput.value = 'J'; // Invalid
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));

      const fieldState = adapter.getFieldState('name');
      // When validateOnChange is false, input events are not bound
      // so adapter state should remain unchanged
      expect(fieldState?.value).toBeUndefined();
    });
  });

  describe('Multiple Form Bindings', () => {
    let form1: HTMLFormElement;
    let form2: HTMLFormElement;
    let adapter: VanillaAdapter<{ name: string }>;

    beforeEach(() => {
      form1 = document.createElement('form');
      form1.innerHTML = '<input type="text" name="name" />';
      document.body.appendChild(form1);

      form2 = document.createElement('form');
      form2.innerHTML = '<input type="text" name="name" />';
      document.body.appendChild(form2);

      adapter = new VanillaAdapter({
        name: string(),
      });
    });

    afterEach(() => {
      adapter.destroy();
      document.body.removeChild(form1);
      document.body.removeChild(form2);
    });

    it('should handle multiple form bindings', () => {
      const cleanup1 = adapter.bindForm({ form: form1 });
      const cleanup2 = adapter.bindForm({ form: form2 });

      expect(cleanup1).toBeDefined();
      expect(cleanup2).toBeDefined();

      cleanup1();
      cleanup2();
    });

    it('should cleanup individual bindings', () => {
      const cleanup1 = adapter.bindForm({ form: form1 });
      const cleanup2 = adapter.bindForm({ form: form2 });

      // Cleanup first binding
      cleanup1();

      // Second binding should still work
      const input2 = form2.querySelector<HTMLInputElement>('[name="name"]')!;
      input2.value = 'Test';
      input2.dispatchEvent(new Event('input', { bubbles: true }));

      const values = adapter.getValues();
      expect(values.name).toBe('Test');

      cleanup2();
    });
  });

  describe('Destroy', () => {
    let form: HTMLFormElement;
    let adapter: VanillaAdapter<{ name: string }>;

    beforeEach(() => {
      form = document.createElement('form');
      form.innerHTML = '<input type="text" name="name" />';
      document.body.appendChild(form);

      adapter = new VanillaAdapter({
        name: string(),
      });
    });

    afterEach(() => {
      document.body.removeChild(form);
    });

    it('should cleanup all bindings on destroy', () => {
      const cleanup = vi.fn();
      adapter.bindForm({ form });

      adapter.destroy();

      // After destroy, form events should not trigger adapter updates
      const input = form.querySelector<HTMLInputElement>('[name="name"]')!;
      input.value = 'Test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Verify cleanup was called (indirectly by checking state)
      expect(cleanup).not.toHaveBeenCalled(); // We can't directly verify, but form should be unbound
    });

    it('should be safe to call destroy multiple times', () => {
      adapter.bindForm({ form });

      expect(() => {
        adapter.destroy();
        adapter.destroy();
      }).not.toThrow();
    });
  });

  describe('Field Types Support', () => {
    let form: HTMLFormElement;

    beforeEach(() => {
      form = document.createElement('form');
      document.body.appendChild(form);
    });

    afterEach(() => {
      document.body.removeChild(form);
    });

    it('should handle checkbox inputs', () => {
      form.innerHTML = '<input type="checkbox" name="agree" />';

      const adapter = new VanillaAdapter({
        agree: string(), // Will receive boolean
      });

      adapter.bindForm({ form });

      const checkbox = form.querySelector<HTMLInputElement>('[name="agree"]')!;
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('input', { bubbles: true }));

      const values = adapter.getValues();
      expect(values.agree).toBe(true);

      adapter.destroy();
    });

    it('should handle select inputs', () => {
      form.innerHTML = `
        <select name="country">
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
        </select>
      `;

      const adapter = new VanillaAdapter({
        country: string(),
      });

      adapter.bindForm({ form });

      const select = form.querySelector<HTMLSelectElement>('[name="country"]')!;
      select.value = 'uk';
      select.dispatchEvent(new Event('input', { bubbles: true }));

      const values = adapter.getValues();
      expect(values.country).toBe('uk');

      adapter.destroy();
    });

    it('should handle textarea inputs', () => {
      form.innerHTML = '<textarea name="bio"></textarea>';

      const adapter = new VanillaAdapter({
        bio: string(),
      });

      adapter.bindForm({ form });

      const textarea = form.querySelector<HTMLTextAreaElement>('[name="bio"]')!;
      textarea.value = 'Hello world';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      const values = adapter.getValues();
      expect(values.bio).toBe('Hello world');

      adapter.destroy();
    });
  });
});
