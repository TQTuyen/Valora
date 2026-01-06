import { IsUrl, IsString, IsOptional } from '@tqtos/valora/decorators';

/**
 * Social Links DTO for optional nested validation
 */
export class SocialLinksDto {
  @IsOptional()
  @IsUrl({ message: 'LinkedIn must be a valid URL' })
  linkedin?: string;

  @IsOptional()
  @IsUrl({ message: 'GitHub must be a valid URL' })
  github?: string;

  @IsOptional()
  @IsUrl({ message: 'Twitter must be a valid URL' })
  twitter?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ message: 'Portfolio must be a valid URL' })
  portfolio?: string;
}
