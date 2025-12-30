/**
 * Base Adapter Tests
 */

import { BaseFrameworkAdapter } from '@adapters/base-adapter';
import {
  canSubmit,
  formatErrors,
  getFieldBindings,
  getFirstError,
  hasFieldErrors,
  shouldShowErrors,
} from '@adapters/adapter-utils';
import { number } from '@validators/number';
import { string } from '@validators/string';
import { describe, expect, it } from 'vitest';

// Concrete implementation for testing
class TestAdapter<T extends Record<string, unknown>> extends BaseFrameworkAdapter<T> {
  // Expose protected formManager for testing
  getFormManager() {
    return this.formManager;
  }
}

describe('Base Framework Adapter', () => {
  describe('Constructor and Initialization', () => {
    it('should initialize with validators', () => {
      const validators = {
        name: string(),
        age: number(),
      };

      const adapter = new TestAdapter(validators);

      expect(adapter).toBeDefined();
      expect(adapter.getFormState()).toBeDefined();
    });

    it('should initialize with initial values', () => {
      const validators = {
        name: string(),
        age: number(),
      };

      const adapter = new TestAdapter(validators, {
        initialValues: { name: 'John', age: 30 },
      });

      const values = adapter.getValues();

      expect(values.name).toBe('John');
      expect(values.age).toBe(30);
    });
  });

  describe('State Access', () => {
    it('should get form state', () => {
      const validators = {
        name: string(),
      };

      const adapter = new TestAdapter(validators);
      const formState = adapter.getFormState();

      expect(formState.isValid).toBe(true);
      expect(formState.touched).toBe(false);
      expect(formState.dirty).toBe(false);
      expect(formState.validating).toBe(false);
    });

    it('should get field state', () => {
      const validators = {
        name: string(),
      };

      const adapter = new TestAdapter(validators, {
        initialValues: { name: 'John' },
      });

      const fieldState = adapter.getFieldState('name');

      expect(fieldState).toBeDefined();
      expect(fieldState?.value).toBe('John');
      expect(fieldState?.touched).toBe(false);
      expect(fieldState?.dirty).toBe(false);
    });

    it('should get all field states', () => {
      const validators = {
        name: string(),
        age: number(),
      };

      const adapter = new TestAdapter(validators);
      const allFields = adapter.getAllFieldStates();

      expect(allFields.name).toBeDefined();
      expect(allFields.age).toBeDefined();
    });

    it('should get all values', () => {
      const validators = {
        name: string(),
        age: number(),
      };

      const adapter = new TestAdapter(validators, {
        initialValues: { name: 'John', age: 30 },
      });

      const values = adapter.getValues();

      expect(values).toEqual({ name: 'John', age: 30 });
    });
  });

  describe('Field Operations', () => {
    it('should set field value', () => {
      const validators = {
        name: string(),
      };

      const adapter = new TestAdapter(validators);
      adapter.setFieldValue('name', 'Jane');

      const fieldState = adapter.getFieldState('name');

      expect(fieldState?.value).toBe('Jane');
      expect(fieldState?.dirty).toBe(true);
    });

    it('should set multiple values', () => {
      const validators = {
        name: string(),
        age: number(),
      };

      const adapter = new TestAdapter(validators);
      adapter.setValues({ name: 'Jane', age: 25 });

      const values = adapter.getValues();

      expect(values.name).toBe('Jane');
      expect(values.age).toBe(25);
    });

    it('should touch field', () => {
      const validators = {
        name: string(),
      };

      const adapter = new TestAdapter(validators);
      adapter.touchField('name');

      const fieldState = adapter.getFieldState('name');

      expect(fieldState?.touched).toBe(true);
    });

    it('should clear errors', () => {
      const validators = {
        name: string().minLength(5),
      };

      const adapter = new TestAdapter(validators);

      // Set invalid value to generate error
      adapter.setFieldValue('name', 'Jo', { validate: true });

      // Verify error exists
      let formState = adapter.getFormState();
      expect(formState.isValid).toBe(false);

      // Clear errors
      adapter.clearErrors();

      formState = adapter.getFormState();
      expect(formState.errors).toEqual([]);
    });
  });

  describe('Validation', () => {
    it('should validate single field', () => {
      const validators = {
        email: string().email(),
      };

      const adapter = new TestAdapter(validators, {
        initialValues: { email: 'test@example.com' },
      });

      const result = adapter.validateField('email');

      expect(result.success).toBe(true);
    });

    it('should fail field validation', () => {
      const validators = {
        email: string().email(),
      };

      const adapter = new TestAdapter(validators, {
        initialValues: { email: 'invalid' },
      });

      const result = adapter.validateField('email');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate all fields', () => {
      const validators = {
        name: string().minLength(3),
        age: number().min(0),
      };

      const adapter = new TestAdapter(validators, {
        initialValues: { name: 'John', age: 30 },
      });

      const result = adapter.validateAll();

      expect(result.success).toBe(true);
    });

    it('should fail validation for all fields', () => {
      const validators = {
        name: string().minLength(5),
        age: number().min(18),
      };

      const adapter = new TestAdapter(validators, {
        initialValues: { name: 'Jo', age: 10 },
      });

      const result = adapter.validateAll();

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Reset Operations', () => {
    it('should reset single field', () => {
      const validators = {
        name: string(),
      };

      const adapter = new TestAdapter(validators);

      adapter.setFieldValue('name', 'Jane');
      adapter.resetField('name', 'John');

      const fieldState = adapter.getFieldState('name');

      expect(fieldState?.value).toBe('John');
      expect(fieldState?.touched).toBe(false);
      expect(fieldState?.dirty).toBe(false);
    });

    it('should reset all fields', () => {
      const validators = {
        name: string(),
        age: number(),
      };

      const adapter = new TestAdapter(validators, {
        initialValues: { name: 'John', age: 30 },
      });

      adapter.setValues({ name: 'Jane', age: 25 });
      adapter.resetAll({ name: 'John', age: 30 });

      const values = adapter.getValues();

      expect(values.name).toBe('John');
      expect(values.age).toBe(30);
    });
  });

  describe('Subscriptions', () => {
    it('should subscribe to field changes', () => {
      const validators = {
        name: string(),
      };

      const adapter = new TestAdapter(validators);
      const changes: unknown[] = [];

      adapter.subscribeToField('name', (fieldState) => {
        changes.push(fieldState.value);
      });

      adapter.setFieldValue('name', 'Jane');

      expect(changes).toContain('Jane');
    });

    it('should subscribe to form changes', () => {
      const validators = {
        name: string(),
      };

      const adapter = new TestAdapter(validators);
      let changeCount = 0;

      adapter.subscribeToForm(() => {
        changeCount++;
      });

      adapter.setFieldValue('name', 'Jane');

      expect(changeCount).toBeGreaterThan(0);
    });

    it('should unsubscribe from changes', () => {
      const validators = {
        name: string(),
      };

      const adapter = new TestAdapter(validators);
      const changes: unknown[] = [];

      const unsubscribe = adapter.subscribeToField('name', (fieldState) => {
        changes.push(fieldState.value);
      });

      adapter.setFieldValue('name', 'Jane');
      unsubscribe();
      adapter.setFieldValue('name', 'Bob');

      // Initial (undefined) + validation start (Jane) + validation end (Jane) = 3
      // After unsubscribe, 'Bob' should not trigger callbacks
      expect(changes).toHaveLength(3);
      expect(changes).toEqual([undefined, 'Jane', 'Jane']);
    });
  });

  describe('Lifecycle', () => {
    it('should cleanup subscriptions on destroy', () => {
      const validators = {
        name: string(),
      };

      const adapter = new TestAdapter(validators);

      adapter.subscribeToField('name', () => {});
      adapter.subscribeToForm(() => {});

      adapter.destroy();

      // Should not throw after destroy
      expect(() => {
        adapter.setFieldValue('name', 'Jane');
      }).not.toThrow();
    });
  });

  describe('Adapter Utilities', () => {
    it('should check if field has errors', () => {
      const fieldState = {
        value: 'test',
        touched: false,
        dirty: false,
        validating: false,
        errors: [{ code: 'error', message: 'Error', path: [], field: 'test' }],
        isValid: false,
      };

      expect(hasFieldErrors(fieldState)).toBe(true);
      expect(
        hasFieldErrors({
          ...fieldState,
          errors: [],
        }),
      ).toBe(false);
    });

    it('should get first error', () => {
      const fieldState = {
        value: 'test',
        touched: false,
        dirty: false,
        validating: false,
        errors: [
          { code: 'error', message: 'First error', path: [], field: 'test' },
          { code: 'error', message: 'Second error', path: [], field: 'test' },
        ],
        isValid: false,
      };

      expect(getFirstError(fieldState)).toBe('First error');
    });

    it('should check if errors should be shown', () => {
      const fieldState = {
        value: 'test',
        touched: true,
        dirty: false,
        validating: false,
        errors: [{ code: 'error', message: 'Error', path: [], field: 'test' }],
        isValid: false,
      };

      expect(shouldShowErrors(fieldState)).toBe(true);
      expect(
        shouldShowErrors({
          ...fieldState,
          touched: false,
        }),
      ).toBe(false);
    });

    it('should format errors', () => {
      const fieldState = {
        value: 'test',
        touched: false,
        dirty: false,
        validating: false,
        errors: [
          { code: 'error.1', message: 'Error 1', path: [], field: 'test' },
          { code: 'error.2', message: 'Error 2', path: [], field: 'test' },
        ],
        isValid: false,
      };

      const formatted = formatErrors(fieldState);

      expect(formatted).toEqual(['Error 1', 'Error 2']);
    });

    it('should check if form can be submitted', () => {
      const formState = {
        fields: {},
        isValid: true,
        validating: false,
        touched: false,
        dirty: false,
        errors: [],
      };

      expect(canSubmit(formState)).toBe(true);
      expect(canSubmit({ ...formState, isValid: false })).toBe(false);
      expect(canSubmit({ ...formState, validating: true })).toBe(false);
    });

    it('should get field bindings', () => {
      const validators = {
        name: string(),
      };

      const adapter = new TestAdapter(validators, {
        initialValues: { name: 'John' },
      });

      const bindings = getFieldBindings(adapter, 'name');

      expect(bindings.value).toBe('John');
      expect(bindings.onChange).toBeInstanceOf(Function);
      expect(bindings.onBlur).toBeInstanceOf(Function);
      expect(bindings.hasError).toBe(false);
    });
  });
});
