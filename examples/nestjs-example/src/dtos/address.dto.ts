import { IsString, Matches, MaxLength, MinLength } from '@tqtos/valora/decorators';

/**
 * Address DTO for nested validation example
 */
export class AddressDto {
  @IsString()
  @MinLength(2, { message: 'Street must be at least 2 characters' })
  @MaxLength(5, { message: 'Street cannot exceed 5 characters' })
  street: string;

  @IsString()
  @MinLength(2, { message: 'City must be at least 2 characters' })
  city: string;

  @IsString()
  @MinLength(2, { message: 'State must be at least 2 characters' })
  @MaxLength(5)
  state: string;

  @IsString()
  @Matches(/^\d{5}(-\d{4})?$/, { message: 'Invalid ZIP code format (e.g., 12345 or 12345-6789)' })
  zipCode: string;

  @IsString()
  @MinLength(2, { message: 'Country must be at least 2 characters' })
  country: string;
}
