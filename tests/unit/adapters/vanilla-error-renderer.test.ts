/**
 * Error Renderer Tests
 * @vitest-environment jsdom
 */

import {
  clearFieldErrors,
  clearFormErrors,
  renderFieldErrors,
} from '@adapters/vanilla/error-renderer';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Error Renderer', () => {
  let field: HTMLInputElement;
  let form: HTMLFormElement;

  beforeEach(() => {
    form = document.createElement('form');
    field = document.createElement('input');
    field.type = 'text';
    field.name = 'username';
    field.id = 'username';
    form.appendChild(field);
    document.body.appendChild(form);
  });

  afterEach(() => {
    document.body.removeChild(form);
  });

  describe('renderFieldErrors', () => {
    it('should render error messages after field', () => {
      const errors = ['Username is required', 'Username must be at least 3 characters'];

      renderFieldErrors(field, errors);

      const errorContainer = document.getElementById('valora-error-username');
      expect(errorContainer).toBeDefined();
      expect(errorContainer?.children.length).toBe(2);
    });

    it('should add invalid class to field', () => {
      const errors = ['Username is required'];

      renderFieldErrors(field, errors);

      expect(field.classList.contains('valora-invalid')).toBe(true);
    });

    it('should set aria-invalid attribute', () => {
      const errors = ['Username is required'];

      renderFieldErrors(field, errors);

      expect(field.getAttribute('aria-invalid')).toBe('true');
    });

    it('should link error to field with aria-describedby', () => {
      const errors = ['Username is required'];

      renderFieldErrors(field, errors);

      const describedBy = field.getAttribute('aria-describedby');
      expect(describedBy).toContain('valora-error-username');
    });

    it('should preserve existing aria-describedby', () => {
      field.setAttribute('aria-describedby', 'existing-description');

      const errors = ['Username is required'];
      renderFieldErrors(field, errors);

      const describedBy = field.getAttribute('aria-describedby');
      expect(describedBy).toContain('existing-description');
      expect(describedBy).toContain('valora-error-username');
    });

    it('should use custom error class when provided', () => {
      const errors = ['Error message'];
      const config = {
        errorClass: 'custom-error',
        errorMessageClass: 'custom-message',
      };

      renderFieldErrors(field, errors, config);

      const errorContainer = document.getElementById('valora-error-username');
      expect(errorContainer?.classList.contains('custom-error')).toBe(true);

      const messages = errorContainer?.querySelectorAll('.custom-message');
      expect(messages?.length).toBe(1);
    });

    it('should use custom invalid input class', () => {
      const errors = ['Error message'];
      const config = {
        invalidInputClass: 'is-invalid',
      };

      renderFieldErrors(field, errors, config);

      expect(field.classList.contains('is-invalid')).toBe(true);
      expect(field.classList.contains('valora-invalid')).toBe(false);
    });

    it('should insert error before field when placement is "before"', () => {
      const errors = ['Error message'];
      const config = {
        errorPlacement: 'before' as const,
      };

      renderFieldErrors(field, errors, config);

      const errorContainer = document.getElementById('valora-error-username');
      expect(errorContainer?.nextSibling).toBe(field);
    });

    it('should use custom renderer when provided', () => {
      let customRendererCalled = false;
      const errors = ['Error message'];
      const config = {
        customRenderer: (fieldEl: HTMLElement, errs: string[]) => {
          customRendererCalled = true;
          expect(fieldEl).toBe(field);
          expect(errs).toEqual(errors);
        },
      };

      renderFieldErrors(field, errors, config);

      expect(customRendererCalled).toBe(true);
    });

    it('should clear existing errors before rendering new ones', () => {
      const errors1 = ['First error'];
      renderFieldErrors(field, errors1);

      const errors2 = ['Second error'];
      renderFieldErrors(field, errors2);

      const errorContainer = document.getElementById('valora-error-username');
      expect(errorContainer?.children.length).toBe(1);
      expect(errorContainer?.textContent).toContain('Second error');
      expect(errorContainer?.textContent).not.toContain('First error');
    });

    it('should not render when errors array is empty', () => {
      renderFieldErrors(field, []);

      const errorContainer = document.getElementById('valora-error-username');
      expect(errorContainer).toBeNull();
    });

    it('should handle field without name or id gracefully', () => {
      const fieldWithoutName = document.createElement('input');
      form.appendChild(fieldWithoutName);

      // Should not throw
      expect(() => {
        renderFieldErrors(fieldWithoutName, ['Error']);
      }).not.toThrow();

      // Should warn in console (we can't easily test console.warn in vitest)
    });

    it('should add role and aria-live attributes to error container', () => {
      const errors = ['Error message'];

      renderFieldErrors(field, errors);

      const errorContainer = document.getElementById('valora-error-username');
      expect(errorContainer?.getAttribute('role')).toBe('alert');
      expect(errorContainer?.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('clearFieldErrors', () => {
    beforeEach(() => {
      // Render some errors first
      renderFieldErrors(field, ['Error message']);
    });

    it('should remove error container from DOM', () => {
      clearFieldErrors(field);

      const errorContainer = document.getElementById('valora-error-username');
      expect(errorContainer).toBeNull();
    });

    it('should remove aria-invalid attribute', () => {
      clearFieldErrors(field);

      expect(field.hasAttribute('aria-invalid')).toBe(false);
    });

    it('should remove invalid class', () => {
      clearFieldErrors(field);

      expect(field.classList.contains('valora-invalid')).toBe(false);
    });

    it('should remove aria-describedby reference to error', () => {
      clearFieldErrors(field);

      const describedBy = field.getAttribute('aria-describedby');
      expect(describedBy).toBeNull();
    });

    it('should preserve other aria-describedby values', () => {
      field.setAttribute('aria-describedby', 'valora-error-username other-description');

      clearFieldErrors(field);

      const describedBy = field.getAttribute('aria-describedby');
      expect(describedBy).toBe('other-description');
    });

    it('should use custom invalid class when clearing', () => {
      field.classList.remove('valora-invalid');
      field.classList.add('is-invalid');

      const config = {
        invalidInputClass: 'is-invalid',
      };

      clearFieldErrors(field, config);

      expect(field.classList.contains('is-invalid')).toBe(false);
    });

    it('should handle field without name or id gracefully', () => {
      const fieldWithoutName = document.createElement('input');

      // Should not throw
      expect(() => {
        clearFieldErrors(fieldWithoutName);
      }).not.toThrow();
    });

    it('should be safe to call when no errors exist', () => {
      clearFieldErrors(field);
      clearFieldErrors(field); // Second call

      // Should not throw
      expect(true).toBe(true);
    });
  });

  describe('clearFormErrors', () => {
    beforeEach(() => {
      // Add multiple fields with errors
      const field1 = document.createElement('input');
      field1.name = 'email';
      field1.id = 'email';
      form.appendChild(field1);

      const field2 = document.createElement('input');
      field2.name = 'password';
      field2.id = 'password';
      form.appendChild(field2);

      renderFieldErrors(field, ['Username error']);
      renderFieldErrors(field1, ['Email error']);
      renderFieldErrors(field2, ['Password error']);
    });

    it('should clear all field errors in form', () => {
      clearFormErrors(form);

      const errorContainers = form.querySelectorAll('.valora-error');
      expect(errorContainers.length).toBe(0);
    });

    it('should remove invalid class from all fields', () => {
      clearFormErrors(form);

      const invalidFields = form.querySelectorAll('.valora-invalid');
      expect(invalidFields.length).toBe(0);
    });

    it('should use custom classes when provided', () => {
      // Add custom classes
      field.classList.remove('valora-invalid');
      field.classList.add('is-invalid');

      const config = {
        invalidInputClass: 'is-invalid',
        errorClass: 'custom-error',
      };

      clearFormErrors(form, config);

      const invalidFields = form.querySelectorAll('.is-invalid');
      expect(invalidFields.length).toBe(0);
    });

    it('should remove orphaned error containers', () => {
      // Create an orphaned error container (error without corresponding field)
      const orphanedError = document.createElement('div');
      orphanedError.className = 'valora-error';
      orphanedError.id = 'valora-error-orphaned';
      form.appendChild(orphanedError);

      clearFormErrors(form);

      expect(document.getElementById('valora-error-orphaned')).toBeNull();
    });

    it('should be safe to call on empty form', () => {
      const emptyForm = document.createElement('form');
      document.body.appendChild(emptyForm);

      expect(() => {
        clearFormErrors(emptyForm);
      }).not.toThrow();

      document.body.removeChild(emptyForm);
    });
  });

  describe('Accessibility', () => {
    it('should provide proper ARIA attributes for screen readers', () => {
      const errors = ['This field is required'];

      renderFieldErrors(field, errors);

      // Check field attributes
      expect(field.getAttribute('aria-invalid')).toBe('true');
      expect(field.getAttribute('aria-describedby')).toContain('valora-error-username');

      // Check error container attributes
      const errorContainer = document.getElementById('valora-error-username');
      expect(errorContainer?.getAttribute('role')).toBe('alert');
      expect(errorContainer?.getAttribute('aria-live')).toBe('polite');
    });

    it('should maintain accessibility when updating errors', () => {
      renderFieldErrors(field, ['First error']);
      renderFieldErrors(field, ['Second error']);

      expect(field.getAttribute('aria-invalid')).toBe('true');
      const errorContainer = document.getElementById('valora-error-username');
      expect(errorContainer?.getAttribute('role')).toBe('alert');
    });

    it('should clean up ARIA attributes when clearing errors', () => {
      renderFieldErrors(field, ['Error']);
      clearFieldErrors(field);

      expect(field.hasAttribute('aria-invalid')).toBe(false);
      const describedBy = field.getAttribute('aria-describedby');
      expect(describedBy).toBeNull();
    });
  });
});
