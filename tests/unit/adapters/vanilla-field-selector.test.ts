/**
 * Field Selector Utilities Tests
 * @vitest-environment jsdom
 */

import {
  defaultFieldSelector,
  getFieldElement,
  getFieldValue,
  setFieldValue,
} from '@adapters/vanilla/field-selector';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Field Selector Utilities', () => {
  let form: HTMLFormElement;

  beforeEach(() => {
    form = document.createElement('form');
    document.body.appendChild(form);
  });

  afterEach(() => {
    document.body.removeChild(form);
  });

  describe('defaultFieldSelector', () => {
    it('should find element by name attribute', () => {
      form.innerHTML = '<input type="text" name="username" />';

      const element = defaultFieldSelector('username', form);

      expect(element).toBeDefined();
      expect(element?.getAttribute('name')).toBe('username');
    });

    it('should find element by id when name not found', () => {
      form.innerHTML = '<input type="text" id="username" />';

      const element = defaultFieldSelector('username', form);

      expect(element).toBeDefined();
      expect(element?.id).toBe('username');
    });

    it('should prefer name over id', () => {
      form.innerHTML = `
        <input type="text" id="username" value="id-input" />
        <input type="text" name="username" value="name-input" />
      `;

      const element = defaultFieldSelector('username', form);

      expect(element).toBeDefined();
      expect((element as HTMLInputElement).value).toBe('name-input');
    });

    it('should return null when field not found', () => {
      form.innerHTML = '<input type="text" name="other" />';

      const element = defaultFieldSelector('username', form);

      expect(element).toBeNull();
    });
  });

  describe('getFieldElement', () => {
    it('should use default selector when no config provided', () => {
      form.innerHTML = '<input type="text" name="email" />';

      const element = getFieldElement('email', form);

      expect(element).toBeDefined();
      expect(element?.getAttribute('name')).toBe('email');
    });

    it('should use custom selector from config', () => {
      form.innerHTML = '<input type="text" data-field="custom-email" />';

      const customSelector = (fieldName: string, formEl: HTMLFormElement) => {
        return formEl.querySelector<HTMLElement>(`[data-field="${fieldName}"]`);
      };

      const element = getFieldElement('custom-email', form, {
        fieldSelector: customSelector,
      });

      expect(element).toBeDefined();
      expect(element?.getAttribute('data-field')).toBe('custom-email');
    });
  });

  describe('getFieldValue', () => {
    it('should get value from text input', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = 'Hello';

      const value = getFieldValue(input);

      expect(value).toBe('Hello');
    });

    it('should get checked state from checkbox', () => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;

      const value = getFieldValue(checkbox);

      expect(value).toBe(true);
    });

    it('should get number from number input', () => {
      const input = document.createElement('input');
      input.type = 'number';
      input.value = '42';

      const value = getFieldValue(input);

      expect(value).toBe(42);
    });

    it('should get date from date input', () => {
      const input = document.createElement('input');
      input.type = 'date';
      input.value = '2024-01-15';

      const value = getFieldValue(input);

      // In jsdom, valueAsDate returns a Date object or null
      // but implementation may vary, so we check if it's a valid date
      expect(value).toBeTruthy();
      if (value instanceof Date) {
        expect(value.getFullYear()).toBe(2024);
      } else {
        // If it's a string or timestamp, we can still verify it's correct
        const date = new Date(value as string);
        expect(date.getFullYear()).toBe(2024);
      }
    });

    it('should get value from select element', () => {
      const select = document.createElement('select');
      select.innerHTML = `
        <option value="1">One</option>
        <option value="2" selected>Two</option>
      `;

      const value = getFieldValue(select);

      expect(value).toBe('2');
    });

    it('should get array from multi-select', () => {
      const select = document.createElement('select');
      select.multiple = true;
      select.innerHTML = `
        <option value="1" selected>One</option>
        <option value="2" selected>Two</option>
        <option value="3">Three</option>
      `;

      const value = getFieldValue(select);

      expect(Array.isArray(value)).toBe(true);
      expect(value).toEqual(['1', '2']);
    });

    it('should get value from textarea', () => {
      const textarea = document.createElement('textarea');
      textarea.value = 'Multi\nline\ntext';

      const value = getFieldValue(textarea);

      expect(value).toBe('Multi\nline\ntext');
    });
  });

  describe('setFieldValue', () => {
    it('should set value on text input', () => {
      const input = document.createElement('input');
      input.type = 'text';

      setFieldValue(input, 'New value');

      expect(input.value).toBe('New value');
    });

    it('should set checked state on checkbox', () => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';

      setFieldValue(checkbox, true);
      expect(checkbox.checked).toBe(true);

      setFieldValue(checkbox, false);
      expect(checkbox.checked).toBe(false);
    });

    it('should set checked state on radio button', () => {
      const radio1 = document.createElement('input');
      radio1.type = 'radio';
      radio1.value = 'option1';

      const radio2 = document.createElement('input');
      radio2.type = 'radio';
      radio2.value = 'option2';

      setFieldValue(radio1, 'option1');
      expect(radio1.checked).toBe(true);

      setFieldValue(radio2, 'option1');
      expect(radio2.checked).toBe(false);

      setFieldValue(radio2, 'option2');
      expect(radio2.checked).toBe(true);
    });

    it('should set value on select element', () => {
      const select = document.createElement('select');
      select.innerHTML = `
        <option value="1">One</option>
        <option value="2">Two</option>
      `;

      setFieldValue(select, '2');

      expect(select.value).toBe('2');
    });

    it('should set selected options on multi-select', () => {
      const select = document.createElement('select');
      select.multiple = true;
      select.innerHTML = `
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      `;

      setFieldValue(select, ['1', '3']);

      const selectedValues = Array.from(select.selectedOptions).map((opt) => opt.value);
      expect(selectedValues).toEqual(['1', '3']);
    });

    it('should set value on textarea', () => {
      const textarea = document.createElement('textarea');

      setFieldValue(textarea, 'New\ncontent');

      expect(textarea.value).toBe('New\ncontent');
    });

    it('should convert non-string values to string for text inputs', () => {
      const input = document.createElement('input');
      input.type = 'text';

      setFieldValue(input, 123);

      expect(input.value).toBe('123');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty values', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = 'initial';

      setFieldValue(input, '');

      expect(input.value).toBe('');
    });

    it('should handle undefined values', () => {
      const input = document.createElement('input');
      input.type = 'text';

      setFieldValue(input, undefined);

      expect(input.value).toBe('');
    });

    it('should handle null values', () => {
      const input = document.createElement('input');
      input.type = 'text';

      setFieldValue(input, null);

      expect(input.value).toBe('');
    });

    it('should handle range input', () => {
      const input = document.createElement('input');
      input.type = 'range';
      input.min = '0';
      input.max = '100';
      input.value = '50';

      const value = getFieldValue(input);

      expect(value).toBe(50);
    });
  });
});
