'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faUsers, 
  faChartPie, 
  faCog, 
  faBars, 
  faSignOutAlt,
  faUser,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    // Xóa token từ localStorage
    localStorage.removeItem('token');
    // Chuyển hướng về trang đăng nhập
    window.location.href = '/admin';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-indigo-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-semibold">Thần Số Học</h1>
          ) : (
            <h1 className="text-xl font-semibold">TSH</h1>
          )}
          <button onClick={toggleSidebar} className="text-white hover:text-indigo-200">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            <li>
              <Link href="/admin/dashboard" className={`flex items-center p-3 rounded-lg ${isActive('/admin/dashboard') ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}>
                <FontAwesomeIcon icon={faTachometerAlt} className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                {sidebarOpen && <span>Tổng quan</span>}
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className={`flex items-center p-3 rounded-lg ${isActive('/admin/users') ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}>
                <FontAwesomeIcon icon={faUsers} className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                {sidebarOpen && <span>Người dùng</span>}
              </Link>
            </li>
            <li>
              <Link href="/admin/analytics" className={`flex items-center p-3 rounded-lg ${isActive('/admin/analytics') ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}>
                <FontAwesomeIcon icon={faChartPie} className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                {sidebarOpen && <span>Phân tích</span>}
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" className={`flex items-center p-3 rounded-lg ${isActive('/admin/settings') ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}>
                <FontAwesomeIcon icon={faCog} className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                {sidebarOpen && <span>Cài đặt</span>}
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-indigo-700">
          <button 
            onClick={handleLogout}
            className={`flex items-center p-3 rounded-lg hover:bg-indigo-700 w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className={`${sidebarOpen ? 'mr-3' : ''}`} />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {pathname === '/admin/dashboard' && 'Tổng quan'}
                {pathname === '/admin/users' && 'Quản lý người dùng'}
                {pathname === '/admin/analytics' && 'Phân tích'}
                {pathname === '/admin/settings' && 'Cài đặt'}
                {pathname.startsWith('/admin/users/') && 'Chi tiết người dùng'}
              </h2>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                {sidebarOpen && (
                  <>
                    <span className="text-gray-700">Admin</span>
                    <FontAwesomeIcon 
                      icon={userMenuOpen ? faChevronUp : faChevronDown} 
                      className="text-gray-500 text-xs"
                    />
                  </>
                )}
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Thông tin cá nhân
                  </Link>
                  <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Cài đặt
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 