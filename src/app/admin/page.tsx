'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  NumerologyBasicData,
  NumerologyCompatibility,
  NumerologyTimeAnalysis 
} from '@/lib/numerology-db';
import { isAuthenticated, isAdmin } from '@/lib/auth';
import { Alert } from '@/components/ui/alert';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const authenticated = await isAuthenticated();
        
        if (!authenticated) {
          router.push('/login');
          return;
        }
        
        const adminAccess = await isAdmin();
        if (!adminAccess) {
          setError('Bạn không có quyền truy cập trang quản trị');
          return;
        }
        
        setError(null);
      } catch (err) {
        console.error("Lỗi kiểm tra xác thực:", err);
        setError('Có lỗi xảy ra khi xác thực. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert className="bg-red-100 border-red-400 text-red-700 p-4 rounded mb-4">
          {error}
        </Alert>
        <div className="text-center mt-4">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Quản lý dữ liệu Thần Số Học</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/basic-data" className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Dữ liệu cơ bản</h2>
          <p className="text-gray-600 mb-4">Quản lý thông tin về số chủ đạo và cung hoàng đạo</p>
          <div className="flex justify-end">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Quản lý</span>
          </div>
        </Link>

        <Link href="/admin/compatibility" className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Dữ liệu tương hợp</h2>
          <p className="text-gray-600 mb-4">Quản lý thông tin về sự tương hợp giữa các yếu tố</p>
          <div className="flex justify-end">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Quản lý</span>
          </div>
        </Link>

        <Link href="/admin/time-analysis" className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Phân tích thời gian</h2>
          <p className="text-gray-600 mb-4">Quản lý dữ liệu liên quan đến năm, tháng và ngày</p>
          <div className="flex justify-end">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Quản lý</span>
          </div>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Tạo dữ liệu từ ChatGPT</h2>
        <p className="text-gray-600 mb-4">
          Tạo dữ liệu mới từ ChatGPT API và lưu vào cơ sở dữ liệu MongoDB
        </p>
        <div className="flex gap-4">
          <Link href="/admin/generate-data" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md">
            Tạo dữ liệu mới
          </Link>
          <Link href="/admin/generator-settings" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md">
            Cấu hình generator
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Thống kê</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-700">Số chủ đạo</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-medium text-purple-700">Cung hoàng đạo</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-medium text-green-700">Dữ liệu tương hợp</h3>
            <p className="text-2xl font-bold">144+</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <h3 className="font-medium text-amber-700">Phân tích thời gian</h3>
            <p className="text-2xl font-bold">108+</p>
          </div>
        </div>
      </div>
    </div>
  );
} 