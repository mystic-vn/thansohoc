import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { UpdateWebsiteSettingsDto } from './dto/update-website-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('website')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Get('settings')
  async getSettings() {
    return await this.websiteService.getSettings();
  }

  @Post('settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  async updateSettings(@Body() updateSettingsDto: UpdateWebsiteSettingsDto) {
    return await this.websiteService.updateSettings(updateSettingsDto);
  }

  @Get('settings/:key')
  async getSetting(@Param('key') key: string) {
    return { 
      key, 
      value: await this.websiteService.getSetting(key) 
    };
  }

  @Get('footer')
  async getFooterSettings() {
    return await this.websiteService.getFooterSettings();
  }

  @Get('seo')
  async getSeoSettings() {
    return await this.websiteService.getSeoSettings();
  }
} 