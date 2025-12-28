/**
 * String Validator Tests
 */

import { string } from '@validators/string';
import { describe, expect, it } from 'vitest';

import { INVALID_EMAILS, VALID_EMAILS } from '../../helpers/fixtures';
import { createContext, expectFailure, expectSuccess } from '../../helpers/test-utils';

describe('String Validator', () => {
  const ctx = createContext();

  describe('Basic String Validation', () => {
    it('should validate string values', () => {
      const validator = string();

      expectSuccess(validator.validate('hello', ctx), 'hello');
      expectSuccess(validator.validate('', ctx), '');
      expectSuccess(validator.validate('123', ctx), '123');
    });

    it('should reject non-string values', () => {
      const validator = string();

      expectFailure(validator.validate(123 as unknown as string, ctx));
      expectFailure(validator.validate(true as unknown as string, ctx));
      expectFailure(validator.validate({} as unknown as string, ctx));
      expectFailure(validator.validate([] as unknown as string, ctx));
    });
  });

  describe('Length Constraints', () => {
    it('should validate min length', () => {
      const validator = string().minLength(3);

      expectSuccess(validator.validate('abc', ctx));
      expectSuccess(validator.validate('abcd', ctx));
      expectFailure(validator.validate('ab', ctx));
      expectFailure(validator.validate('', ctx));
    });

    it('should validate max length', () => {
      const validator = string().maxLength(5);

      expectSuccess(validator.validate('abc', ctx));
      expectSuccess(validator.validate('abcde', ctx));
      expectFailure(validator.validate('abcdef', ctx));
    });

    it('should validate exact length', () => {
      const validator = string().length(5);

      expectSuccess(validator.validate('abcde', ctx));
      expectFailure(validator.validate('abc', ctx));
      expectFailure(validator.validate('abcdef', ctx));
    });

    it('should combine min and max length', () => {
      const validator = string().minLength(3).maxLength(10);

      expectSuccess(validator.validate('abc', ctx));
      expectSuccess(validator.validate('abcdefgh', ctx));
      expectFailure(validator.validate('ab', ctx));
      expectFailure(validator.validate('abcdefghijk', ctx));
    });
  });

  describe('Pattern Validation', () => {
    it('should validate email addresses', () => {
      const validator = string().email();

      VALID_EMAILS.forEach((email) => {
        const result = validator.validate(email, ctx);
        expect(result.success).toBe(true);
      });

      INVALID_EMAILS.forEach((email) => {
        const result = validator.validate(email, ctx);
        expect(result.success).toBe(false);
      });
    });

    it('should validate URLs', () => {
      const validator = string().url();

      // Test a few valid URLs
      expectSuccess(validator.validate('https://example.com', ctx));
      expectSuccess(validator.validate('http://test.com', ctx));

      // Test invalid URLs
      expectFailure(validator.validate('not-a-url', ctx));
      expectFailure(validator.validate('example.com', ctx));
    });

    it('should validate UUIDs', () => {
      const validator = string().uuid();

      // Test valid UUID
      const result1 = validator.validate('550e8400-e29b-41d4-a716-446655440000', ctx);
      expect(result1.success).toBe(true);

      // Test invalid UUID
      const result2 = validator.validate('invalid-uuid', ctx);
      expect(result2.success).toBe(false);
    });

    it('should validate custom patterns', () => {
      const validator = string().pattern(/^[A-Z]{3}\d{3}$/);

      expectSuccess(validator.validate('ABC123', ctx));
      expectSuccess(validator.validate('XYZ999', ctx));
      expectFailure(validator.validate('abc123', ctx));
      expectFailure(validator.validate('AB123', ctx));
      expectFailure(validator.validate('ABC12', ctx));
    });
  });

  describe('Content Validation', () => {
    it('should validate alpha characters', () => {
      const validator = string().alpha();

      expectSuccess(validator.validate('abc', ctx));
      expectSuccess(validator.validate('ABC', ctx));
      expectSuccess(validator.validate('AbCdEf', ctx));
      expectFailure(validator.validate('abc123', ctx));
      expectFailure(validator.validate('abc!', ctx));
    });

    it('should validate alphanumeric characters', () => {
      const validator = string().alphanumeric();

      expectSuccess(validator.validate('abc123', ctx));
      expectSuccess(validator.validate('ABC123', ctx));
      expectFailure(validator.validate('abc-123', ctx));
      expectFailure(validator.validate('abc!', ctx));
    });

    it('should validate numeric strings', () => {
      const validator = string().numeric();

      expectSuccess(validator.validate('123', ctx));
      expectSuccess(validator.validate('0', ctx));
      expectSuccess(validator.validate('12.3', ctx)); // Numeric includes decimals
      expectSuccess(validator.validate('-42.5', ctx)); // Negative decimals too
      expectFailure(validator.validate('abc', ctx));
      expectFailure(validator.validate('12.3.4', ctx)); // Multiple decimals invalid
    });

    it('should validate lowercase strings', () => {
      const validator = string().lowercase();

      expectSuccess(validator.validate('hello', ctx));
      expectSuccess(validator.validate('world123', ctx));
      expectFailure(validator.validate('Hello', ctx));
      expectFailure(validator.validate('WORLD', ctx));
    });

    it('should validate uppercase strings', () => {
      const validator = string().uppercase();

      expectSuccess(validator.validate('HELLO', ctx));
      expectSuccess(validator.validate('WORLD123', ctx));
      expectFailure(validator.validate('Hello', ctx));
      expectFailure(validator.validate('world', ctx));
    });
  });

  describe('String Content Checks', () => {
    it('should validate contains', () => {
      const validator = string().contains('test');

      expectSuccess(validator.validate('this is a test', ctx));
      expectSuccess(validator.validate('test', ctx));
      expectFailure(validator.validate('no match', ctx));
    });

    it('should validate startsWith', () => {
      const validator = string().startsWith('hello');

      expectSuccess(validator.validate('hello world', ctx));
      expectSuccess(validator.validate('hello', ctx));
      expectFailure(validator.validate('world hello', ctx));
    });

    it('should validate endsWith', () => {
      const validator = string().endsWith('world');

      expectSuccess(validator.validate('hello world', ctx));
      expectSuccess(validator.validate('world', ctx));
      expectFailure(validator.validate('world hello', ctx));
    });

    it('should validate non-empty strings', () => {
      const validator = string().notEmpty();

      expectSuccess(validator.validate('hello', ctx));
      expectSuccess(validator.validate('hello world', ctx));
      expectFailure(validator.validate('', ctx)); // Empty string
      expectFailure(validator.validate(' ', ctx)); // Whitespace-only is treated as empty
      expectFailure(validator.validate('   ', ctx)); // Multiple spaces also empty
    });
  });

  describe('Chaining Validations', () => {
    it('should chain multiple string validations', () => {
      const validator = string().minLength(3).maxLength(20).email();

      expectSuccess(validator.validate('test@example.com', ctx));
      expectSuccess(validator.validate('a@b.c', ctx)); // Short but valid email
      expectFailure(validator.validate('ab', ctx)); // Too short (not email format)
      expectFailure(validator.validate('not-an-email', ctx)); // Not email
      expectFailure(validator.validate('verylongemailaddress@example.com', ctx)); // Too long (>20 chars)
    });

    it('should chain pattern and content validations', () => {
      const validator = string().minLength(5).alphanumeric().uppercase();

      expectSuccess(validator.validate('ABC123', ctx));
      expectFailure(validator.validate('ABC', ctx)); // Too short
      expectFailure(validator.validate('abc123', ctx)); // Not uppercase
      expectFailure(validator.validate('ABC-123', ctx)); // Not alphanumeric
    });
  });

  describe('Optional and Nullable', () => {
    it('should handle optional strings', () => {
      const validator = string().optional();

      expectSuccess(validator.validate(undefined, ctx));
      expectSuccess(validator.validate('hello', ctx));
      expectFailure(validator.validate(null as unknown as string | undefined, ctx));
    });

    it('should handle nullable strings', () => {
      const validator = string().nullable();

      expectSuccess(validator.validate(null, ctx));
      expectSuccess(validator.validate('hello', ctx));
      expectFailure(validator.validate(undefined as unknown as string | null, ctx));
    });

    it('should combine optional with validations', () => {
      const validator = string().minLength(3).optional();

      expectSuccess(validator.validate(undefined, ctx));
      expectSuccess(validator.validate('hello', ctx));
      expectFailure(validator.validate('ab', ctx)); // Too short
    });
  });

  describe('Custom Messages', () => {
    it('should use custom error messages', () => {
      const validator = string().minLength(5).withMessage('Must be at least 5 characters');

      const result = validator.validate('ab', ctx);

      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toContain('Must be at least 5 characters');
    });
  });

  describe('Edge Cases', () => {
    it('should handle unicode strings', () => {
      const validator = string().minLength(3);

      expectSuccess(validator.validate('你好世界', ctx));
    });

    it('should handle emoji in strings', () => {
      const validator = string().contains('😀');

      expectSuccess(validator.validate('Hello 😀 World', ctx));
    });

    it('should handle very long strings', () => {
      const validator = string().maxLength(10000);
      const longString = 'a'.repeat(5000);

      expectSuccess(validator.validate(longString, ctx));
    });
  });
});
