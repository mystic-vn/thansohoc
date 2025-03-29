import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class WebsiteSettings extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  logo: string;

  @Prop()
  favicon: string;

  @Prop({ required: true })
  contactEmail: string;

  @Prop()
  contactPhone: string;

  @Prop()
  address: string;

  @Prop({ type: Object, default: {} })
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };

  @Prop({ type: Object, default: { copyright: 'Thần Số Học. Tất cả các quyền được bảo lưu.', showYear: true } })
  footer: {
    copyright: string;
    showYear: boolean;
    links?: Array<{
      title: string;
      url: string;
    }>;
  };

  @Prop({ type: Object, default: {} })
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
}

export const WebsiteSettingsSchema = SchemaFactory.createForClass(WebsiteSettings); 