/**
 * Validation Utilities Tests
 */

import {
  createError,
  createFailureResult,
  createSuccessResult,
  mergeResults,
  prefixErrors,
} from '@utils/validation';
import { describe, expect, it } from 'vitest';

describe('Validation Utilities', () => {
  describe('createSuccessResult', () => {
    it('should create success result with data', () => {
      const result = createSuccessResult('test');

      expect(result.success).toBe(true);
      expect(result.data).toBe('test');
      expect(result.errors).toEqual([]);
    });

    it('should handle object data', () => {
      const data = { name: 'John', age: 30 };
      const result = createSuccessResult(data);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
      expect(result.errors).toEqual([]);
    });

    it('should handle undefined data', () => {
      const result = createSuccessResult(undefined);

      expect(result.success).toBe(true);
      expect(result.data).toBeUndefined();
      expect(result.errors).toEqual([]);
    });
  });

  describe('createFailureResult', () => {
    it('should create failure result with errors', () => {
      const errors = [createError('test.error', 'Test error', ['field'], undefined)];
      const result = createFailureResult(errors);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toEqual(errors);
    });

    it('should create failure result with empty errors array', () => {
      const result = createFailureResult([]);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toEqual([]);
    });

    it('should create failure result with multiple errors', () => {
      const errors = [
        createError('error.1', 'Error 1', ['field1'], undefined),
        createError('error.2', 'Error 2', ['field2'], undefined),
      ];
      const result = createFailureResult(errors);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  describe('createError', () => {
    it('should create error with all fields', () => {
      const error = createError('test.code', 'Test message', ['user', 'name'], { extra: 'data' });

      expect(error.code).toBe('test.code');
      expect(error.message).toBe('Test message');
      expect(error.path).toEqual(['user', 'name']);
      expect(error.field).toBe('name');
      expect(error.metadata).toEqual({ extra: 'data' });
    });

    it('should derive field from path', () => {
      const error = createError('test.code', 'Test message', ['a', 'b', 'c']);

      expect(error.field).toBe('c');
    });

    it('should handle empty path', () => {
      const error = createError('test.code', 'Test message', []);

      expect(error.field).toBe('');
      expect(error.path).toEqual([]);
    });

    it('should handle numeric path segments', () => {
      const error = createError('test.code', 'Test message', ['items', 0, 'name']);

      expect(error.path).toEqual(['items', 0, 'name']);
      expect(error.field).toBe('name');
    });

    it('should not include metadata if not provided', () => {
      const error = createError('test.code', 'Test message', ['field']);

      expect(error.metadata).toBeUndefined();
    });
  });

  describe('mergeResults', () => {
    it('should merge two successful results', () => {
      const first = createSuccessResult(10);
      const second = createSuccessResult(20);

      const merged = mergeResults(first, second);

      expect(merged.success).toBe(true);
      expect(merged.data).toBe(20); // Second data takes precedence
      expect(merged.errors).toEqual([]);
    });

    it('should merge success and failure', () => {
      const first = createSuccessResult(10);
      const second = createFailureResult([createError('error', 'Failed', [], undefined)]);

      const merged = mergeResults(first, second);

      expect(merged.success).toBe(false);
      expect(merged.errors).toHaveLength(1);
    });

    it('should merge two failures', () => {
      const first = createFailureResult([createError('error.1', 'Error 1', [], undefined)]);
      const second = createFailureResult([createError('error.2', 'Error 2', [], undefined)]);

      const merged = mergeResults(first, second);

      expect(merged.success).toBe(false);
      expect(merged.errors).toHaveLength(2);
    });

    it('should use second data when first is undefined', () => {
      const first = createFailureResult<number>([]);
      const second = createSuccessResult(42);

      const merged = mergeResults(first, second);

      expect(merged.data).toBe(42);
    });
  });

  describe('prefixErrors', () => {
    it('should prefix errors with string segment', () => {
      const errors = [
        createError('error', 'Test error', ['name'], undefined),
        createError('error', 'Another error', ['age'], undefined),
      ];

      const prefixed = prefixErrors(errors, 'user');

      expect(prefixed).toHaveLength(2);
      expect(prefixed[0]?.path).toEqual(['user', 'name']);
      expect(prefixed[0]?.field).toBe('user');
      expect(prefixed[1]?.path).toEqual(['user', 'age']);
      expect(prefixed[1]?.field).toBe('user');
    });

    it('should prefix errors with numeric segment', () => {
      const errors = [createError('error', 'Test error', ['item'], undefined)];

      const prefixed = prefixErrors(errors, 0);

      expect(prefixed[0]?.path).toEqual([0, 'item']);
      expect(prefixed[0]?.field).toBe('0');
    });

    it('should handle empty errors array', () => {
      const prefixed = prefixErrors([], 'prefix');

      expect(prefixed).toEqual([]);
    });

    it('should preserve all error properties', () => {
      const errors = [createError('test.code', 'Test message', ['field'], { extra: 'data' })];

      const prefixed = prefixErrors(errors, 'parent');

      expect(prefixed[0]?.code).toBe('test.code');
      expect(prefixed[0]?.message).toBe('Test message');
      expect(prefixed[0]?.metadata).toEqual({ extra: 'data' });
    });
  });
});
