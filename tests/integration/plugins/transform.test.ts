/**
 * Transform Plugin Integration Tests
 * Tests transform plugin integration with validators
 */

import { describe, expect, it } from 'vitest';

import {
  arrayTransforms,
  getTransformPlugin,
  numberTransforms,
  objectTransforms,
  pipe,
  stringTransforms,
} from '@/plugins/transform';
import { array, number, object, string } from '@/validators';

describe('Transform Plugin Integration', () => {
  describe('String validator integration', () => {
    it('should transform email to lowercase using pipe', () => {
      const emailValidator = string()
        .email()
        .transform(stringTransforms.toLowerCase);

      const result = emailValidator.validate('USER@EXAMPLE.COM');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('user@example.com');
      }
    });

    it('should create URL slug from string', () => {
      const slugValidator = string().transform(stringTransforms.slug);

      const result = slugValidator.validate('Hello World! @#$');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('hello-world');
      }
    });

    it('should chain multiple string transforms', () => {
      const normalizeValidator = string().transform((s: string) =>
        pipe(
          stringTransforms.trim,
          stringTransforms.toLowerCase,
          stringTransforms.removeNonAlphanumeric,
        )(s),
      );

      const result = normalizeValidator.validate('  Hello World! 123  ');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('helloworld123');
      }
    });
  });

  describe('Number validator integration', () => {
    it('should clamp number within range', () => {
      const ageValidator = number().transform(numberTransforms.clamp(0, 120));

      const result1 = ageValidator.validate(-5);
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(result1.data).toBe(0);
      }

      const result2 = ageValidator.validate(150);
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(result2.data).toBe(120);
      }
    });

    it('should round and format number', () => {
      const priceValidator = number().transform((n: number) =>
        pipe(numberTransforms.round, numberTransforms.max(100))(n),
      );

      const result = priceValidator.validate(123.456);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(100);
      }
    });
  });

  describe('Array validator integration', () => {
    it('should remove duplicates and sort array', () => {
      const tagsValidator = array().of(string()).transform((arr: unknown[]) => {
        const unique = arrayTransforms.unique(arr);
        const sorted = arrayTransforms.sort()(unique);
        return sorted;
      });

      const result = tagsValidator.validate(['banana', 'apple', 'banana', 'cherry']);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(['apple', 'banana', 'cherry']);
      }
    });

    it('should take first 5 items from array', () => {
      const topFiveValidator = array().of(number()).transform((arr: unknown[]) => {
        return arrayTransforms.take(5)(arr);
      });

      const result = topFiveValidator.validate([1, 2, 3, 4, 5, 6, 7, 8]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([1, 2, 3, 4, 5]);
      }
    });
  });

  describe('Object validator integration', () => {
    it('should pick specific fields from object', () => {
      const userValidator = object({
        name: string(),
        email: string(),
        age: number(),
      }).transform(objectTransforms.pick(['name', 'email']));

      const result = userValidator.validate({
        name: 'John',
        email: 'john@example.com',
        age: 30,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          name: 'John',
          email: 'john@example.com',
        });
      }
    });

    it('should merge additional values', () => {
      const configValidator = object({
        host: string(),
        port: number(),
      }).transform((data: { host: string; port: number }) => ({
        ...data,
        env: 'production' as const,
      }));

      const result = configValidator.validate({
        host: 'localhost',
        port: 3000,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          host: 'localhost',
          port: 3000,
          env: 'production',
        });
      }
    });
  });

  describe('Date validator integration', () => {
    it('should format date to ISO string', () => {
      const dateValidator = string().transform((s: string) => {
        const date = new Date(s);
        const parts = date.toISOString().split('T');
        return parts[0] ?? '';
      });

      const result = dateValidator.validate('2024-01-15T10:30:00.000Z');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('2024-01-15');
      }
    });
  });

  describe('Plugin registry', () => {
    it('should register and apply custom transform', () => {
      const plugin = getTransformPlugin();

      // Register custom hash transform
      plugin.register('test.hash', (value: unknown) => `${value as string}_hashed`);

      const result = plugin.apply('test.hash', 'secret') as string;

      expect(result).toBe('secret_hashed');
    });

    it('should list all registered transforms', () => {
      const plugin = getTransformPlugin();

      const transforms = plugin.list();

      expect(transforms).toContain('test.hash'); // From previous test
    });
  });

  describe('Complex composition', () => {
    it('should compose multiple transforms across different types', () => {
      // Validate email, then extract domain and lowercase
      const domainExtractor = string()
        .email()
        .transform((email: string) => pipe(
          stringTransforms.toLowerCase,
          (s: string) => s.split('@')[1] ?? '',
        )(email));

      const result = domainExtractor.validate('USER@EXAMPLE.COM');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('example.com');
      }
    });

    it('should handle transform errors gracefully', () => {
      const divideValidator = number().transform(numberTransforms.divide(0));

      const result = divideValidator.validate(10);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]?.code).toBe('common.transform');
      }
    });
  });
});
