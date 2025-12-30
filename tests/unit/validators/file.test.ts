/**
 * File Validator Tests
 */

import { describe, expect, it } from 'vitest';

import { file, FILE_SIZE_UNITS, MIME_TYPES } from '@validators/file';
import { createContext, expectFailure, expectSuccess } from '../../helpers/test-utils';

import type { ImageFile } from '@validators/file';

describe('File Validator', () => {
  const ctx = createContext();

  // Helper to create mock file
  const createMockFile = (
    type: string,
    size: number,
    name?: string,
    width?: number,
    height?: number,
  ): ImageFile => {
    const file: ImageFile = { type, size };
    if (name !== undefined) file.name = name;
    if (width !== undefined) file.width = width;
    if (height !== undefined) file.height = height;
    return file;
  };

  describe('MIME Type Validation', () => {
    it('should validate exact MIME types', () => {
      const validator = file().mimeType(['image/jpeg', 'image/png']);

      const jpegFile = createMockFile('image/jpeg', 1000, 'photo.jpg');
      const pngFile = createMockFile('image/png', 1000, 'image.png');

      expectSuccess(validator.validate(jpegFile, ctx));
      expectSuccess(validator.validate(pngFile, ctx));
    });

    it('should reject non-allowed MIME types', () => {
      const validator = file().mimeType(['image/jpeg', 'image/png']);

      const gifFile = createMockFile('image/gif', 1000, 'animation.gif');
      const pdfFile = createMockFile('application/pdf', 1000, 'doc.pdf');

      expectFailure(validator.validate(gifFile, ctx));
      expectFailure(validator.validate(pdfFile, ctx));
    });

    it('should validate MIME type patterns', () => {
      const validator = file().mimeType(MIME_TYPES.IMAGE);

      expectSuccess(validator.validate(createMockFile('image/jpeg', 1000), ctx));
      expectSuccess(validator.validate(createMockFile('image/png', 1000), ctx));
      expectSuccess(validator.validate(createMockFile('image/webp', 1000), ctx));
      expectFailure(validator.validate(createMockFile('video/mp4', 1000), ctx));
    });

    it('should validate video MIME types', () => {
      const validator = file().mimeType(MIME_TYPES.VIDEO);

      expectSuccess(validator.validate(createMockFile('video/mp4', 1000), ctx));
      expectSuccess(validator.validate(createMockFile('video/webm', 1000), ctx));
      expectFailure(validator.validate(createMockFile('image/jpeg', 1000), ctx));
    });

    it('should validate document MIME types', () => {
      const validator = file().mimeType(MIME_TYPES.DOCUMENT);

      expectSuccess(validator.validate(createMockFile('application/pdf', 1000), ctx));
      expectFailure(validator.validate(createMockFile('image/jpeg', 1000), ctx));
    });

    it('should reject file without MIME type', () => {
      const validator = file().mimeType(['image/jpeg']);

      const fileWithoutType = createMockFile('', 1000);
      expectFailure(validator.validate(fileWithoutType, ctx));
    });
  });

  describe('File Extension Validation', () => {
    it('should validate file extensions', () => {
      const validator = file().extension(['jpg', 'png', 'gif']);

      expectSuccess(validator.validate(createMockFile('image/jpeg', 1000, 'photo.jpg'), ctx));
      expectSuccess(validator.validate(createMockFile('image/png', 1000, 'image.png'), ctx));
      expectSuccess(validator.validate(createMockFile('image/gif', 1000, 'animation.gif'), ctx));
    });

    it('should handle extensions with dots', () => {
      const validator = file().extension(['.jpg', '.png']);

      expectSuccess(validator.validate(createMockFile('image/jpeg', 1000, 'photo.jpg'), ctx));
      expectSuccess(validator.validate(createMockFile('image/png', 1000, 'image.png'), ctx));
    });

    it('should be case insensitive', () => {
      const validator = file().extension(['jpg', 'PNG']);

      expectSuccess(validator.validate(createMockFile('image/jpeg', 1000, 'photo.JPG'), ctx));
      expectSuccess(validator.validate(createMockFile('image/png', 1000, 'image.png'), ctx));
    });

    it('should reject invalid extensions', () => {
      const validator = file().extension(['jpg', 'png']);

      expectFailure(validator.validate(createMockFile('image/gif', 1000, 'animation.gif'), ctx));
      expectFailure(validator.validate(createMockFile('application/pdf', 1000, 'doc.pdf'), ctx));
    });

    it('should reject file without name', () => {
      const validator = file().extension(['jpg']);

      expectFailure(validator.validate(createMockFile('image/jpeg', 1000), ctx));
    });

    it('should reject file without extension', () => {
      const validator = file().extension(['jpg']);

      expectFailure(validator.validate(createMockFile('image/jpeg', 1000, 'file'), ctx));
    });
  });

  describe('File Size Validation', () => {
    it('should validate minimum file size', () => {
      const validator = file().minSize(1000);

      expectSuccess(validator.validate(createMockFile('image/jpeg', 1000), ctx));
      expectSuccess(validator.validate(createMockFile('image/jpeg', 2000), ctx));
      expectFailure(validator.validate(createMockFile('image/jpeg', 500), ctx));
    });

    it('should validate maximum file size', () => {
      const validator = file().maxSize(10000);

      expectSuccess(validator.validate(createMockFile('image/jpeg', 5000), ctx));
      expectSuccess(validator.validate(createMockFile('image/jpeg', 10000), ctx));
      expectFailure(validator.validate(createMockFile('image/jpeg', 15000), ctx));
    });

    it('should validate size range', () => {
      const validator = file().minSize(1000).maxSize(10000);

      expectSuccess(validator.validate(createMockFile('image/jpeg', 5000), ctx));
      expectFailure(validator.validate(createMockFile('image/jpeg', 500), ctx)); // Too small
      expectFailure(validator.validate(createMockFile('image/jpeg', 15000), ctx)); // Too large
    });

    it('should work with FILE_SIZE_UNITS', () => {
      const validator = file().maxSize(5 * FILE_SIZE_UNITS.MB);

      expectSuccess(validator.validate(createMockFile('image/jpeg', 3 * FILE_SIZE_UNITS.MB), ctx));
      expectFailure(validator.validate(createMockFile('image/jpeg', 6 * FILE_SIZE_UNITS.MB), ctx));
    });

    it('should handle zero-byte files', () => {
      const minValidator = file().minSize(1);
      const maxValidator = file().maxSize(0);

      expectFailure(minValidator.validate(createMockFile('image/jpeg', 0), ctx));
      expectSuccess(maxValidator.validate(createMockFile('image/jpeg', 0), ctx));
    });
  });

  describe('Image Dimensions Validation', () => {
    it('should validate image with provided dimensions', async () => {
      const validator = file().imageDimensions({ minWidth: 100, maxWidth: 1000 });

      const validImage = createMockFile('image/jpeg', 1000, 'photo.jpg', 800, 600);
      const result = await validator.validateAsync(validImage, ctx);

      expectSuccess(result);
    });

    it('should reject image with width too small', async () => {
      const validator = file().imageDimensions({ minWidth: 500 });

      const smallImage = createMockFile('image/jpeg', 1000, 'photo.jpg', 300, 200);
      const result = await validator.validateAsync(smallImage, ctx);

      expectFailure(result);
    });

    it('should reject image with width too large', async () => {
      const validator = file().imageDimensions({ maxWidth: 1000 });

      const largeImage = createMockFile('image/jpeg', 1000, 'photo.jpg', 2000, 1500);
      const result = await validator.validateAsync(largeImage, ctx);

      expectFailure(result);
    });

    it('should validate height constraints', async () => {
      const validator = file().imageDimensions({ minHeight: 400, maxHeight: 1200 });

      const validImage = createMockFile('image/jpeg', 1000, 'photo.jpg', 800, 600);
      const shortImage = createMockFile('image/jpeg', 1000, 'photo.jpg', 800, 200);
      const tallImage = createMockFile('image/jpeg', 1000, 'photo.jpg', 800, 1500);

      expectSuccess(await validator.validateAsync(validImage, ctx));
      expectFailure(await validator.validateAsync(shortImage, ctx));
      expectFailure(await validator.validateAsync(tallImage, ctx));
    });

    it('should validate aspect ratio', async () => {
      const validator = file().imageDimensions({ aspectRatio: 16 / 9 });

      // 16:9 aspect ratio
      const validImage = createMockFile('image/jpeg', 1000, 'photo.jpg', 1600, 900);
      expectSuccess(await validator.validateAsync(validImage, ctx));

      // 4:3 aspect ratio
      const invalidImage = createMockFile('image/jpeg', 1000, 'photo.jpg', 800, 600);
      expectFailure(await validator.validateAsync(invalidImage, ctx));
    });

    it('should handle aspect ratio tolerance', async () => {
      const validator = file().imageDimensions({
        aspectRatio: 16 / 9,
        aspectRatioTolerance: 0.1, // 10% tolerance
      });

      // Slightly off 16:9
      const nearMatch = createMockFile('image/jpeg', 1000, 'photo.jpg', 1600, 920);
      expectSuccess(await validator.validateAsync(nearMatch, ctx));
    });

    it('should reject image without dimensions', async () => {
      const validator = file().imageDimensions({ minWidth: 100 });

      // File without width/height (and not in browser to load)
      const imageWithoutDimensions = createMockFile('image/jpeg', 1000, 'photo.jpg');
      const result = await validator.validateAsync(imageWithoutDimensions, ctx);

      expectFailure(result);
    });
  });

  describe('Chaining Validations', () => {
    it('should chain MIME type and size validations', () => {
      const validator = file()
        .mimeType(MIME_TYPES.IMAGE)
        .maxSize(5 * FILE_SIZE_UNITS.MB);

      const validFile = createMockFile('image/jpeg', 3 * FILE_SIZE_UNITS.MB);
      const tooLarge = createMockFile('image/jpeg', 6 * FILE_SIZE_UNITS.MB);
      const wrongType = createMockFile('video/mp4', 3 * FILE_SIZE_UNITS.MB);

      expectSuccess(validator.validate(validFile, ctx));
      expectFailure(validator.validate(tooLarge, ctx));
      expectFailure(validator.validate(wrongType, ctx));
    });

    it('should chain extension and size validations', () => {
      const validator = file().extension(['jpg', 'png']).minSize(1000).maxSize(10000);

      expectSuccess(validator.validate(createMockFile('image/jpeg', 5000, 'photo.jpg'), ctx));
      expectFailure(validator.validate(createMockFile('image/jpeg', 500, 'photo.jpg'), ctx)); // Too small
      expectFailure(validator.validate(createMockFile('image/jpeg', 5000, 'photo.gif'), ctx)); // Wrong extension
    });

    it('should combine all validation types', async () => {
      const validator = file()
        .mimeType(['image/jpeg', 'image/png'])
        .extension(['jpg', 'png'])
        .minSize(FILE_SIZE_UNITS.KB)
        .maxSize(10 * FILE_SIZE_UNITS.MB)
        .imageDimensions({ minWidth: 200, maxWidth: 4000, minHeight: 200, maxHeight: 4000 });

      const validFile = createMockFile(
        'image/jpeg',
        2 * FILE_SIZE_UNITS.MB,
        'photo.jpg',
        1920,
        1080,
      );

      expectSuccess(await validator.validateAsync(validFile, ctx));
    });
  });

  describe('Async Validation', () => {
    it('should support async validation', async () => {
      const validator = file().mimeType(MIME_TYPES.IMAGE);

      const imageFile = createMockFile('image/jpeg', 1000, 'photo.jpg');
      const result = await validator.validateAsync(imageFile, ctx);

      expect(result.success).toBe(true);
    });

    it('should handle mixed sync and async strategies', async () => {
      const validator = file()
        .mimeType(MIME_TYPES.IMAGE) // Sync
        .maxSize(5 * FILE_SIZE_UNITS.MB) // Sync
        .imageDimensions({ minWidth: 100 }); // Async

      const validFile = createMockFile('image/jpeg', 2 * FILE_SIZE_UNITS.MB, 'photo.jpg', 800, 600);
      const result = await validator.validateAsync(validFile, ctx);

      expectSuccess(result);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should validate avatar upload', async () => {
      const avatarValidator = file()
        .mimeType(['image/jpeg', 'image/png', 'image/webp'])
        .extension(['jpg', 'jpeg', 'png', 'webp'])
        .maxSize(2 * FILE_SIZE_UNITS.MB)
        .imageDimensions({
          minWidth: 100,
          maxWidth: 2000,
          minHeight: 100,
          maxHeight: 2000,
        });

      const validAvatar = createMockFile(
        'image/jpeg',
        500 * FILE_SIZE_UNITS.KB,
        'avatar.jpg',
        400,
        400,
      );
      expectSuccess(await avatarValidator.validateAsync(validAvatar, ctx));

      const tooSmall = createMockFile('image/jpeg', 100 * FILE_SIZE_UNITS.KB, 'avatar.jpg', 50, 50);
      expectFailure(await avatarValidator.validateAsync(tooSmall, ctx));
    });

    it('should validate document upload', () => {
      const docValidator = file()
        .mimeType(MIME_TYPES.DOCUMENT)
        .extension(['pdf', 'doc', 'docx'])
        .maxSize(25 * FILE_SIZE_UNITS.MB);

      const validPdf = createMockFile('application/pdf', 5 * FILE_SIZE_UNITS.MB, 'resume.pdf');
      expectSuccess(docValidator.validate(validPdf, ctx));

      const tooLarge = createMockFile('application/pdf', 30 * FILE_SIZE_UNITS.MB, 'large.pdf');
      expectFailure(docValidator.validate(tooLarge, ctx));
    });

    it('should validate video upload', () => {
      const videoValidator = file()
        .mimeType(MIME_TYPES.VIDEO)
        .extension(['mp4', 'webm', 'mov'])
        .maxSize(100 * FILE_SIZE_UNITS.MB);

      const validVideo = createMockFile('video/mp4', 50 * FILE_SIZE_UNITS.MB, 'clip.mp4');
      expectSuccess(videoValidator.validate(validVideo, ctx));

      const wrongType = createMockFile('video/avi', 50 * FILE_SIZE_UNITS.MB, 'clip.avi');
      expectFailure(videoValidator.validate(wrongType, ctx));
    });

    it('should validate product image with aspect ratio', async () => {
      const productImageValidator = file()
        .mimeType(['image/jpeg', 'image/png'])
        .maxSize(5 * FILE_SIZE_UNITS.MB)
        .imageDimensions({
          aspectRatio: 1, // Square images
          aspectRatioTolerance: 0.05,
        });

      const squareImage = createMockFile(
        'image/jpeg',
        2 * FILE_SIZE_UNITS.MB,
        'product.jpg',
        1000,
        1000,
      );
      expectSuccess(await productImageValidator.validateAsync(squareImage, ctx));

      const rectangularImage = createMockFile(
        'image/jpeg',
        2 * FILE_SIZE_UNITS.MB,
        'product.jpg',
        1600,
        900,
      );
      expectFailure(await productImageValidator.validateAsync(rectangularImage, ctx));
    });
  });
});
