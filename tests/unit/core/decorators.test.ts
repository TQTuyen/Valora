/**
 * Core Decorators Tests (field, validate, helpers)
 */

import { field } from '@core/decorators/field';
import { validate } from '@core/decorators/validate';
import { validateInstance, ValoraValidationError } from '@core/decorators/helpers';
import { string } from '@validators/string';
import { number } from '@validators/number';
import { describe, expect, it } from 'vitest';

describe('core/decorators', () => {
  describe('field decorator', () => {
    it('should register a field validator via decorator', () => {
      class TestClass {
        name?: string;
      }
      field(string().required())(TestClass.prototype, 'name');

      const instance = new TestClass();
      instance.name = 'Alice';

      const result = validateInstance(instance);
      expect(result.success).toBe(true);
    });

    it('should fail validation for invalid field', () => {
      class TestClass2 {
        email?: string;
      }
      field(string().email())(TestClass2.prototype, 'email');

      const instance = new TestClass2();
      instance.email = 'not-valid';

      const result = validateInstance(instance);
      expect(result.success).toBe(false);
    });

    it('should accumulate multiple fields', () => {
      class MultiClass {
        name?: string;
        age?: number;
      }
      field(string().required())(MultiClass.prototype, 'name');
      field(number().min(0))(MultiClass.prototype, 'age');

      const instance = new MultiClass();
      instance.name = 'Bob';
      instance.age = 25;

      const result = validateInstance(instance);
      expect(result.success).toBe(true);
    });
  });

  describe('validateInstance', () => {
    it('should return success for instance with no validators', () => {
      class EmptyClass {}
      const result = validateInstance(new EmptyClass());
      expect(result.success).toBe(true);
    });

    it('should collect all errors from multiple invalid fields', () => {
      class MultiError {
        email?: string;
        name?: string;
      }
      field(string().email())(MultiError.prototype, 'email');
      field(string().required())(MultiError.prototype, 'name');

      const instance = new MultiError();
      instance.email = 'bad';
      // name is undefined — required fails

      const result = validateInstance(instance);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('ValoraValidationError', () => {
    it('should have name ValoraValidationError', () => {
      const err = new ValoraValidationError('test', []);
      expect(err.name).toBe('ValoraValidationError');
      expect(err.message).toBe('test');
      expect(err.errors).toEqual([]);
    });

    it('should be an instance of Error', () => {
      const err = new ValoraValidationError('msg', []);
      expect(err).toBeInstanceOf(Error);
    });
  });

  describe('validate class decorator', () => {
    it('should validate on construction and throw by default', () => {
      @validate()
      class Validated {
        name?: string;
      }
      field(string().required())(Validated.prototype, 'name');

      expect(() => {
        const v = new Validated();
        // name is undefined — required fails
        return v;
      }).toThrow(ValoraValidationError);
    });

    it('should not throw when validateOnCreate=false', () => {
      @validate({ validateOnCreate: false })
      class ValidGood {
        name?: string;
      }
      field(string().required())(ValidGood.prototype, 'name');

      expect(() => new ValidGood()).not.toThrow();
    });

    it('should not validate on create when validateOnCreate=false', () => {
      @validate({ validateOnCreate: false })
      class NotValidatedOnCreate {
        email?: string;
      }
      field(string().email())(NotValidatedOnCreate.prototype, 'email');

      expect(() => {
        const v = new NotValidatedOnCreate();
        v.email = 'bad';
        return v;
      }).not.toThrow();
    });

    it('should not throw when throwOnError=false even with invalid data', () => {
      @validate({ throwOnError: false })
      class NoThrow {
        email?: string;
      }
      field(string().email())(NoThrow.prototype, 'email');

      expect(() => new NoThrow()).not.toThrow();
    });
  });
});
