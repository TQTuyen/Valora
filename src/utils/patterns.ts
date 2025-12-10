/**
 * Common Regex Patterns
 * @module utils/patterns
 */

/**
 * Common regex patterns for validation
 */
export const patterns = {
  /** Email pattern (simplified) */
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** URL pattern */
  url: /^https?:\/\/[^\s/$.?#].[^\s]*$/i,

  /** UUID v4 pattern */
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

  /** Alpha only (letters) */
  alpha: /^[a-zA-Z]+$/,

  /** Alphanumeric (letters and numbers) */
  alphanumeric: /^[a-zA-Z0-9]+$/,

  /** Numeric string */
  numeric: /^-?\d*\.?\d+$/,

  /** Integer string */
  integer: /^-?\d+$/,

  /** Positive integer */
  positiveInteger: /^\d+$/,

  /** Lowercase only */
  lowercase: /^[a-z]+$/,

  /** Uppercase only */
  uppercase: /^[A-Z]+$/,

  /** Phone number (international format) */
  phone: /^\+?[\d\s-()]+$/,

  /** Credit card (basic) */
  creditCard: /^\d{13,19}$/,

  /** Hex color */
  hexColor: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,

  /** ISO date (YYYY-MM-DD) */
  isoDate: /^\d{4}-\d{2}-\d{2}$/,

  /** Slug (lowercase with hyphens) */
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;
