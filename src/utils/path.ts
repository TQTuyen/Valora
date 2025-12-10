/**
 * Path Utilities
 * @module utils/path
 */

/**
 * Convert a path array to a string representation
 * @param path - Path array (e.g., ['user', 'address', 0, 'street'])
 * @returns Path string (e.g., 'user.address[0].street')
 *
 * @example
 * pathToString(['user', 'address', 0, 'street'])
 * // Returns: 'user.address[0].street'
 */
export function pathToString(path: ReadonlyArray<string | number>): string {
  if (path.length === 0) {
    return '';
  }

  return path.reduce<string>((acc, segment, index) => {
    if (typeof segment === 'number') {
      return `${acc}[${String(segment)}]`;
    }
    return index === 0 ? segment : `${acc}.${segment}`;
  }, '');
}

/**
 * Convert a path string to an array representation
 * @param str - Path string (e.g., 'user.address[0].street')
 * @returns Path array (e.g., ['user', 'address', 0, 'street'])
 *
 * @example
 * stringToPath('user.address[0].street')
 * // Returns: ['user', 'address', 0, 'street']
 */
export function stringToPath(str: string): (string | number)[] {
  if (!str) {
    return [];
  }

  const result: (string | number)[] = [];
  const regex = /([^.[\]]+)|\[(\d+)\]/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(str)) !== null) {
    if (match[1] !== undefined) {
      result.push(match[1]);
    } else if (match[2] !== undefined) {
      result.push(parseInt(match[2], 10));
    }
  }

  return result;
}

/**
 * Get a value from an object by path
 * @param obj - Object to get value from
 * @param path - Path to the value
 * @returns The value at the path, or undefined
 *
 * @example
 * getByPath({ user: { name: 'John' } }, ['user', 'name'])
 * // Returns: 'John'
 */
export function getByPath(obj: unknown, path: ReadonlyArray<string | number>): unknown {
  let current: unknown = obj;

  for (const segment of path) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (typeof current !== 'object') {
      return undefined;
    }

    current = (current as Record<string | number, unknown>)[segment];
  }

  return current;
}

/**
 * Set a value in an object by path (immutable)
 * @param obj - Object to set value in
 * @param path - Path to the value
 * @param value - Value to set
 * @returns New object with the value set
 *
 * @example
 * setByPath({ user: { name: 'John' } }, ['user', 'name'], 'Jane')
 * // Returns: { user: { name: 'Jane' } }
 */
export function setByPath<T>(obj: T, path: ReadonlyArray<string | number>, value: unknown): T {
  if (path.length === 0) {
    return value as T;
  }

  const [head, ...rest] = path;
  const isArray = typeof head === 'number';

  if (obj === null || obj === undefined) {
    const container = isArray ? [] : {};
    return setByPath(container, path, value) as T;
  }

  if (isArray && Array.isArray(obj)) {
    const result = [...obj];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    result[head] = rest.length === 0 ? value : setByPath((obj as any)[head], rest, value);
    return result as T;
  }

  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const typedObj = obj as Record<string | number, unknown>;
    return {
      ...typedObj,
      [head as string | number]:
        rest.length === 0 ? value : setByPath(typedObj[head as string | number], rest, value),
    } as T;
  }

  return obj;
}
