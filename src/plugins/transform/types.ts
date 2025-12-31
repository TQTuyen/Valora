/**
 * Transform Plugin - Type Definitions
 * @module plugins/transform/types
 */

/**
 * Generic transformer function that converts a value from TInput to TOutput
 */
export type Transformer<TInput = unknown, TOutput = unknown> = (value: TInput) => TOutput;

/**
 * Same-type transformer that transforms a value without changing its type
 */
export type SameTypeTransformer<T> = Transformer<T, T>;

/**
 * Options for transform execution
 */
export interface TransformOptions {
  /**
   * Whether to throw errors when transformation fails
   * @default false
   */
  throwOnError?: boolean;

  /**
   * Fallback value to return when transformation fails
   */
  fallback?: unknown;

  /**
   * Callback invoked when transformation fails
   */
  onError?: (error: Error, value: unknown) => void;
}

/**
 * Metadata for a named transformer
 */
export interface TransformerMeta {
  /**
   * Unique name of the transformer (e.g., 'string.trim', 'number.round')
   */
  name: string;

  /**
   * Human-readable description of what the transformer does
   */
  description?: string;

  /**
   * Category of the transformer (e.g., 'string', 'number', 'date')
   */
  category?: string;
}

/**
 * Named transformer with metadata
 */
export interface NamedTransformer<TInput = unknown, TOutput = unknown> {
  /**
   * The transformation function
   */
  transform: Transformer<TInput, TOutput>;

  /**
   * Metadata about the transformer
   */
  meta: TransformerMeta;
}

/**
 * Transform plugin interface
 */
export interface ITransformPlugin {
  /**
   * Get a registered transform by name
   * @param name - The name of the transform (e.g., 'string.trim')
   * @returns The transformer function or undefined if not found
   */
  get(name: string): Transformer | undefined;

  /**
   * Register a custom transform
   * @param name - The name of the transform
   * @param transform - The transformer function
   * @param meta - Optional metadata
   */
  register(
    name: string,
    transform: Transformer,
    meta?: Partial<TransformerMeta>,
  ): void;

  /**
   * Apply a transform by name
   * @param name - The name of the transform
   * @param value - The value to transform
   * @param options - Optional transform options
   * @returns The transformed value
   */
  apply(name: string, value: unknown, options?: TransformOptions): unknown;

  /**
   * Get all registered transform names
   * @returns Array of transform names
   */
  list(): string[];

  /**
   * Check if a transform is registered
   * @param name - The name of the transform
   * @returns True if the transform is registered
   */
  has(name: string): boolean;

  /**
   * Unregister a transform
   * @param name - The name of the transform
   * @returns True if the transform was unregistered
   */
  unregister(name: string): boolean;
}
