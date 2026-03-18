/**
 * Boolean Validator Tests
 */

import { boolean } from '@validators/boolean';
import { describe, it } from 'vitest';

import { createContext, expectFailure, expectSuccess } from '../../helpers/test-utils';

describe('Boolean Validator', () => {
  const ctx = createContext();

  describe('Basic Boolean Validation', () => {
    it('should validate boolean values', () => {
      const validator = boolean();

      expectSuccess(validator.validate(true, ctx), true);
      expectSuccess(validator.validate(false, ctx), false);
    });

    it('should reject non-boolean values', () => {
      const validator = boolean();

      expectFailure(validator.validate('true' as unknown as boolean, ctx));
      expectFailure(validator.validate(1 as unknown as boolean, ctx));
      expectFailure(validator.validate(0 as unknown as boolean, ctx));
      expectFailure(validator.validate(null as unknown as boolean, ctx));
      expectFailure(validator.validate(undefined as unknown as boolean, ctx));
    });
  });

  describe('isTrue Validation', () => {
    it('should validate true values', () => {
      const validator = boolean().isTrue();

      expectSuccess(validator.validate(true, ctx));
      expectFailure(validator.validate(false, ctx));
    });
  });

  describe('isFalse Validation', () => {
    it('should validate false values', () => {
      const validator = boolean().isFalse();

      expectSuccess(validator.validate(false, ctx));
      expectFailure(validator.validate(true, ctx));
    });
  });

  describe('Optional and Nullable', () => {
    it('should handle optional booleans', () => {
      const validator = boolean().optional();

      expectSuccess(validator.validate(undefined, ctx));
      expectSuccess(validator.validate(true, ctx));
      expectSuccess(validator.validate(false, ctx));
    });

    it('should handle nullable booleans', () => {
      const validator = boolean().nullable();

      expectSuccess(validator.validate(null, ctx));
      expectSuccess(validator.validate(true, ctx));
      expectSuccess(validator.validate(false, ctx));
    });
  });

  describe('Transform', () => {
    it('should transform boolean values', () => {
      const validator = boolean().transform((val) => (val ? 'yes' : 'no'));

      const result1 = validator.validate(true, ctx);
      expectSuccess(result1, 'yes');

      const result2 = validator.validate(false, ctx);
      expectSuccess(result2, 'no');
    });
  });

  describe('Default Values', () => {
    it('should provide default value for undefined', () => {
      const validator = boolean().default(false);

      expectSuccess(validator.validate(undefined, ctx), false);
      expectSuccess(validator.validate(null, ctx), false);
      expectSuccess(validator.validate(true, ctx), true);
    });
  });

  describe('Alias methods and clone with customMessage', () => {
    it('true() is alias for isTrue()', () => {
      const validator = boolean().true();
      expectSuccess(validator.validate(true, ctx), true);
    });

    it('false() is alias for isFalse()', () => {
      const validator = boolean().false();
      expectSuccess(validator.validate(false, ctx), false);
    });

    it('clone preserves customMessage', () => {
      // withMessage sets customMessage and returns MessageDecorator
      // To test clone with customMessage, use the internal clone via addStrategy
      const validator = boolean();
      // @ts-expect-error: accessing protected field for testing
      validator.customMessage = 'custom msg';
      // addStrategy calls clone() which should copy customMessage
      const cloned = validator.isTrue();
      // @ts-expect-error: accessing protected field for testing
      expect(cloned.customMessage).toBe('custom msg');
    });
  });
});
