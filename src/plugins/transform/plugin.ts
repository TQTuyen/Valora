/**
 * Transform Plugin
 * Provides transform orchestration and composition capabilities
 * @module plugins/transform
 */

import { mergeConfig } from './config';
import { arrayTransforms } from './transforms/array';
import { dateTransforms } from './transforms/date';
import { numberTransforms } from './transforms/number';
import { objectTransforms } from './transforms/object';
import { stringTransforms } from './transforms/string';

import type { TransformConfig } from './config';
import type {
  ITransformPlugin,
  NamedTransformer,
  Transformer,
  TransformerMeta,
  TransformOptions,
} from './types';

/**
 * Transform plugin implementation
 */
export class TransformPlugin implements ITransformPlugin {
  private readonly config: TransformConfig;
  private readonly transforms: Map<string, NamedTransformer> = new Map();

  constructor(config: Partial<TransformConfig> = {}) {
    this.config = mergeConfig(config);

    // Load built-in transforms
    if (this.config.loadBuiltIns) {
      this.loadBuiltInTransforms();
    }

    // Register custom transforms
    if (this.config.customTransforms) {
      Object.entries(this.config.customTransforms).forEach(([name, namedTransformer]) => {
        this.transforms.set(name, namedTransformer);
      });
    }

    this.log('Transform plugin initialized', {
      builtIns: this.config.loadBuiltIns,
      customCount: this.config.customTransforms
        ? Object.keys(this.config.customTransforms).length
        : 0,
      total: this.transforms.size,
    });
  }

  /**
   * Get a registered transform by name
   */
  get(name: string): Transformer | undefined {
    const namedTransformer = this.transforms.get(name);
    return namedTransformer?.transform;
  }

  /**
   * Register a custom transform
   */
  register(name: string, transform: Transformer, meta?: Partial<TransformerMeta>): void {
    if (this.has(name)) {
      this.log(`Overwriting existing transform: ${name}`, { level: 'warn' });
    }

    const namedTransformer: NamedTransformer = {
      transform,
      meta: {
        name,
        ...(meta?.description && { description: meta.description }),
        ...(meta?.category && { category: meta.category }),
      },
    };

    this.transforms.set(name, namedTransformer);
    this.log(`Registered transform: ${name}`, meta);
  }

  /**
   * Apply a transform by name
   */
  apply(name: string, value: unknown, options?: TransformOptions): unknown {
    const transform = this.get(name);

    if (!transform) {
      const error = new Error(`Transform not found: ${name}`);
      return this.handleError(error, value, options);
    }

    try {
      return transform(value);
    } catch (error) {
      return this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        value,
        options,
      );
    }
  }

  /**
   * Get all registered transform names
   */
  list(): string[] {
    return Array.from(this.transforms.keys());
  }

  /**
   * Check if a transform is registered
   */
  has(name: string): boolean {
    return this.transforms.has(name);
  }

  /**
   * Unregister a transform
   */
  unregister(name: string): boolean {
    return this.transforms.delete(name);
  }

  /**
   * Load all built-in transforms
   */
  private loadBuiltInTransforms(): void {
    // String transforms
    Object.entries(stringTransforms).forEach(([key, transform]) => {
      this.transforms.set(`string.${key}`, {
        transform: transform as Transformer,
        meta: { name: `string.${key}`, category: 'string' },
      });
    });

    // Number transforms
    Object.entries(numberTransforms).forEach(([key, transform]) => {
      this.transforms.set(`number.${key}`, {
        transform: transform as Transformer,
        meta: { name: `number.${key}`, category: 'number' },
      });
    });

    // Date transforms
    Object.entries(dateTransforms).forEach(([key, transform]) => {
      this.transforms.set(`date.${key}`, {
        transform: transform as Transformer,
        meta: { name: `date.${key}`, category: 'date' },
      });
    });

    // Object transforms
    Object.entries(objectTransforms).forEach(([key, transform]) => {
      this.transforms.set(`object.${key}`, {
        transform: transform as Transformer,
        meta: { name: `object.${key}`, category: 'object' },
      });
    });

    // Array transforms
    Object.entries(arrayTransforms).forEach(([key, transform]) => {
      this.transforms.set(`array.${key}`, {
        transform: transform as Transformer,
        meta: { name: `array.${key}`, category: 'array' },
      });
    });
  }

  /**
   * Handle transform errors
   */
  private handleError(error: Error, value: unknown, options?: TransformOptions): unknown {
    if (options?.onError) {
      options.onError(error, value);
    }

    if (options?.throwOnError) {
      throw error;
    }

    return options?.fallback ?? value;
  }

  /**
   * Debug logging
   */
  private log(message: string, data?: unknown): void {
    if (this.config.debug) {
      console.info(`[TransformPlugin] ${message}`, data ?? '');
    }
  }
}

/**
 * Factory function to create a new Transform Plugin instance
 */
export function createTransformPlugin(config?: Partial<TransformConfig>): TransformPlugin {
  return new TransformPlugin(config);
}
