import { IsEmail, IsOptional, IsString, IsObject, IsBoolean, IsArray } from 'class-validator';

export class UpdateWebsiteSettingsDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  favicon?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsObject()
  @IsOptional()
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };

  @IsObject()
  @IsOptional()
  footer?: {
    copyright: string;
    showYear?: boolean;
    links?: Array<{
      title: string;
      url: string;
    }>;
  };

  @IsObject()
  @IsOptional()
  seo?: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
} 