import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsFuture,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from '@tqtos/valora/decorators';

export class CreatePostDto {
  @IsString()
  @MinLength(3, { message: 'Title must be at least 5 characters' })
  @MaxLength(5, { message: 'Title cannot exceed 100 characters' })
  title: string;

  @IsString()
  @MinLength(2, { message: 'Content must be at least 20 characters' })
  @MaxLength(5, { message: 'Content cannot exceed 5000 characters' })
  content: string;

  @IsArray({ message: 'Categories must be an array' })
  @ArrayMinSize(1, { message: 'At least 1 category is required' })
  @ArrayMaxSize(2, { message: 'Cannot have more than 5 categories' })
  @IsString()
  @MinLength(2)
  categories: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({ message: 'Each image URL must be valid' })
  imageUrls?: string[];

  @IsBoolean({ message: 'Published must be a boolean value' })
  published: boolean;

  @IsOptional()
  @IsDate({ message: 'Publish date must be a valid date' })
  @IsFuture({ message: 'Publish date must be in the future' })
  publishAt?: Date;

  @IsOptional()
  @IsArray()
  @IsString()
  @MinLength(2)
  tags?: string[];

  @IsOptional()
  @IsString()
  @MinLength(50, { message: 'Excerpt must be at least 50 characters' })
  @MaxLength(300, { message: 'Excerpt cannot exceed 300 characters' })
  excerpt?: string;
}
