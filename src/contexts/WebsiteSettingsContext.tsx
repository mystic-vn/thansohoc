'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WebsiteSettings, websiteApi } from '@/lib/api';

type WebsiteSettingsContextType = {
  settings: WebsiteSettings | null;
  loading: boolean;
  error: string | null;
};

const WebsiteSettingsContext = createContext<WebsiteSettingsContextType>({
  settings: null,
  loading: true,
  error: null,
});

export const WebsiteSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await websiteApi.getSettings();
        console.log('🌐 WebsiteSettings đã tải:', data);
        setSettings(data);
      } catch (error) {
        console.error('Lỗi khi lấy cài đặt website:', error);
        setError('Không thể tải cài đặt website');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <WebsiteSettingsContext.Provider value={{ settings, loading, error }}>
      {children}
    </WebsiteSettingsContext.Provider>
  );
};

export const useWebsiteSettings = () => useContext(WebsiteSettingsContext);

// Hook tiện ích để lấy cài đặt footer
export const useFooterSettings = () => {
  const { settings, loading } = useWebsiteSettings();
  return {
    footerSettings: settings?.footer,
    contactEmail: settings?.contactEmail,
    contactPhone: settings?.contactPhone,
    address: settings?.address,
    socialMedia: settings?.socialMedia,
    loading,
  };
};

// Hook tiện ích để lấy cài đặt SEO
export const useSeoSettings = () => {
  const { settings, loading } = useWebsiteSettings();
  return {
    seoSettings: settings?.seo,
    loading,
  };
};

// Hook tiện ích để lấy thông tin liên hệ
export const useContactSettings = () => {
  const { settings, loading } = useWebsiteSettings();
  return {
    contactEmail: settings?.contactEmail,
    contactPhone: settings?.contactPhone,
    address: settings?.address,
    socialMedia: settings?.socialMedia,
    loading,
  };
}; 