import { and, business, compare, file, ifThenElse, or, string } from '@validators/index';
import { describe, expect, it } from 'vitest';

describe('Custom Message Support Refactor Verification', () => {
  describe('Comparison Validators', () => {
    it('should support custom message in equalTo', () => {
      const v = compare().equalTo('target', { message: 'Custom equalTo' });
      const result = v.validate('wrong');
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toBe('Custom equalTo');
    });

    it('should support custom message in between', () => {
      const v = compare().between(1, 10, { message: 'Custom between' });
      const result = v.validate(15);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toBe('Custom between');
    });

    it('should support custom message in oneOf', () => {
      const v = compare().oneOf(['a', 'b'], { message: 'Custom oneOf' });
      const result = v.validate('c');
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toBe('Custom oneOf');
    });
  });

  describe('Logic Validators', () => {
    it('should support custom message in and combinator', () => {
      const v = and(string().minLength(5), string().startsWith('A'), { message: 'Custom and' });
      const result = v.validate('B'); // Fails both
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toBe('Custom and');
    });

    it('should support custom message in or combinator', () => {
      const v = or(string().minLength(10), string().startsWith('A'), { message: 'Custom or' });
      const result = v.validate('B'); // Fails both
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toBe('Custom or');
    });

    it('should support custom message in ifThenElse', () => {
      const v = ifThenElse(
        string().startsWith('A'),
        string().minLength(10),
        string().minLength(5),
        { message: 'Custom ifThenElse' },
      );
      const result = v.validate('ABC'); // Satisfies IF, fails THEN
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toBe('Custom ifThenElse');
    });
  });

  describe('Business Validators', () => {
    it('should support custom message in creditCard', () => {
      const v = business().creditCard(undefined, { message: 'Custom CC' });
      const result = v.validate('invalid');
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toBe('Custom CC');
    });

    it('should support custom message in phone', () => {
      const v = business().phone({ countryCode: 'US' }, { message: 'Custom Phone' });
      const result = v.validate('invalid');
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toBe('Custom Phone');
    });

    it('should support custom message in iban', () => {
      const v = business().iban(undefined, { message: 'Custom IBAN' });
      const result = v.validate('invalid');
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toBe('Custom IBAN');
    });
  });

  describe('File Validators', () => {
    it('should support custom message in mimeType', () => {
      const v = file().mimeType(['image/jpeg'], { message: 'Custom Mime' });
      const result = v.validate({ type: 'application/pdf', size: 100 });
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toBe('Custom Mime');
    });

    it('should support custom message in extension', () => {
      const v = file().extension(['jpg'], { message: 'Custom Ext' });
      const result = v.validate({ type: 'image/png', size: 100, name: 'file.png' });
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toBe('Custom Ext');
    });

    it('should support custom message in maxSize', () => {
      const v = file().maxSize(100, { message: 'Custom MaxSize' });
      const result = v.validate({ type: 'text/plain', size: 200 });
      expect(result.success).toBe(false);
      expect(result.errors[0]?.message).toBe('Custom MaxSize');
    });
  });
});
