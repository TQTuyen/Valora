/**
 * File Extension Strategy
 * @module validators/file/strategies/file-extension
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidatableFile } from './mime-type';
import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/**
 * File extension validation strategy
 *
 * Validates file extensions against allowed extensions.
 */
export class FileExtensionStrategy extends BaseValidationStrategy<
  ValidatableFile,
  ValidatableFile
> {
  readonly name = 'fileExtension';

  private readonly normalizedExtensions: string[];

  constructor(allowedExtensions: string[], options?: ValidationOptions) {
    super();
    // Normalize extensions (remove leading dots, lowercase)
    this.normalizedExtensions = allowedExtensions.map((ext) =>
      ext.replace(/^\./, '').toLowerCase(),
    );
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  validate(value: ValidatableFile, context: ValidationContext): ValidationResult<ValidatableFile> {
    if (!value.name) {
      return this.failure('file.extension.nameMissing', context);
    }

    const extension = this.getExtension(value.name);

    if (!extension) {
      return this.failure('file.extension.missing', context, {
        fileName: value.name,
      });
    }

    if (!this.normalizedExtensions.includes(extension)) {
      return this.failure('file.extension.invalid', context, {
        actual: extension,
        allowed: this.normalizedExtensions,
      });
    }

    return this.success(value, context);
  }

  /**
   * Extract file extension from filename
   */
  private getExtension(filename: string): string | null {
    const match = filename.match(/\.([^.]+)$/);
    return match ? (match[1]?.toLowerCase() ?? null) : null;
  }
}
