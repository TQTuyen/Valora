/**
 * Business Validator Tests
 */

import { business, CreditCardType, slugify } from '@validators/business';
import { describe, expect, it } from 'vitest';

import { createContext, expectFailure, expectSuccess } from '../../helpers/test-utils';

describe('Business Validator', () => {
  const ctx = createContext();

  describe('Credit Card Validation', () => {
    it('should validate valid credit card numbers', () => {
      const validator = business().creditCard();

      // Valid Visa
      expectSuccess(validator.validate('4111111111111111', ctx));

      // Valid Mastercard
      expectSuccess(validator.validate('5555555555554444', ctx));

      // Valid Amex
      expectSuccess(validator.validate('378282246310005', ctx));
    });

    it('should reject invalid credit card numbers', () => {
      const validator = business().creditCard();

      expectFailure(validator.validate('1234567890123456', ctx)); // Fails Luhn
      expectFailure(validator.validate('4111-1111-1111-1112', ctx)); // Invalid checksum
      expectFailure(validator.validate('not-a-card', ctx)); // Non-numeric
    });

    it('should validate only allowed card types', () => {
      const validator = business().creditCard([CreditCardType.VISA, CreditCardType.MASTERCARD]);

      // Visa - allowed
      expectSuccess(validator.validate('4111111111111111', ctx));

      // Mastercard - allowed
      expectSuccess(validator.validate('5555555555554444', ctx));

      // Amex - not allowed
      expectFailure(validator.validate('378282246310005', ctx));
    });

    it('should handle spaces and hyphens in card numbers', () => {
      const validator = business().creditCard();

      expectSuccess(validator.validate('4111 1111 1111 1111', ctx));
      expectSuccess(validator.validate('4111-1111-1111-1111', ctx));
      expectSuccess(validator.validate('5555 5555 5555 4444', ctx));
    });
  });

  describe('Phone Number Validation', () => {
    it('should validate international phone numbers', () => {
      const validator = business().phone();

      expectSuccess(validator.validate('+1234567890', ctx));
      expectSuccess(validator.validate('+84987654321', ctx));
      expectSuccess(validator.validate('+442071234567', ctx));
    });

    it('should validate US phone numbers', () => {
      const validator = business().phone({ countryCode: 'US' });

      expectSuccess(validator.validate('+12025551234', ctx)); // With country code
      expectSuccess(validator.validate('12025551234', ctx)); // Without +
      expectFailure(validator.validate('+84987654321', ctx)); // Vietnamese number
    });

    it('should validate Vietnamese phone numbers', () => {
      const validator = business().phone({ countryCode: 'VN' });

      expectSuccess(validator.validate('+84987654321', ctx));
      expectSuccess(validator.validate('84987654321', ctx));
      expectFailure(validator.validate('+12025551234', ctx)); // US number
    });

    it('should handle phone numbers with separators', () => {
      const validator = business().phone();

      expectSuccess(validator.validate('+1 (202) 555-1234', ctx));
      expectSuccess(validator.validate('+1-202-555-1234', ctx));
      expectSuccess(validator.validate('+1.202.555.1234', ctx));
    });

    it('should validate phone numbers with extensions', () => {
      const validator = business().phone({ allowExtension: true });

      expectSuccess(validator.validate('+12025551234ext123', ctx));
      expectSuccess(validator.validate('+12025551234x456', ctx));
    });

    it('should reject invalid phone numbers', () => {
      const validator = business().phone();

      expectFailure(validator.validate('123', ctx)); // Too short
      expectFailure(validator.validate('not-a-phone', ctx)); // Non-numeric
      expectFailure(validator.validate('+12345678901234567890', ctx)); // Too long
    });
  });

  describe('IBAN Validation', () => {
    it('should validate valid IBAN numbers', () => {
      const validator = business().iban();

      // Germany
      expectSuccess(validator.validate('DE89370400440532013000', ctx));

      // United Kingdom
      expectSuccess(validator.validate('GB82 WEST 1234 5698 7654 32', ctx));

      // France
      expectSuccess(validator.validate('FR1420041010050500013M02606', ctx));

      // Spain
      expectSuccess(validator.validate('ES9121000418450200051332', ctx));
    });

    it('should validate IBAN with spaces', () => {
      const validator = business().iban();

      expectSuccess(validator.validate('DE89 3704 0044 0532 0130 00', ctx));
      expectSuccess(validator.validate('GB82 WEST 1234 5698 7654 32', ctx));
    });

    it('should reject invalid IBAN numbers', () => {
      const validator = business().iban();

      expectFailure(validator.validate('DE89370400440532013001', ctx)); // Invalid checksum
      expectFailure(validator.validate('XX1234567890', ctx)); // Invalid country
      expectFailure(validator.validate('DE123', ctx)); // Too short
      expectFailure(validator.validate('not-an-iban', ctx)); // Invalid format
    });

    it('should validate only allowed countries', () => {
      const validator = business().iban(['DE', 'FR']);

      // Germany - allowed
      expectSuccess(validator.validate('DE89370400440532013000', ctx));

      // France - allowed
      expectSuccess(validator.validate('FR1420041010050500013M02606', ctx));

      // UK - not allowed
      expectFailure(validator.validate('GB82WEST12345698765432', ctx));
    });

    it('should reject IBAN with incorrect length for country', () => {
      const validator = business().iban();

      // Germany should be 22 chars
      expectFailure(validator.validate('DE8937040044053201300', ctx)); // Too short
    });
  });

  describe('SSN Validation', () => {
    it('should validate valid SSN numbers', () => {
      const validator = business().ssn();

      expectSuccess(validator.validate('856-45-6789', ctx));
      expectSuccess(validator.validate('856456789', ctx)); // Without hyphens
      expectSuccess(validator.validate('123-67-8901', ctx));
    });

    it('should reject invalid SSN area numbers', () => {
      const validator = business().ssn();

      expectFailure(validator.validate('000-45-6789', ctx)); // Area 000
      expectFailure(validator.validate('666-45-6789', ctx)); // Area 666
      expectFailure(validator.validate('900-45-6789', ctx)); // Area 900-999
    });

    it('should reject invalid SSN group numbers', () => {
      const validator = business().ssn();

      expectFailure(validator.validate('123-00-6789', ctx)); // Group 00
    });

    it('should reject invalid SSN serial numbers', () => {
      const validator = business().ssn();

      expectFailure(validator.validate('123-45-0000', ctx)); // Serial 0000
    });

    it('should reject known invalid patterns', () => {
      const validator = business().ssn();

      expectFailure(validator.validate('111-11-1111', ctx)); // Repeated
      expectFailure(validator.validate('222-22-2222', ctx)); // Repeated
      expectFailure(validator.validate('078-05-1120', ctx)); // Woolworth card
    });

    it('should reject non-numeric SSN', () => {
      const validator = business().ssn();

      expectFailure(validator.validate('not-a-ssn', ctx));
      expectFailure(validator.validate('12-345-6789', ctx)); // Wrong format
    });
  });

  describe('URL Slug Validation', () => {
    it('should validate valid URL slugs', () => {
      const validator = business().slug();

      expectSuccess(validator.validate('hello-world', ctx));
      expectSuccess(validator.validate('my-blog-post-2024', ctx));
      expectSuccess(validator.validate('product-123', ctx));
      expectSuccess(validator.validate('a', ctx)); // Single char
    });

    it('should reject invalid slug formats', () => {
      const validator = business().slug();

      expectFailure(validator.validate('Hello-World', ctx)); // Uppercase
      expectFailure(validator.validate('hello world', ctx)); // Spaces
      expectFailure(validator.validate('hello_world', ctx)); // Underscore (default)
      expectFailure(validator.validate('hello--world', ctx)); // Consecutive hyphens
      expectFailure(validator.validate('-hello', ctx)); // Starts with hyphen
      expectFailure(validator.validate('hello-', ctx)); // Ends with hyphen
    });

    it('should allow underscores when configured', () => {
      const validator = business().slug({ allowUnderscores: true });

      expectSuccess(validator.validate('hello_world', ctx));
      expectSuccess(validator.validate('my_blog_post', ctx));
      expectFailure(validator.validate('__hello', ctx)); // Consecutive underscores
    });

    it('should validate length constraints', () => {
      const minValidator = business().slug({ minLength: 5 });
      const maxValidator = business().slug({ maxLength: 10 });

      expectSuccess(minValidator.validate('hello', ctx));
      expectSuccess(minValidator.validate('hello-world-long', ctx));
      expectFailure(minValidator.validate('hi', ctx)); // Too short

      expectSuccess(maxValidator.validate('hello', ctx));
      expectSuccess(maxValidator.validate('hello-test', ctx));
      expectFailure(maxValidator.validate('hello-world-long', ctx)); // Too long
    });

    it('should combine with other string validations', () => {
      const validator = business().slug().minLength(3).maxLength(50);

      expectSuccess(validator.validate('hello-world', ctx));
      expectFailure(validator.validate('ab', ctx)); // Too short
      expectFailure(validator.validate('a'.repeat(51), ctx)); // Too long
    });
  });

  describe('Slugify Helper Function', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('My Blog Post!')).toBe('my-blog-post');
      expect(slugify('Product #123')).toBe('product-123');
    });

    it('should handle special characters', () => {
      expect(slugify('Café au Lait')).toBe('cafe-au-lait');
      expect(slugify('Über cool')).toBe('uber-cool');
      expect(slugify('Niño & Niña')).toBe('nino-nina');
    });

    it('should use custom separator', () => {
      expect(slugify('Hello World', { separator: '_' })).toBe('hello_world');
      expect(slugify('My Blog Post', { separator: '~' })).toBe('my~blog~post');
    });

    it('should preserve case when configured', () => {
      expect(slugify('Hello World', { lowercase: false })).toBe('Hello-World');
      expect(slugify('MyBlogPost', { lowercase: false })).toBe('MyBlogPost');
    });

    it('should handle multiple spaces and consecutive separators', () => {
      expect(slugify('Hello    World')).toBe('hello-world');
      expect(slugify('Hello---World')).toBe('hello-world');
      expect(slugify('  Hello World  ')).toBe('hello-world');
    });

    it('should handle empty and whitespace strings', () => {
      expect(slugify('')).toBe('');
      expect(slugify('   ')).toBe('');
    });
  });

  describe('Chaining Business Validations', () => {
    it('should chain slug with string validations', () => {
      const validator = business().slug().minLength(5).maxLength(20);

      expectSuccess(validator.validate('hello-world', ctx));
      expectFailure(validator.validate('hi', ctx)); // Too short
      expectFailure(validator.validate('very-long-slug-name-here', ctx)); // Too long
    });

    it('should chain phone with string validations', () => {
      const validator = business().phone({ countryCode: 'US' }).notEmpty();

      expectSuccess(validator.validate('+12025551234', ctx));
      expectFailure(validator.validate('', ctx)); // Empty
    });
  });
});
