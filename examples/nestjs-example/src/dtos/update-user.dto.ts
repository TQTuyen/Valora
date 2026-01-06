import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from '@tqtos/valora/decorators';
import { SocialLinksDto } from './social-links.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Bio must be at least 10 characters' })
  @MaxLength(500, { message: 'Bio cannot exceed 500 characters' })
  bio?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ message: 'Avatar URL must be a valid URL' })
  avatarUrl?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10, { message: 'Cannot have more than 10 tags' })
  @IsString()
  tags?: string[];

  @IsOptional()
  @ValidateNested()
  socialLinks?: SocialLinksDto;
}
