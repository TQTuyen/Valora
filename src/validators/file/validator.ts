/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * File Validator
 * @module validators/file/validator
 */

import { BaseValidator } from '@validators/common';

import {
  FileExtensionStrategy,
  ImageDimensionsStrategy,
  MaxFileSizeStrategy,
  MimeTypeStrategy,
  MinFileSizeStrategy,
} from './strategies';

import type { DimensionConstraints, ImageFile, ValidatableFile } from './strategies';
import type {
  IAsyncValidator,
  ValidationContext,
  ValidationOptions,
  ValidationResult,
} from '#types/index';

/**
 * File validator for validating uploaded files
 *
 * Supports validation of file size, MIME type, extensions, and image dimensions.
 *
 * @example
 * ```typescript
 * const avatarValidator = file()
 *   .mimeType(MIME_TYPES.IMAGE)
 *   .maxSize(5 * FILE_SIZE_UNITS.MB)
 *   .extension(['jpg', 'png', 'webp'])
 *   .imageDimensions({ minWidth: 100, maxWidth: 2000 });
 * ```
 */
export class FileValidator
  extends BaseValidator<ValidatableFile, ValidatableFile>
  implements IAsyncValidator<ValidatableFile, ValidatableFile>
{
  readonly _type = 'file';

  /**
   * Validate file MIME type
   * @param allowedTypes - Array of MIME types or RegExp pattern
   * @param options - Optional validation options
   */
  mimeType(allowedTypes: string[] | RegExp, options?: ValidationOptions): this {
    return this.addStrategy(new MimeTypeStrategy(allowedTypes, options));
  }

  /**
   * Validate file extension
   * @param allowedExtensions - Array of allowed extensions (with or without dots)
   * @param options - Optional validation options
   */
  extension(allowedExtensions: string[], options?: ValidationOptions): this {
    return this.addStrategy(new FileExtensionStrategy(allowedExtensions, options));
  }

  /**
   * Validate minimum file size
   * @param minSize - Minimum size in bytes
   * @param options - Optional validation options
   */
  minSize(minSize: number, options?: ValidationOptions): this {
    return this.addStrategy(new MinFileSizeStrategy(minSize, options));
  }

  /**
   * Validate maximum file size
   * @param maxSize - Maximum size in bytes
   * @param options - Optional validation options
   */
  maxSize(maxSize: number, options?: ValidationOptions): this {
    return this.addStrategy(new MaxFileSizeStrategy(maxSize, options));
  }

  /**
   * Validate image dimensions (async)
   * @param constraints - Dimension constraints
   * @param options - Optional validation options
   */
  imageDimensions(
    constraints: DimensionConstraints,
    options?: ValidationOptions,
  ): this & IAsyncValidator<ImageFile, ImageFile> {
    return this.addStrategy(new ImageDimensionsStrategy(constraints, options)) as this &
      IAsyncValidator<ImageFile, ImageFile>;
  }

  /**
   * Async validation for files that need loading (e.g., images)
   */
  async validateAsync(
    value: ValidatableFile,
    context?: ValidationContext,
  ): Promise<ValidationResult<ValidatableFile>> {
    const ctx = context ?? this.createContext(value);

    try {
      let currentValue: ValidatableFile = value;

      for (const strategy of this.strategies) {
        let result: ValidationResult<ValidatableFile>;

        // Check if strategy is a validator (with validateAsync) or a regular strategy
        if ('validateAsync' in strategy && typeof strategy.validateAsync === 'function') {
          result = await strategy.validateAsync(currentValue, ctx);
        } else {
          // Regular strategy (sync or async)
          const valResult = strategy.validate(currentValue, ctx);
          result = valResult instanceof Promise ? await valResult : valResult;
        }

        if (!result.success) {
          return result;
        }
        currentValue = result.data as ValidatableFile;
      }

      return {
        success: true,
        data: currentValue,
        errors: [],
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        errors: [
          {
            code: 'file.validation.error',
            message: error instanceof Error ? error.message : 'File validation failed',
            path: ctx.path,
            field: ctx.field,
          },
        ],
      };
    }
  }

  /**
   * Cancel pending async validation
   */
  cancel(): void {
    // No-op for file validator (no pending operations to cancel)
  }

  /**
   * Check if validation is pending
   */
  isPending(): boolean {
    return false;
  }

  /**
   * Create validation context
   */
  protected override createContext(value: ValidatableFile): ValidationContext {
    return {
      path: [],
      field: value.name ?? 'file',
      locale: 'en',
      data: { value },
    };
  }

  /**
   * Clone this validator
   */
  protected override clone(): FileValidator {
    const cloned = new FileValidator();
    cloned.strategies = [...this.strategies];
    return cloned;
  }
}

/**
 * Create a file validator
 *
 * @example
 * ```typescript
 * const validator = file()
 *   .maxSize(10 * FILE_SIZE_UNITS.MB)
 *   .mimeType(['image/jpeg', 'image/png']);
 *
 * const result = validator.validate(uploadedFile, context);
 * ```
 */
export function file(): FileValidator {
  return new FileValidator();
}
