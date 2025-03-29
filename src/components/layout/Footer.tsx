'use client';

import React from 'react';
import Link from 'next/link';
import { useFooterSettings } from '@/contexts/WebsiteSettingsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const { footerSettings, contactEmail, contactPhone, socialMedia, loading } = useFooterSettings();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Thần Số Học</h2>
            <p className="text-white/80 max-w-md">
              Khám phá con người thật của bạn và những bí ẩn trong cuộc sống thông qua Thần Số Học và Chiêm tinh học.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Liên kết</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-white/80 hover:text-pink-300 transition">Trang chủ</Link></li>
                <li><Link href="/numerology" className="text-white/80 hover:text-pink-300 transition">Thần Số Học</Link></li>
                <li><Link href="/astrology" className="text-white/80 hover:text-pink-300 transition">Chiêm Tinh</Link></li>
                <li><Link href="/about" className="text-white/80 hover:text-pink-300 transition">Giới thiệu</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Liên hệ</h3>
              <ul className="space-y-2">
                <li className="text-white/80">Email: {loading ? 'Đang tải...' : contactEmail || 'contact@thansohoc.vn'}</li>
                {contactPhone && (
                  <li className="text-white/80">Điện thoại: {contactPhone}</li>
                )}
                <li className="flex space-x-4 mt-4">
                  {socialMedia?.facebook && (
                    <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-pink-300 transition">
                      <FontAwesomeIcon icon={faFacebook} size="lg" />
                    </a>
                  )}
                  
                  {socialMedia?.twitter && (
                    <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-pink-300 transition">
                      <FontAwesomeIcon icon={faTwitter} size="lg" />
                    </a>
                  )}
                  
                  {socialMedia?.instagram && (
                    <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-pink-300 transition">
                      <FontAwesomeIcon icon={faInstagram} size="lg" />
                    </a>
                  )}
                  
                  {socialMedia?.youtube && (
                    <a href={socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-pink-300 transition">
                      <FontAwesomeIcon icon={faYoutube} size="lg" />
                    </a>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/60">
            {loading 
              ? 'Đang tải...' 
              : footerSettings?.copyright
                ? `${footerSettings.copyright}${footerSettings.showYear ? ` © ${currentYear}` : ''}`
                : `© ${currentYear} Thần Số Học. Tất cả các quyền được bảo lưu.`
            }
          </p>
        </div>
      </div>
    </footer>
  );
} 