/**
 * String Utilities
 * @module utils/string
 */

/**
 * Interpolate placeholders in a string
 * @param template - Template string with {placeholder} syntax
 * @param params - Object with placeholder values
 * @returns Interpolated string
 *
 * @example
 * interpolate('Hello, {name}!', { name: 'World' })
 * // Returns: 'Hello, World!'
 */
export function interpolate(template: string, params?: Record<string, unknown>): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = params[key];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return value !== undefined ? String(value as any) : `{${key}}`;
  });
}

/**
 * Capitalize the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
