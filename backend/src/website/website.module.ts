import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';
import { WebsiteSettings, WebsiteSettingsSchema } from './schemas/website-settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WebsiteSettings.name, schema: WebsiteSettingsSchema },
    ]),
  ],
  controllers: [WebsiteController],
  providers: [WebsiteService],
  exports: [WebsiteService],
})
export class WebsiteModule {} 