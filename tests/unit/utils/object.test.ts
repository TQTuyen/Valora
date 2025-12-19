import { omit } from '@utils/object';
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
});
