/**
 * URL Slug Strategy
 * @module validators/business/strategies/url-slug
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/**
 * URL slug validation strategy
 *
 * Validates URL-friendly slugs (lowercase, hyphens, numbers).
 * Format: lowercase letters, numbers, and hyphens only
 */
export class UrlSlugStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'urlSlug';

  constructor(
    private readonly options?: {
      /** Minimum length */
      minLength?: number;
      /** Maximum length */
      maxLength?: number;
      /** Allow underscores in addition to hyphens */
      allowUnderscores?: boolean;
    },
    validationOptions?: ValidationOptions,
  ) {
    super();
    if (validationOptions?.message) {
      this.withMessage(validationOptions.message);
    }
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    // Build pattern based on options
    const charPattern = this.options?.allowUnderscores ? '[a-z0-9_-]' : '[a-z0-9-]';
    const pattern = new RegExp(`^${charPattern}+$`);

    // Must match slug pattern
    if (!pattern.test(value)) {
      return this.failure('business.urlSlug.format', context);
    }

    // Cannot start or end with hyphen/underscore
    if (/^[-_]|[-_]$/.test(value)) {
      return this.failure('business.urlSlug.boundary', context);
    }

    // Cannot have consecutive hyphens/underscores
    if (/[-_]{2,}/.test(value)) {
      return this.failure('business.urlSlug.consecutive', context);
    }

    // Check length constraints
    if (this.options?.minLength !== undefined && value.length < this.options.minLength) {
      return this.failure('business.urlSlug.minLength', context, {
        min: this.options.minLength,
        actual: value.length,
      });
    }

    if (this.options?.maxLength !== undefined && value.length > this.options.maxLength) {
      return this.failure('business.urlSlug.maxLength', context, {
        max: this.options.maxLength,
        actual: value.length,
      });
    }

    return this.success(value, context);
  }
}

/**
 * Transform a string into a URL-friendly slug
 */
export function slugify(
  text: string,
  options?: { separator?: string; lowercase?: boolean },
): string {
  const separator = options?.separator ?? '-';
  const lowercase = options?.lowercase ?? true;

  let slug = text
    .normalize('NFD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .trim()
    .replace(/[\s_]+/g, separator) // Replace spaces and underscores with separator
    .replace(new RegExp(`${separator}+`, 'g'), separator); // Remove consecutive separators

  if (lowercase) {
    slug = slug.toLowerCase();
  }

  // Remove leading/trailing separators
  slug = slug.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');

  return slug;
}
