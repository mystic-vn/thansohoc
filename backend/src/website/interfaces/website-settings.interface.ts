export interface WebsiteSettings {
  _id?: string;
  name: string;
  description?: string;
  logo?: string;
  favicon?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  footer?: {
    copyright: string;
    showYear?: boolean;
    links?: Array<{
      title: string;
      url: string;
    }>;
  };
  seo?: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
} 