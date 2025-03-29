'use client';

import React, { useState, useEffect } from 'react';
import { websiteApi, WebsiteSettings } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('general');
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await websiteApi.getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Lỗi khi lấy cài đặt:', error);
        setSaveMessage({
          type: 'error',
          text: 'Không thể lấy cài đặt website. Vui lòng thử lại sau.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setSaving(true);
    setSaveMessage(null);
    
    try {
      const updatedSettings = await websiteApi.updateSettings(settings);
      setSettings(updatedSettings);
      setSaveMessage({
        type: 'success',
        text: 'Cài đặt website đã được cập nhật thành công'
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật cài đặt:', error);
      setSaveMessage({
        type: 'error',
        text: 'Không thể cập nhật cài đặt website. Vui lòng thử lại sau.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!settings) return;
    const { name, value } = e.target;
    
    // Xử lý các trường lồng nhau (ví dụ: footer.copyright)
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      const sectionKey = section as keyof WebsiteSettings;
      const sectionValue = settings[sectionKey] as Record<string, any> || {};
      
      setSettings({
        ...settings,
        [section]: {
          ...sectionValue,
          [field]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (!settings) return;
    
    // Xử lý các trường lồng nhau (ví dụ: footer.showYear)
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      const sectionKey = section as keyof WebsiteSettings;
      const sectionValue = settings[sectionKey] as Record<string, any> || {};
      
      setSettings({
        ...settings,
        [section]: {
          ...sectionValue,
          [field]: checked
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: checked
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold">Lỗi</h2>
          <p>Không thể tải cài đặt website. Vui lòng làm mới trang và thử lại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cài đặt Website</h1>
      
      {saveMessage && (
        <div className={`p-4 mb-6 rounded ${
          saveMessage.type === 'success' 
            ? 'bg-green-50 border border-green-400 text-green-700' 
            : 'bg-red-50 border border-red-400 text-red-700'
        }`}>
          <p>{saveMessage.text}</p>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="general">Thông tin chung</TabsTrigger>
          <TabsTrigger value="contact">Liên hệ</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chung</CardTitle>
                <CardDescription>
                  Cài đặt thông tin cơ bản của website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên website</Label>
                  <Input
                    id="name"
                    name="name"
                    value={settings.name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả website</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={settings.description || ''}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logo">URL Logo</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={settings.logo || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="favicon">URL Favicon</Label>
                  <Input
                    id="favicon"
                    name="favicon"
                    value={settings.favicon || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
                <CardDescription>
                  Cài đặt thông tin liên hệ hiển thị trên website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email liên hệ</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={settings.contactEmail || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Số điện thoại</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={settings.contactPhone || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={settings.address || ''}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Mạng xã hội</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="socialMedia.facebook">Facebook</Label>
                      <Input
                        id="socialMedia.facebook"
                        name="socialMedia.facebook"
                        value={settings.socialMedia?.facebook || ''}
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="socialMedia.instagram">Instagram</Label>
                      <Input
                        id="socialMedia.instagram"
                        name="socialMedia.instagram"
                        value={settings.socialMedia?.instagram || ''}
                        onChange={handleInputChange}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="socialMedia.youtube">YouTube</Label>
                      <Input
                        id="socialMedia.youtube"
                        name="socialMedia.youtube"
                        value={settings.socialMedia?.youtube || ''}
                        onChange={handleInputChange}
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="footer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Footer</CardTitle>
                <CardDescription>
                  Cài đặt thông tin hiển thị ở footer của website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="footer.copyright">Bản quyền</Label>
                  <Input
                    id="footer.copyright"
                    name="footer.copyright"
                    value={settings.footer?.copyright || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex items-center space-x-2 py-2">
                  <Switch
                    id="footer.showYear"
                    checked={settings.footer?.showYear !== false}
                    onCheckedChange={(checked) => 
                      handleSwitchChange('footer.showYear', checked)
                    }
                  />
                  <Label htmlFor="footer.showYear">Hiển thị năm hiện tại</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
                <CardDescription>
                  Cài đặt thông tin SEO cho website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo.title">Tiêu đề mặc định</Label>
                  <Input
                    id="seo.title"
                    name="seo.title"
                    value={settings.seo?.title || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seo.description">Mô tả mặc định</Label>
                  <Textarea
                    id="seo.description"
                    name="seo.description"
                    value={settings.seo?.description || ''}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seo.ogImage">Ảnh OG mặc định</Label>
                  <Input
                    id="seo.ogImage"
                    name="seo.ogImage"
                    value={settings.seo?.ogImage || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/og-image.png"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}

