'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userApi, CreateUserRequest } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateUserRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tính toán ngày tối đa cho phép (10 năm trước từ ngày hiện tại)
  const calculateMaxDate = (): string => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Xử lý đặc biệt cho trường ngày sinh
    if (name === 'birthDate') {
      // Lưu giá trị gốc để hiển thị trong input
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Kiểm tra định dạng ngày trên iOS đã được xử lý trong normalizeBirthDate
      console.log('Ngày sinh được nhập:', value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra ngày sinh hợp lệ
    if (formData.birthDate) {
      try {
        const birthDate = new Date(formData.birthDate);
        const maxDate = new Date(calculateMaxDate());
        
        if (birthDate > maxDate) {
          setError('Bạn phải đủ 10 tuổi để đăng ký tài khoản này.');
          return;
        }
      } catch (error) {
        console.error('Lỗi khi xử lý ngày sinh:', error);
        setError('Định dạng ngày sinh không hợp lệ. Vui lòng kiểm tra lại.');
        return;
      }
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const user = await userApi.create(formData);
      
      // Chuyển hướng đến trang xác thực email
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Đăng ký tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-white/70">
            Hoặc{' '}
            <Link href="/login" className="font-medium text-pink-400 hover:text-pink-300 transition">
              đăng nhập nếu bạn đã có tài khoản
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-400/20 border border-red-400/50 text-white px-4 py-3 rounded-lg relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-white/80 mb-1">
                  Họ
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition"
                  placeholder="Họ"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-white/80 mb-1">
                  Tên
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition"
                  placeholder="Tên"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition"
                placeholder="Địa chỉ email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-white/80 mb-1">
                Ngày sinh
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                pattern="\d{4}-\d{2}-\d{2}"
                required
                max={calculateMaxDate()}
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition"
                value={formData.birthDate}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-white/60">Nhập định dạng YYYY-MM-DD (ví dụ: 1997-02-09)</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                loading 
                  ? 'bg-purple-600/50' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition shadow-lg`}
              disabled={loading}
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : null}
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 