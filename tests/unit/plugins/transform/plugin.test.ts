/**
 * Transform Plugin Core Unit Tests
 * Tests the TransformPlugin class functionality
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { createTransformPlugin, TransformPlugin } from '@/plugins/transform/plugin';

import type { Transformer } from '@/plugins/transform/types';

describe('TransformPlugin', () => {
  let plugin: TransformPlugin;

  beforeEach(() => {
    "@typescript-eslint/eslint
    plugin = new TransformPlugin({ loadBuiltIns: false });
  });

  describe('constructor', () => {
    it('should create instance with default config', () => {
      const instance = new TransformPlugin();
      expect(instance).toBeInstanceOf(TransformPlugin);
    });

    it('should load built-in transforms when configured', () => {
      const instance = new TransformPlugin({ loadBuiltIns: true });
      const transforms = instance.list();

      expect(transforms.length).toBeGreaterThan(0);
      expect(transforms).toContain('string.toLowerCase');
      expect(transforms).toContain('number.round');
      expect(transforms).toContain('array.unique');
    });

    it('should not load built-in transforms when disabled', () => {
      const instance = new TransformPlugin({ loadBuiltIns: false });
      const transforms = instance.list();

      expect(transforms.length).toBe(0);
    });

    it('should register custom transforms from config', () => {
      const customTransform: Transformer = (value: unknown) => `custom_${value as string}`;

      const instance = new TransformPlugin({
        loadBuiltIns: false,
        customTransforms: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'test.custom': {
            transform: customTransform,
            meta: { name: 'test.custom', category: 'test' },
          },
        },
      });

      expect(instance.has('test.custom')).toBe(true);
      expect(instance.apply('test.custom', 'value')).toBe('custom_value');
    });
  });

  describe('register()', () => {
    it('should register a new transform', () => {
      const transform: Transformer = (value: unknown) => (value as string).toUpperCase();

      plugin.register('test.upper', transform);

      expect(plugin.has('test.upper')).toBe(true);
    });

    it('should register transform with metadata', () => {
      const transform: Transformer = (value: unknown) => value;

      plugin.register('test.identity', transform, {
        description: 'Identity transform',
        category: 'test',
      });

      expect(plugin.has('test.identity')).toBe(true);
    });

    it('should allow overwriting existing transform', () => {
      const transform1: Transformer = () => 'first';
      const transform2: Transformer = () => 'second';

      plugin.register('test.overwrite', transform1);
      plugin.register('test.overwrite', transform2);

      expect(plugin.apply('test.overwrite', 'any')).toBe('second');
    });

    it('should register multiple transforms', () => {
      plugin.register('test.one', (v: unknown) => v);
      plugin.register('test.two', (v: unknown) => v);
      plugin.register('test.three', (v: unknown) => v);

      expect(plugin.list()).toEqual(['test.one', 'test.two', 'test.three']);
    });
  });

  describe('get()', () => {
    it('should return registered transform', () => {
      const transform: Transformer = (value: unknown) => value;
      plugin.register('test.get', transform);

      const retrieved = plugin.get('test.get');

      expect(retrieved).toBe(transform);
    });

    it('should return undefined for non-existent transform', () => {
      const retrieved = plugin.get('non.existent');

      expect(retrieved).toBeUndefined();
    });

    it('should return correct transform after registration', () => {
      const transform: Transformer = (value: unknown) => (value as number) * 2;
      plugin.register('test.double', transform);

      const retrieved = plugin.get('test.double');

      expect(retrieved).toBeDefined();
      expect(retrieved?.(5)).toBe(10);
    });
  });

  describe('apply()', () => {
    it('should apply registered transform', () => {
      plugin.register('test.reverse', (value: unknown) =>
        (value as string).split('').reverse().join(''),
      );

      const result = plugin.apply('test.reverse', 'hello');

      expect(result).toBe('olleh');
    });

    it('should return value when transform not found', () => {
      const result = plugin.apply('non.existent', 'value');

      expect(result).toBe('value');
    });

    it('should use fallback when transform not found', () => {
      const result = plugin.apply('non.existent', 'value', {
        fallback: 'default',
      });

      expect(result).toBe('default');
    });

    it('should throw when throwOnError is true and transform not found', () => {
      expect(() => {
        plugin.apply('non.existent', 'value', { throwOnError: true });
      }).toThrow('Transform not found: non.existent');
    });

    it('should call onError callback when transform not found', () => {
      let errorCalled = false;
      let capturedError: Error | null = null;

      plugin.apply('non.existent', 'value', {
        onError: (error) => {
          errorCalled = true;
          capturedError = error;
        },
      });

      expect(errorCalled).toBe(true);
      expect(capturedError).toBeInstanceOf(Error);
      expect((capturedError as any)?.message).toBe('Transform not found: non.existent');
    });

    it('should handle transform errors gracefully', () => {
      plugin.register('test.throw', () => {
        throw new Error('Transform error');
      });

      const result = plugin.apply('test.throw', 'value');

      expect(result).toBe('value'); // Returns original value
    });

    it('should use fallback when transform throws', () => {
      plugin.register('test.throw', () => {
        throw new Error('Transform error');
      });

      const result = plugin.apply('test.throw', 'value', {
        fallback: 'fallback',
      });

      expect(result).toBe('fallback');
    });

    it('should throw when transform fails and throwOnError is true', () => {
      plugin.register('test.throw', () => {
        throw new Error('Transform error');
      });

      expect(() => {
        plugin.apply('test.throw', 'value', { throwOnError: true });
      }).toThrow('Transform error');
    });

    it('should call onError when transform throws', () => {
      let errorCalled = false;

      plugin.register('test.throw', () => {
        throw new Error('Transform error');
      });

      plugin.apply('test.throw', 'value', {
        onError: () => {
          errorCalled = true;
        },
      });

      expect(errorCalled).toBe(true);
    });

    it('should apply complex transformations', () => {
      plugin.register('test.complex', (value: unknown) => {
        const str = value as string;
        return str.trim().toLowerCase().split(' ').join('-');
      });

      const result = plugin.apply('test.complex', '  Hello World  ');

      expect(result).toBe('hello-world');
    });
  });

  describe('list()', () => {
    it('should return empty array when no transforms registered', () => {
      expect(plugin.list()).toEqual([]);
    });

    it('should return all registered transform names', () => {
      plugin.register('test.one', (v: unknown) => v);
      plugin.register('test.two', (v: unknown) => v);
      plugin.register('test.three', (v: unknown) => v);

      const list = plugin.list();

      expect(list).toHaveLength(3);
      expect(list).toContain('test.one');
      expect(list).toContain('test.two');
      expect(list).toContain('test.three');
    });

    it('should return updated list after registration', () => {
      expect(plugin.list()).toHaveLength(0);

      plugin.register('test.new', (v: unknown) => v);

      expect(plugin.list()).toHaveLength(1);
      expect(plugin.list()).toContain('test.new');
    });

    it('should include built-in transforms when loaded', () => {
      const instance = new TransformPlugin({ loadBuiltIns: true });
      const list = instance.list();

      expect(list.length).toBeGreaterThan(50); // Should have many built-in transforms
    });
  });

  describe('has()', () => {
    it('should return false for non-existent transform', () => {
      expect(plugin.has('non.existent')).toBe(false);
    });

    it('should return true for registered transform', () => {
      plugin.register('test.exists', (v: unknown) => v);

      expect(plugin.has('test.exists')).toBe(true);
    });

    it('should return false after unregistering', () => {
      plugin.register('test.temp', (v: unknown) => v);
      expect(plugin.has('test.temp')).toBe(true);

      plugin.unregister('test.temp');
      expect(plugin.has('test.temp')).toBe(false);
    });

    it('should check built-in transforms correctly', () => {
      const instance = new TransformPlugin({ loadBuiltIns: true });

      expect(instance.has('string.toLowerCase')).toBe(true);
      expect(instance.has('string.nonExistent')).toBe(false);
    });
  });

  describe('unregister()', () => {
    it('should remove registered transform', () => {
      plugin.register('test.remove', (v: unknown) => v);
      expect(plugin.has('test.remove')).toBe(true);

      const removed = plugin.unregister('test.remove');

      expect(removed).toBe(true);
      expect(plugin.has('test.remove')).toBe(false);
    });

    it('should return false for non-existent transform', () => {
      const removed = plugin.unregister('non.existent');

      expect(removed).toBe(false);
    });

    it('should not affect other transforms', () => {
      plugin.register('test.one', (v: unknown) => v);
      plugin.register('test.two', (v: unknown) => v);
      plugin.register('test.three', (v: unknown) => v);

      plugin.unregister('test.two');

      expect(plugin.has('test.one')).toBe(true);
      expect(plugin.has('test.two')).toBe(false);
      expect(plugin.has('test.three')).toBe(true);
    });

    it('should allow re-registration after unregister', () => {
      plugin.register('test.reregister', () => 'first');
      plugin.unregister('test.reregister');
      plugin.register('test.reregister', () => 'second');

      expect(plugin.apply('test.reregister', 'any')).toBe('second');
    });
  });

  describe('Built-in transforms', () => {
    let builtInPlugin: TransformPlugin;

    beforeEach(() => {
      builtInPlugin = new TransformPlugin({ loadBuiltIns: true });
    });

    it('should have string transforms', () => {
      expect(builtInPlugin.has('string.toLowerCase')).toBe(true);
      expect(builtInPlugin.has('string.toUpperCase')).toBe(true);
      expect(builtInPlugin.has('string.trim')).toBe(true);
    });

    it('should have number transforms', () => {
      expect(builtInPlugin.has('number.round')).toBe(true);
      expect(builtInPlugin.has('number.abs')).toBe(true);
      expect(builtInPlugin.has('number.floor')).toBe(true);
    });

    it('should have array transforms', () => {
      expect(builtInPlugin.has('array.unique')).toBe(true);
      expect(builtInPlugin.has('array.reverse')).toBe(true);
      expect(builtInPlugin.has('array.flatten')).toBe(true);
    });

    it('should have object transforms', () => {
      expect(builtInPlugin.has('object.freeze')).toBe(true);
      expect(builtInPlugin.has('object.seal')).toBe(true);
    });

    it('should have date transforms', () => {
      expect(builtInPlugin.has('date.toISOString')).toBe(true);
    });

    it('should apply string transform correctly', () => {
      const result = builtInPlugin.apply('string.toLowerCase', 'HELLO');

      expect(result).toBe('hello');
    });

    it('should apply number transform correctly', () => {
      const result = builtInPlugin.apply('number.round', 3.7);

      expect(result).toBe(4);
    });
  });

  describe('createTransformPlugin factory', () => {
    it('should create TransformPlugin instance', () => {
      const instance = createTransformPlugin();

      expect(instance).toBeInstanceOf(TransformPlugin);
    });

    it('should pass config to constructor', () => {
      const instance = createTransformPlugin({ loadBuiltIns: false });

      expect(instance.list()).toHaveLength(0);
    });

    it('should create instance with built-ins', () => {
      const instance = createTransformPlugin({ loadBuiltIns: true });

      expect(instance.list().length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined values', () => {
      plugin.register('test.identity', (v: unknown) => v);

      const result = plugin.apply('test.identity', undefined);

      expect(result).toBeUndefined();
    });

    it('should handle null values', () => {
      plugin.register('test.identity', (v: unknown) => v);

      const result = plugin.apply('test.identity', null);

      expect(result).toBeNull();
    });

    it('should handle empty string', () => {
      plugin.register('test.length', (v: unknown) => (v as string).length);

      const result = plugin.apply('test.length', '');

      expect(result).toBe(0);
    });

    it('should handle complex objects', () => {
      plugin.register('test.clone', (v: unknown) => ({ ...(v as object) }));

      const obj = { a: 1, b: 2 };
      const result = plugin.apply('test.clone', obj) as { a: number; b: number };

      expect(result).toEqual(obj);
      expect(result).not.toBe(obj); // Should be different reference
    });

    it('should handle arrays', () => {
      plugin.register('test.double', (v: unknown) => (v as number[]).map((n) => n * 2));

      const result = plugin.apply('test.double', [1, 2, 3]);

      expect(result).toEqual([2, 4, 6]);
    });

    it('should handle multiple transform applications', () => {
      plugin.register('test.increment', (v: unknown) => (v as number) + 1);

      let result = 0;
      result = plugin.apply('test.increment', result) as number;
      result = plugin.apply('test.increment', result) as number;
      result = plugin.apply('test.increment', result) as number;

      expect(result).toBe(3);
    });

    it('should handle error in custom transform', () => {
      plugin.register('test.divideByZero', () => {
        const result = 1 / 0;
        if (!Number.isFinite(result)) {
          throw new Error('Division by zero');
        }
        return result;
      });

      const result = plugin.apply('test.divideByZero', 10, {
        fallback: 0,
      });

      expect(result).toBe(0);
    });
  });
});
