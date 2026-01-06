import {
  ArrayMaxSize,
  ArrayMinSize,
  Contains,
  IsArray,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxAge,
  MaxLength,
  Min,
  MinAge,
  MinLength,
  ValidateNested,
} from '@tqtos/valora/decorators';
import { AddressDto } from './address.dto';
import { SocialLinksDto } from './social-links.dto';

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(5, { message: 'Name cannot exceed 50 characters' })
  name: string;

  @IsEmail({ message: 'Please provide a valid email address' })
  email: string;

  @IsNumber()
  @Min(18, { message: 'You must be at least 18 years old' })
  @Max(120, { message: 'Age cannot exceed 120' })
  age: number;

  @IsDate({ message: 'Birth date must be a valid date' })
  @MinAge(18, { message: 'You must be at least 18 years old based on birth date' })
  @MaxAge(120, { message: 'Age cannot exceed 120 years' })
  birthDate: Date;

  @IsArray({ message: 'Tags must be an array' })
  @ArrayMinSize(1, { message: 'At least 1 tag is required' })
  @ArrayMaxSize(2, { message: 'Cannot have more than 2 tags' })
  tags: string[];

  @ValidateNested()
  address: AddressDto;

  @IsOptional()
  @ValidateNested()
  socialLinks?: SocialLinksDto;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Bio must be at least 3 characters' })
  @MaxLength(500, { message: 'Bio cannot exceed 500 characters' })
  bio?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ message: 'Avatar URL must be a valid URL' })
  @Contains('https://', { message: 'Avatar URL must use HTTPS protocol' })
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Username must be at least 8 characters' })
  @MaxLength(20, { message: 'Username cannot exceed 20 characters' })
  username?: string;

  @IsOptional()
  @IsNumber()
  @Min(1000, { message: 'Salary must be at least 1000' })
  @Max(1000000, { message: 'Salary cannot exceed 1,000,000' })
  expectedSalary?: number;
}
