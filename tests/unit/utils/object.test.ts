import { deepMerge, omit, pick } from '@utils/object';
import { describe, expect, it } from 'vitest';

describe('utils/object', () => {
  describe('omit', () => {
    it('should omit specified keys from the object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omit(obj, ['b']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should omit multiple keys', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = omit(obj, ['b', 'd']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should handle omitting keys that do not exist', () => {
      const obj = { a: 1, b: 2 };
      // @ts-expect-error Testing invalid key at runtime
      const result = omit(obj, ['c']);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should return an empty object if all keys are omitted', () => {
      const obj = { a: 1, b: 2 };
      const result = omit(obj, ['a', 'b']);
      expect(result).toEqual({});
    });

    it('should not modify the original object', () => {
      const obj = { a: 1, b: 2 };
      omit(obj, ['a']);
      expect(obj).toEqual({ a: 1, b: 2 });
    });

    it('should work with different value types', () => {
      const obj = { a: 1, b: 'string', c: true, d: { nested: true } };
      const result = omit(obj, ['b', 'c']);
      expect(result).toEqual({ a: 1, d: { nested: true } });
    });
  });

  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });

    it('should return empty object for empty keys', () => {
      const obj = { a: 1, b: 2 };
      expect(pick(obj, [])).toEqual({});
    });
  });

  describe('deepMerge', () => {
    it('should merge flat objects', () => {
      const result = deepMerge({ a: 1, b: 2 }, { b: 3 } as Partial<{ a: number; b: number }>);
      expect(result).toEqual({ a: 1, b: 3 });
    });

    it('should deeply merge nested objects', () => {
      const result = deepMerge({ a: { b: 1 } }, { a: { c: 2 } } as Partial<{ a: Record<string, unknown> }>);
      expect(result).toEqual({ a: { b: 1, c: 2 } });
    });

    it('should not override with undefined', () => {
      const result = deepMerge({ a: 1 } as Record<string, unknown>, { a: undefined });
      expect(result.a).toBe(1);
    });

    it('should overwrite with non-object source value', () => {
      const result = deepMerge({ a: { b: 1 } }, { a: 42 as unknown as { b: number } });
      expect(result.a).toBe(42);
    });
  });
});
