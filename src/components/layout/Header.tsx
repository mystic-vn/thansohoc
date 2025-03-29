'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWebsiteSettings } from '@/contexts/WebsiteSettingsContext';
import { isAuthenticated, isAdmin } from '@/lib/auth';
import { deleteCookie } from '@/lib/cookies';

export default function Header() {
  const { settings, loading } = useWebsiteSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setLoggedIn(authenticated);
      
      if (authenticated) {
        const admin = await isAdmin();
        setIsUserAdmin(admin);
      }
    };
    
    checkAuth();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Xóa token từ localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // Xóa cookie xác thực
    const cookieName = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token';
    deleteCookie(cookieName);
    
    // Chuyển hướng về trang chủ
    window.location.href = '/';
  };

  return (
    <header className="bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800 text-white py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            {settings?.logo ? (
              <Image 
                src={settings.logo} 
                alt={settings?.name || 'Thần Số Học'} 
                width={40} 
                height={40} 
                className="rounded-full" 
              />
            ) : (
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
                T
              </div>
            )}
            <span className="text-xl font-bold">{settings?.name || 'Thần Số Học'}</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-pink-300 transition">Trang chủ</Link>
            <Link href="/numerology" className="hover:text-pink-300 transition">Thần Số Học</Link>
            <Link href="/astrology" className="hover:text-pink-300 transition">Chiêm Tinh</Link>
            
            {loggedIn ? (
              <div className="relative group">
                <button className="hover:text-pink-300 transition">
                  Tài khoản
                </button>
                <div className="absolute right-0 top-6 w-48 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="h-2"></div>
                  <div className="bg-indigo-900 rounded-md shadow-lg py-1">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-white hover:bg-purple-800">
                      Hồ sơ
                    </Link>
                    {isUserAdmin && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-white hover:bg-purple-800">
                        Quản trị
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-purple-800"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hover:text-pink-300 transition">Đăng nhập</Link>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-white"
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 border-t border-white/20 pt-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="hover:text-pink-300 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link 
                href="/numerology" 
                className="hover:text-pink-300 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Thần Số Học
              </Link>
              <Link 
                href="/astrology" 
                className="hover:text-pink-300 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Chiêm Tinh
              </Link>
              
              {loggedIn ? (
                <>
                  <Link 
                    href="/profile" 
                    className="hover:text-pink-300 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Hồ sơ
                  </Link>
                  {isUserAdmin && (
                    <Link 
                      href="/admin" 
                      className="hover:text-pink-300 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Quản trị
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="text-left hover:text-pink-300 transition"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="hover:text-pink-300 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 