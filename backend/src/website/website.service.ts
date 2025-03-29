import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebsiteSettings } from './schemas/website-settings.schema';
import { UpdateWebsiteSettingsDto } from './dto/update-website-settings.dto';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectModel(WebsiteSettings.name)
    private websiteSettingsModel: Model<WebsiteSettings>,
  ) {}

  /**
   * Lấy cài đặt website. Nếu không có dữ liệu, tạo cài đặt mặc định.
   */
  async getSettings(): Promise<WebsiteSettings> {
    let settings = await this.websiteSettingsModel.findOne().exec();

    if (!settings) {
      // Tạo cài đặt mặc định nếu chưa có
      settings = await this.websiteSettingsModel.create({
        name: 'Thần Số Học',
        description: 'Ứng dụng tra cứu thần số học và chiêm tinh',
        contactEmail: 'info@thansohoc.com',
        contactPhone: '+84 123 456 789',
        footer: {
          copyright: 'Thần Số Học. Tất cả các quyền được bảo lưu.',
          showYear: true,
        },
        seo: {
          title: 'Thần Số Học - Khám phá bản thân qua con số',
          description: 'Ứng dụng tra cứu thần số học và chiêm tinh, giúp bạn khám phá tiềm năng và con đường số mệnh.',
          keywords: ['thần số học', 'chiêm tinh', 'cung hoàng đạo', 'tử vi'],
        },
      });
    }

    return settings;
  }

  /**
   * Cập nhật cài đặt website
   */
  async updateSettings(updateSettingsDto: UpdateWebsiteSettingsDto): Promise<WebsiteSettings> {
    const settings = await this.getSettings();

    // Cập nhật các trường được cung cấp
    Object.assign(settings, updateSettingsDto);
    
    await settings.save();
    return settings;
  }

  /**
   * Lấy giá trị của một cài đặt cụ thể
   */
  async getSetting(key: string): Promise<any> {
    const settings = await this.getSettings();
    
    // Xử lý đường dẫn lồng nhau, ví dụ: 'footer.copyright'
    if (key.includes('.')) {
      const keys = key.split('.');
      let value = settings;
      
      for (const k of keys) {
        if (value && value[k] !== undefined) {
          value = value[k];
        } else {
          return null;
        }
      }
      
      return value;
    }
    
    return settings[key];
  }

  /**
   * Lấy cài đặt footer
   */
  async getFooterSettings(): Promise<any> {
    const settings = await this.getSettings();
    return {
      copyright: settings.footer?.copyright || 'Thần Số Học. Tất cả các quyền được bảo lưu.',
      showYear: settings.footer?.showYear !== false, // Mặc định là true
      links: settings.footer?.links || [],
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      socialMedia: settings.socialMedia,
    };
  }

  /**
   * Lấy cài đặt SEO
   */
  async getSeoSettings(): Promise<any> {
    const settings = await this.getSettings();
    return settings.seo || {
      title: 'Thần Số Học',
      description: 'Ứng dụng tra cứu thần số học và chiêm tinh',
      keywords: ['thần số học', 'chiêm tinh', 'cung hoàng đạo', 'tử vi'],
    };
  }
} 