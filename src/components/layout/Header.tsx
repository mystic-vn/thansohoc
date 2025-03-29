'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { userApi } from '@/lib/api';
import { removeCookie } from '@/lib/cookies';

interface HeaderProps {
  isAuthenticated: boolean;
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, userName }) => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    userApi.logout();
    removeCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token');
    router.push('/login');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="bg-black/30 backdrop-blur-md">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-xl font-bold">Thần Số Học</div>
        </Link>
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/numerology" className="px-4 py-2 rounded hover:bg-indigo-600/30 transition">
                Thần Số Học
              </Link>
              <Link href="/astrology" className="px-4 py-2 rounded hover:bg-indigo-600/30 transition">
                Cung Hoàng Đạo
              </Link>
              <div className="relative">
                <button 
                  onClick={toggleMenu}
                  className="flex items-center px-4 py-2 rounded hover:bg-indigo-600/30 transition"
                >
                  <span className="mr-1">Xin chào, {userName}</span>
                  <FiUser className="ml-1 text-xs" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link 
                      href="/profile"
                      className="flex items-center w-full text-gray-700 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <FiUser className="mr-2" />
                      Trang cá nhân
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-gray-700 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <FiLogOut className="mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 rounded hover:bg-indigo-600/30 transition">
                Đăng nhập
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full hover:from-indigo-600 hover:to-purple-700 transition"
              >
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 