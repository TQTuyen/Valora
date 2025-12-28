/**
 * Number Validator Tests
 */

import { number } from '@validators/number';
import { describe, it } from 'vitest';

import { createContext, expectFailure, expectSuccess } from '../../helpers/test-utils';

describe('Number Validator', () => {
  const ctx = createContext();

  describe('Basic Number Validation', () => {
    it('should validate number values', () => {
      const validator = number();

      expectSuccess(validator.validate(0, ctx), 0);
      expectSuccess(validator.validate(42, ctx), 42);
      expectSuccess(validator.validate(-10, ctx), -10);
      expectSuccess(validator.validate(3.14, ctx), 3.14);
    });

    it('should reject non-number values', () => {
      const validator = number();

      expectFailure(validator.validate('123' as unknown as number, ctx));
      expectFailure(validator.validate(true as unknown as number, ctx));
      expectFailure(validator.validate({} as unknown as number, ctx));
    });

    it('should reject NaN', () => {
      const validator = number();

      expectFailure(validator.validate(NaN, ctx));
    });

    it('should handle Infinity with finite check', () => {
      const validator = number().finite();

      expectSuccess(validator.validate(100, ctx));
      expectFailure(validator.validate(Infinity, ctx));
      expectFailure(validator.validate(-Infinity, ctx));
    });
  });

  describe('Range Constraints', () => {
    it('should validate min value', () => {
      const validator = number().min(10);

      expectSuccess(validator.validate(10, ctx));
      expectSuccess(validator.validate(20, ctx));
      expectFailure(validator.validate(9, ctx));
      expectFailure(validator.validate(0, ctx));
    });

    it('should validate max value', () => {
      const validator = number().max(100);

      expectSuccess(validator.validate(50, ctx));
      expectSuccess(validator.validate(100, ctx));
      expectFailure(validator.validate(101, ctx));
      expectFailure(validator.validate(200, ctx));
    });

    it('should combine min and max', () => {
      const validator = number().min(0).max(100);

      expectSuccess(validator.validate(0, ctx));
      expectSuccess(validator.validate(50, ctx));
      expectSuccess(validator.validate(100, ctx));
      expectFailure(validator.validate(-1, ctx));
      expectFailure(validator.validate(101, ctx));
    });
  });

  describe('Sign Validation', () => {
    it('should validate positive numbers', () => {
      const validator = number().positive();

      expectSuccess(validator.validate(1, ctx));
      expectSuccess(validator.validate(100, ctx));
      expectFailure(validator.validate(0, ctx));
      expectFailure(validator.validate(-1, ctx));
    });

    it('should validate negative numbers', () => {
      const validator = number().negative();

      expectSuccess(validator.validate(-1, ctx));
      expectSuccess(validator.validate(-100, ctx));
      expectFailure(validator.validate(0, ctx));
      expectFailure(validator.validate(1, ctx));
    });

    it('should validate non-negative numbers', () => {
      const validator = number().nonNegative();

      expectSuccess(validator.validate(0, ctx));
      expectSuccess(validator.validate(1, ctx));
      expectSuccess(validator.validate(100, ctx));
      expectFailure(validator.validate(-1, ctx));
    });

    it('should validate non-positive numbers', () => {
      const validator = number().nonPositive();

      expectSuccess(validator.validate(0, ctx));
      expectSuccess(validator.validate(-1, ctx));
      expectSuccess(validator.validate(-100, ctx));
      expectFailure(validator.validate(1, ctx));
    });
  });

  describe('Integer Validation', () => {
    it('should validate integers', () => {
      const validator = number().integer();

      expectSuccess(validator.validate(0, ctx));
      expectSuccess(validator.validate(42, ctx));
      expectSuccess(validator.validate(-10, ctx));
      expectFailure(validator.validate(3.14, ctx));
      expectFailure(validator.validate(1.5, ctx));
    });

    it('should validate safe integers', () => {
      const validator = number().safeInteger();

      expectSuccess(validator.validate(42, ctx));
      expectSuccess(validator.validate(Number.MAX_SAFE_INTEGER, ctx));
      expectFailure(validator.validate(Number.MAX_SAFE_INTEGER + 1, ctx));
      expectFailure(validator.validate(3.14, ctx));
    });
  });

  describe('Multiple Of Validation', () => {
    it('should validate multiples', () => {
      const validator = number().multipleOf(5);

      expectSuccess(validator.validate(0, ctx));
      expectSuccess(validator.validate(5, ctx));
      expectSuccess(validator.validate(10, ctx));
      expectSuccess(validator.validate(-15, ctx));
      expectFailure(validator.validate(3, ctx));
      expectFailure(validator.validate(7, ctx));
    });

    it('should validate decimal multiples', () => {
      const validator = number().multipleOf(0.5);

      expectSuccess(validator.validate(1.5, ctx));
      expectSuccess(validator.validate(2.0, ctx));
      expectFailure(validator.validate(1.3, ctx));
    });
  });

  describe('Chaining Validations', () => {
    it('should chain multiple number validations', () => {
      const validator = number().min(0).max(100).integer();

      expectSuccess(validator.validate(50, ctx));
      expectFailure(validator.validate(-1, ctx)); // Below min
      expectFailure(validator.validate(101, ctx)); // Above max
      expectFailure(validator.validate(50.5, ctx)); // Not integer
    });

    it('should chain sign and range validations', () => {
      const validator = number().positive().max(1000);

      expectSuccess(validator.validate(500, ctx));
      expectFailure(validator.validate(0, ctx)); // Not positive
      expectFailure(validator.validate(-10, ctx)); // Negative
      expectFailure(validator.validate(1001, ctx)); // Above max
    });
  });

  describe('Optional and Nullable', () => {
    it('should handle optional numbers', () => {
      const validator = number().optional();

      expectSuccess(validator.validate(undefined, ctx));
      expectSuccess(validator.validate(42, ctx));
    });

    it('should combine optional with validations', () => {
      const validator = number().min(10).optional();

      expectSuccess(validator.validate(undefined, ctx));
      expectSuccess(validator.validate(20, ctx));
      expectFailure(validator.validate(5, ctx));
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero correctly', () => {
      const validator = number();

      expectSuccess(validator.validate(0, ctx), 0);
    });

    it('should handle very large numbers', () => {
      const validator = number();

      expectSuccess(validator.validate(Number.MAX_VALUE, ctx));
    });

    it('should handle very small numbers', () => {
      const validator = number();

      expectSuccess(validator.validate(Number.MIN_VALUE, ctx));
    });

    it('should handle negative zero', () => {
      const validator = number();

      expectSuccess(validator.validate(-0, ctx));
    });
  });
});
