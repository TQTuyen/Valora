/**
 * Number Validator — alias and uncovered method coverage
 */

import { number } from '@validators/number';
import { describe, expect, it } from 'vitest';

import { createContext, expectFailure, expectSuccess } from '../../helpers/test-utils';

describe('NumberValidator aliases', () => {
  const ctx = createContext();

  describe('between() alias for range()', () => {
    it('should work like range()', () => {
      const v = number().between(1, 10);
      expectSuccess(v.validate(5, ctx));
      expectFailure(v.validate(11, ctx));
    });
  });

  describe('int() alias for integer()', () => {
    it('should validate integers', () => {
      const v = number().int();
      expectSuccess(v.validate(5, ctx));
      expectFailure(v.validate(5.5, ctx));
    });
  });

  describe('safeInteger() alias for safe()', () => {
    it('should validate safe integers', () => {
      const v = number().safeInteger();
      expectSuccess(v.validate(42, ctx));
      expectFailure(v.validate(Number.MAX_SAFE_INTEGER + 1, ctx));
    });
  });

  describe('nonnegative() alias for nonNegative()', () => {
    it('should reject negative numbers', () => {
      const v = number().nonnegative();
      expectSuccess(v.validate(0, ctx));
      expectSuccess(v.validate(1, ctx));
      expectFailure(v.validate(-1, ctx));
    });
  });

  describe('nonpositive() alias for nonPositive()', () => {
    it('should reject positive numbers', () => {
      const v = number().nonpositive();
      expectSuccess(v.validate(0, ctx));
      expectSuccess(v.validate(-1, ctx));
      expectFailure(v.validate(1, ctx));
    });
  });

  describe('step() alias for multipleOf()', () => {
    it('should validate multiples', () => {
      const v = number().step(5);
      expectSuccess(v.validate(10, ctx));
      expectFailure(v.validate(7, ctx));
    });
  });

  describe('clone() via chaining', () => {
    it('should preserve strategies and required flag', () => {
      const base = number().min(0).max(100);
      const cloned = base.optional();
      expect(cloned.validate(50, ctx).success).toBe(true);
      expect(cloned.validate(undefined, ctx).success).toBe(true);
    });

    it('should preserve customMessage via withMessage', () => {
      const v = number().min(10).withMessage('too small');
      const result = v.validate(5, ctx);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('NaN check', () => {
    it('should reject NaN', () => {
      const v = number();
      expectFailure(v.validate(NaN, ctx));
    });
  });
});
