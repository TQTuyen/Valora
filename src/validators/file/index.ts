/**
 * File Validator
 * @module validators/file
 */

export type {
  DimensionConstraints,
  FileExtensionStrategy,
  ImageDimensionsStrategy,
  ImageFile,
  MaxFileSizeStrategy,
  MimeTypeStrategy,
  MinFileSizeStrategy,
  ValidatableFile,
} from './strategies';
export { FILE_SIZE_UNITS, MIME_TYPES } from './strategies';
export { file, FileValidator } from './validator';
