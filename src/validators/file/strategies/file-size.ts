/**
 * File Size Strategy
 * @module validators/file/strategies/file-size
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidatableFile } from './mime-type';
import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * File size units in bytes
 */
export const FILE_SIZE_UNITS = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
} as const;

/**
 * Min file size validation strategy
 */
export class MinFileSizeStrategy extends BaseValidationStrategy<ValidatableFile, ValidatableFile> {
  readonly name = 'minFileSize';

  constructor(private readonly minSize: number) {
    super();
  }

  validate(value: ValidatableFile, context: ValidationContext): ValidationResult<ValidatableFile> {
    if (value.size < this.minSize) {
      return this.failure('file.size.tooSmall', context, {
        min: this.minSize,
        actual: value.size,
        minFormatted: this.formatBytes(this.minSize),
        actualFormatted: this.formatBytes(value.size),
      });
    }

    return this.success(value, context);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    if (bytes < FILE_SIZE_UNITS.KB) return `${bytes.toString()} B`;
    if (bytes < FILE_SIZE_UNITS.MB) return `${(bytes / FILE_SIZE_UNITS.KB).toFixed(2)} KB`;
    if (bytes < FILE_SIZE_UNITS.GB) return `${(bytes / FILE_SIZE_UNITS.MB).toFixed(2)} MB`;
    return `${(bytes / FILE_SIZE_UNITS.GB).toFixed(2)} GB`;
  }
}

/**
 * Max file size validation strategy
 */
export class MaxFileSizeStrategy extends BaseValidationStrategy<ValidatableFile, ValidatableFile> {
  readonly name = 'maxFileSize';

  constructor(private readonly maxSize: number) {
    super();
  }

  validate(value: ValidatableFile, context: ValidationContext): ValidationResult<ValidatableFile> {
    if (value.size > this.maxSize) {
      return this.failure('file.size.tooLarge', context, {
        max: this.maxSize,
        actual: value.size,
        maxFormatted: this.formatBytes(this.maxSize),
        actualFormatted: this.formatBytes(value.size),
      });
    }

    return this.success(value, context);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    if (bytes < FILE_SIZE_UNITS.KB) return `${bytes.toString()} B`;
    if (bytes < FILE_SIZE_UNITS.MB) return `${(bytes / FILE_SIZE_UNITS.KB).toFixed(2)} KB`;
    if (bytes < FILE_SIZE_UNITS.GB) return `${(bytes / FILE_SIZE_UNITS.MB).toFixed(2)} MB`;
    return `${(bytes / FILE_SIZE_UNITS.GB).toFixed(2)} GB`;
  }
}
