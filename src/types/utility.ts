/**
 * Utility Types
 * @module types/utility
 */

/**
 * Make all properties deeply readonly
 */
export type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

/**
 * Make all properties deeply partial
 */
export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

/**
 * Primitive types
 */
export type Primitive = string | number | boolean | null | undefined | symbol | bigint;
