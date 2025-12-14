/**
 * Object Validator
 * @module validators/object/validator
 */

import { BaseValidator } from '@validators/common/index';

import {
  MaxKeysStrategy,
  MinKeysStrategy,
  OmitStrategy,
  PartialStrategy,
  PassthroughStrategy,
  PickStrategy,
  ShapeStrategy,
  StrictStrategy,
  StripStrategy,
} from './strategies';

import type { ObjectSchema } from './strategies';
import type { IValidator, ValidationContext, ValidationResult } from '#types/index';

/**
 * Object validator with fluent API (Composite Pattern)
 *
 * @example
 * ```typescript
 * const userValidator = new ObjectValidator({
 *   name: string().required().minLength(2),
 *   email: string().required().email(),
 *   age: number().optional().min(0),
 * });
 *
 * const result = userValidator.validate({ name: 'John', email: 'john@example.com' });
 * ```
 */
export class ObjectValidator<T extends Record<string, unknown>> extends BaseValidator<unknown, T> {
  readonly _type = 'object';
  private schema: ObjectSchema<T>;
  private strictMode = false;
  private stripMode = false;

  constructor(schema: ObjectSchema<T> = {} as ObjectSchema<T>) {
    super();
    this.schema = schema;
    if (Object.keys(schema).length > 0) {
      this.strategies.push(new ShapeStrategy(schema) as never);
    }
  }

  protected clone(): ObjectValidator<T> {
    const cloned = new ObjectValidator<T>({} as ObjectSchema<T>);
    cloned.schema = { ...this.schema };
    cloned.strategies = [...this.strategies];
    cloned.isRequired = this.isRequired;
    if (this.customMessage !== undefined) {
      cloned.customMessage = this.customMessage;
    }
    cloned.strictMode = this.strictMode;
    cloned.stripMode = this.stripMode;
    return cloned;
  }

  protected override checkType(value: unknown, context: ValidationContext): ValidationResult<T> {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      return this.fail('object.type', context);
    }
    return this.succeed(value as T, context);
  }

  // -------------------------------------------------------------------------
  // Schema Definition
  // -------------------------------------------------------------------------

  /**
   * Define the object shape/schema
   * @param schema - Object schema definition
   */
  shape<S extends Record<string, unknown>>(schema: ObjectSchema<S>): ObjectValidator<S> {
    const cloned = new ObjectValidator<S>(schema);
    cloned.isRequired = this.isRequired;
    if (this.customMessage !== undefined) {
      cloned.customMessage = this.customMessage;
    }
    return cloned;
  }

  /**
   * Extend the schema with additional fields
   * @param extension - Additional schema fields
   */
  extend<E extends Record<string, unknown>>(extension: ObjectSchema<E>): ObjectValidator<T & E> {
    const newSchema = { ...this.schema, ...extension } as ObjectSchema<T & E>;
    const cloned = new ObjectValidator<T & E>(newSchema);
    cloned.isRequired = this.isRequired;
    if (this.customMessage !== undefined) {
      cloned.customMessage = this.customMessage;
    }
    cloned.strictMode = this.strictMode;
    cloned.stripMode = this.stripMode;
    return cloned;
  }

  /**
   * Merge with another object validator
   * @param other - Another object validator to merge with
   */
  merge<O extends Record<string, unknown>>(other: ObjectValidator<O>): ObjectValidator<T & O> {
    return this.extend(other.getSchema());
  }

  /**
   * Get the current schema
   */
  getSchema(): ObjectSchema<T> {
    return this.schema;
  }

  // -------------------------------------------------------------------------
  // Schema Modifiers
  // -------------------------------------------------------------------------

  /**
   * Make all fields optional (Partial<T>)
   */
  partial(): ObjectValidator<Partial<T>> {
    const partialSchema: ObjectSchema<Partial<T>> = {} as ObjectSchema<Partial<T>>;
    for (const [key, validator] of Object.entries(this.schema)) {
      // Create optional version of each validator
      const optionalValidator = validator as IValidator<unknown, unknown>;
      (partialSchema as Record<string, unknown>)[key] = optionalValidator;
    }
    const cloned = new ObjectValidator<Partial<T>>(partialSchema);
    cloned.strategies.push(new PartialStrategy() as never);
    cloned.isRequired = this.isRequired;
    if (this.customMessage !== undefined) {
      cloned.customMessage = this.customMessage;
    }
    return cloned;
  }

  /**
   * Pick specific keys from the schema
   * @param keys - Keys to pick
   */
  pick<K extends keyof T>(...keys: K[]): ObjectValidator<Pick<T, K>> {
    const pickedSchema: ObjectSchema<Pick<T, K>> = {} as ObjectSchema<Pick<T, K>>;
    for (const key of keys) {
      if (key in this.schema) {
        (pickedSchema as Record<string, unknown>)[key as string] = this.schema[key];
      }
    }
    const cloned = new ObjectValidator<Pick<T, K>>(pickedSchema);
    cloned.strategies.push(new PickStrategy(keys.map(String)) as never);
    cloned.isRequired = this.isRequired;
    if (this.customMessage !== undefined) {
      cloned.customMessage = this.customMessage;
    }
    return cloned;
  }

  /**
   * Omit specific keys from the schema
   * @param keys - Keys to omit
   */
  omit<K extends keyof T>(...keys: K[]): ObjectValidator<Omit<T, K>> {
    const keysSet = new Set(keys.map(String));
    const omittedSchema: ObjectSchema<Omit<T, K>> = {} as ObjectSchema<Omit<T, K>>;
    for (const [key, validator] of Object.entries(this.schema)) {
      if (!keysSet.has(key)) {
        (omittedSchema as Record<string, unknown>)[key] = validator;
      }
    }
    const cloned = new ObjectValidator<Omit<T, K>>(omittedSchema);
    cloned.strategies.push(new OmitStrategy(keys.map(String)) as never);
    cloned.isRequired = this.isRequired;
    if (this.customMessage !== undefined) {
      cloned.customMessage = this.customMessage;
    }
    return cloned;
  }

  // -------------------------------------------------------------------------
  // Extra Keys Handling
  // -------------------------------------------------------------------------

  /**
   * Strict mode - no extra keys allowed (fail if unknown keys present)
   */
  strict(): this {
    const cloned = this.clone() as this;
    cloned.strictMode = true;
    cloned.stripMode = false;
    cloned.strategies.push(new StrictStrategy(this.schema) as never);
    return cloned;
  }

  /**
   * Passthrough mode - allow and preserve extra keys
   */
  passthrough(): this {
    const cloned = this.clone() as this;
    cloned.strictMode = false;
    cloned.stripMode = false;
    cloned.strategies.push(new PassthroughStrategy() as never);
    return cloned;
  }

  /**
   * Strip mode - remove extra keys from result
   */
  strip(): this {
    const cloned = this.clone() as this;
    cloned.strictMode = false;
    cloned.stripMode = true;
    cloned.strategies.push(new StripStrategy(this.schema) as never);
    return cloned;
  }

  // -------------------------------------------------------------------------
  // Key Count Validators
  // -------------------------------------------------------------------------

  /** Minimum number of keys */
  minKeys(count: number): this {
    return this.addStrategy(new MinKeysStrategy(count) as never);
  }

  /** Maximum number of keys */
  maxKeys(count: number): this {
    return this.addStrategy(new MaxKeysStrategy(count) as never);
  }

  /** Exact number of keys */
  keyCount(count: number): this {
    return this.minKeys(count).maxKeys(count);
  }
}

/**
 * Create a new object validator
 * @param schema - Optional initial schema
 * @returns New ObjectValidator instance
 */
export function object<T extends Record<string, unknown>>(
  schema?: ObjectSchema<T>,
): ObjectValidator<T> {
  return new ObjectValidator<T>(schema ?? ({} as ObjectSchema<T>));
}
