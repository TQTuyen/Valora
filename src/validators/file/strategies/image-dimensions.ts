/**
 * Image Dimensions Strategy
 * @module validators/file/strategies/image-dimensions
 */

import { BaseAsyncValidationStrategy } from '@core/index';

import type { ValidatableFile } from './mime-type';
import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/**
 * Extended file interface with dimension data
 */
export interface ImageFile extends ValidatableFile {
  width?: number;
  height?: number;
}

/**
 * Dimension constraints
 */
export interface DimensionConstraints {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
  aspectRatioTolerance?: number; // Default: 0.01 (1%)
}

/**
 * Image dimensions validation strategy
 *
 * Validates image dimensions (width, height, aspect ratio).
 * This is an async strategy because it may need to load the image.
 */
export class ImageDimensionsStrategy extends BaseAsyncValidationStrategy<ImageFile, ImageFile> {
  readonly name = 'imageDimensions';

  constructor(
    private readonly constraints: DimensionConstraints,
    options?: ValidationOptions,
  ) {
    super();
    if (options?.message) {
      this.withMessage(options.message);
    }
  }

  // eslint-disable-next-line complexity
  async validate(
    value: ImageFile,
    context: ValidationContext,
  ): Promise<ValidationResult<ImageFile>> {
    // If dimensions are already provided, use them
    let width = value.width;
    let height = value.height;

    // If dimensions not provided and it's a browser File, try to load the image
    if ((width === undefined || height === undefined) && typeof window !== 'undefined') {
      try {
        const dimensions = await this.loadImageDimensions(value);
        width = dimensions.width;
        height = dimensions.height;
      } catch (error) {
        return this.failure(
          'file.image.loadFailed',
          context,
          error instanceof Error ? { error: error.message } : undefined,
        );
      }
    }

    // Dimensions are required for validation
    if (width === undefined || height === undefined) {
      return this.failure('file.image.dimensionsMissing', context);
    }

    // Validate width constraints
    if (this.constraints.minWidth !== undefined && width < this.constraints.minWidth) {
      return this.failure('file.image.widthTooSmall', context, {
        min: this.constraints.minWidth,
        actual: width,
      });
    }

    if (this.constraints.maxWidth !== undefined && width > this.constraints.maxWidth) {
      return this.failure('file.image.widthTooLarge', context, {
        max: this.constraints.maxWidth,
        actual: width,
      });
    }

    // Validate height constraints
    if (this.constraints.minHeight !== undefined && height < this.constraints.minHeight) {
      return this.failure('file.image.heightTooSmall', context, {
        min: this.constraints.minHeight,
        actual: height,
      });
    }

    if (this.constraints.maxHeight !== undefined && height > this.constraints.maxHeight) {
      return this.failure('file.image.heightTooLarge', context, {
        max: this.constraints.maxHeight,
        actual: height,
      });
    }

    // Validate aspect ratio
    if (this.constraints.aspectRatio !== undefined) {
      const actualRatio = width / height;
      const tolerance = this.constraints.aspectRatioTolerance ?? 0.01;
      const expectedRatio = this.constraints.aspectRatio;

      if (Math.abs(actualRatio - expectedRatio) > tolerance * expectedRatio) {
        return this.failure('file.image.aspectRatio', context, {
          expected: expectedRatio,
          actual: actualRatio,
          tolerance,
        });
      }
    }

    return this.success({ ...value, width, height }, context);
  }

  /**
   * Load image dimensions from a File object (browser only)
   */
  private async loadImageDimensions(
    file: ValidatableFile,
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Image loading only available in browser environment'));
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file as Blob);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }
}
