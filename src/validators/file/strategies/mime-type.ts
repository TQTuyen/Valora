/**
 * MIME Type Strategy
 * @module validators/file/strategies/mime-type
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/**
 * File interface
 */
export interface ValidatableFile {
  type: string;
  size: number;
  name?: string;
}

/**
 * MIME type validation strategy
 *
 * Validates file MIME types against allowed types or patterns.
 */
export class MimeTypeStrategy extends BaseValidationStrategy<ValidatableFile, ValidatableFile> {
  readonly name = 'mimeType';

  constructor(
    private readonly allowedTypes: string[] | RegExp,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: ValidatableFile, context: ValidationContext): ValidationResult<ValidatableFile> {
    if (!value.type) {
      return this.failure('file.mimeType.missing', context);
    }

    const isAllowed = Array.isArray(this.allowedTypes)
      ? this.allowedTypes.includes(value.type)
      : this.allowedTypes.test(value.type);

    if (!isAllowed) {
      return this.failure('file.mimeType.invalid', context, {
        actual: value.type,
        allowed: this.allowedTypes,
      });
    }

    return this.success(value, context);
  }
}

/**
 * Common MIME type groups
 */
export const MIME_TYPES = {
  IMAGE: /^image\/(jpeg|png|gif|webp|svg\+xml)$/,
  VIDEO: /^video\/(mp4|webm|ogg|avi|mov)$/,
  AUDIO: /^audio\/(mpeg|wav|ogg|mp3|flac)$/,
  DOCUMENT:
    /^application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/,
  SPREADSHEET:
    /^application\/(vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/,
  TEXT: /^text\/(plain|csv|html|css|javascript)$/,
  JSON: /^application\/(json|ld\+json)$/,
  ZIP: /^application\/(zip|x-zip-compressed|x-rar-compressed|x-7z-compressed)$/,
} as const;
