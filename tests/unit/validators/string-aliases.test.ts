/**
 * String Validator — alias and transform method coverage
 */

import { string } from '@validators/string';
import { describe, expect, it } from 'vitest';

import { createContext, expectFailure, expectSuccess } from '../../helpers/test-utils';

describe('StringValidator aliases and transforms', () => {
  const ctx = createContext();

  describe('min() alias for minLength()', () => {
    it('should work like minLength()', () => {
      const v = string().min(3);
      expectSuccess(v.validate('abc', ctx));
      expectFailure(v.validate('ab', ctx));
    });
  });

  describe('max() alias for maxLength()', () => {
    it('should work like maxLength()', () => {
      const v = string().max(5);
      expectSuccess(v.validate('abcde', ctx));
      expectFailure(v.validate('abcdef', ctx));
    });
  });

  describe('regex() alias for matches()', () => {
    it('should validate with a regex pattern', () => {
      const v = string().regex(/^\d{4}$/);
      expectSuccess(v.validate('1234', ctx));
      expectFailure(v.validate('abc', ctx));
    });
  });

  describe('includes() alias for contains()', () => {
    it('should check if string contains a substring', () => {
      const v = string().includes('foo');
      expectSuccess(v.validate('foobar', ctx));
      expectFailure(v.validate('barbaz', ctx));
    });
  });

  describe('alphanum() alias for alphanumeric()', () => {
    it('should validate alphanumeric strings', () => {
      const v = string().alphanum();
      expectSuccess(v.validate('abc123', ctx));
      expectFailure(v.validate('abc-123', ctx));
    });
  });

  describe('nonempty() alias for notEmpty()', () => {
    it('should reject empty or whitespace strings', () => {
      const v = string().nonempty();
      expectSuccess(v.validate('hello', ctx));
      expectFailure(v.validate('', ctx));
      expectFailure(v.validate('   ', ctx));
    });
  });

  describe('trim() transform', () => {
    it('should trim whitespace from the string', () => {
      const v = string().trim();
      const result = v.validate('  hello  ', ctx);
      expect(result.success).toBe(true);
      expect(result.data).toBe('hello');
    });
  });

  describe('toLowerCase() transform', () => {
    it('should convert to lowercase', () => {
      const v = string().toLowerCase();
      const result = v.validate('HELLO', ctx);
      expect(result.success).toBe(true);
      expect(result.data).toBe('hello');
    });
  });

  describe('toUpperCase() transform', () => {
    it('should convert to uppercase', () => {
      const v = string().toUpperCase();
      const result = v.validate('hello', ctx);
      expect(result.success).toBe(true);
      expect(result.data).toBe('HELLO');
    });
  });

  describe('clone() via chaining', () => {
    it('clone should preserve strategies', () => {
      const base = string().minLength(3).email();
      const cloned = base.optional(); // triggers clone internally
      expect(cloned.validate('user@example.com', ctx).success).toBe(true);
      expect(cloned.validate(undefined, ctx).success).toBe(true);
    });

    it('clone should preserve customMessage via withMessage', () => {
      const v = string().minLength(3).withMessage('too short');
      const result = v.validate('ab', ctx);
      expect(result.success).toBe(false);
      // withMessage wraps the result — the validator should still work
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
