/**
 * Global transform plugin and helper tests
 */

import { describe, expect, it, beforeEach } from 'vitest';
import {
  getTransformPlugin,
  configureTransform,
  resetTransformPlugin,
  globalTransform,
} from '@plugins/transform/global';
import { transform } from '@plugins/transform/helper';
import { string } from '@validators/string';
import { number } from '@validators/number';

describe('getTransformPlugin', () => {
  beforeEach(() => {
    resetTransformPlugin();
  });

  it('should return a TransformPlugin instance', () => {
    const plugin = getTransformPlugin();
    expect(plugin).toBeDefined();
    expect(typeof plugin.apply).toBe('function');
  });

  it('should return the same instance on repeated calls', () => {
    const a = getTransformPlugin();
    const b = getTransformPlugin();
    expect(a).toBe(b);
  });
});

describe('configureTransform', () => {
  beforeEach(() => {
    resetTransformPlugin();
  });

  it('should configure and return a new plugin', () => {
    const plugin = configureTransform({ loadBuiltIns: false });
    expect(plugin.list()).toHaveLength(0);
  });

  it('should replace existing instance', () => {
    const a = getTransformPlugin();
    const b = configureTransform({ loadBuiltIns: false });
    expect(a).not.toBe(b);
    expect(getTransformPlugin()).toBe(b);
  });
});

describe('resetTransformPlugin', () => {
  it('should reset so next call creates a fresh instance', () => {
    const a = getTransformPlugin();
    resetTransformPlugin();
    const b = getTransformPlugin();
    expect(a).not.toBe(b);
  });
});

describe('globalTransform proxy', () => {
  beforeEach(() => {
    resetTransformPlugin();
  });

  it('should delegate method calls to the plugin instance', () => {
    // `list` method exists on TransformPlugin
    const result = globalTransform.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return non-function property value directly (not bound)', () => {
    // Access a property that is not a function — covers the `else` branch
    // in the proxy get handler (returns value directly without .bind())
    const proxy = globalTransform as unknown as Record<string, unknown>;
    const value = proxy['nonExistentProp'];
    // Non-existent property → undefined, not a function
    expect(value).toBeUndefined();
  });
});

describe('transform helper', () => {
  it('should apply single transformer to validator output', () => {
    const v = transform(string(), (s: string) => s.toUpperCase());
    const result = v.validate('hello');
    expect(result.success).toBe(true);
    expect(result.data).toBe('HELLO');
  });

  it('should chain multiple transformers', () => {
    const v = transform(
      number(),
      (n: number) => n * 2,
      (n: number) => n + 1,
    );
    const result = v.validate(5);
    expect(result.success).toBe(true);
    expect(result.data).toBe(11); // 5*2=10, 10+1=11
  });

  it('should return original validator when no transformers provided', () => {
    const validator = string();
    const v = transform(validator);
    expect(v).toBe(validator);
  });
});
