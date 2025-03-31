'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userApi, CreateUserRequest } from '@/lib/api';

interface BirthDateComponents {
  day: string;
  month: string;
  year: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateUserRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
  });
  const [birthDateComponents, setBirthDateComponents] = useState<BirthDateComponents>({
    day: '',
    month: '',
    year: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tính toán năm tối thiểu và tối đa cho dropdown
  const calculateYearRange = (): { minYear: number; maxYear: number } => {
    const today = new Date();
    const maxYear = today.getFullYear() - 10; // Người dùng phải đủ 10 tuổi
    const minYear = maxYear - 90; // Giả sử người dùng không quá 100 tuổi
    return { minYear, maxYear };
  };

  // Tạo mảng số từ min đến max
  const range = (min: number, max: number): number[] => {
    const result = [];
    for (let i = min; i <= max; i++) {
      result.push(i);
    }
    return result;
  };

  // Tạo mảng ngày từ 1-31
  const days = range(1, 31);
  
  // Tạo mảng tháng từ 1-12
  const months = range(1, 12);
  
  // Tạo mảng năm từ minYear đến maxYear
  const { minYear, maxYear } = calculateYearRange();
  const years = range(minYear, maxYear).reverse(); // Đảo ngược để hiển thị năm gần đây nhất lên đầu

  // Lấy số ngày tối đa trong tháng
  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month, 0).getDate();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Xử lý đặc biệt cho trường ngày sinh
    if (name === 'day' || name === 'month' || name === 'year') {
      const updatedBirthDateComponents = {
        ...birthDateComponents,
        [name]: value,
      };
      
      setBirthDateComponents(updatedBirthDateComponents);
      
      // Chỉ cập nhật formData.birthDate khi đã có đủ ngày, tháng, năm
      if (updatedBirthDateComponents.day && updatedBirthDateComponents.month && updatedBirthDateComponents.year) {
        try {
          // Format YYYY-MM-DD
          const formattedDate = `${updatedBirthDateComponents.year}-${updatedBirthDateComponents.month.padStart(2, '0')}-${updatedBirthDateComponents.day.padStart(2, '0')}`;
          
          // Kiểm tra tính hợp lệ của ngày tháng
          const dateObj = new Date(formattedDate);
          if (isNaN(dateObj.getTime())) {
            console.error('Ngày tháng không hợp lệ:', formattedDate);
            return;
          }
          
          setFormData(prev => ({ ...prev, birthDate: formattedDate }));
          console.log('Ngày sinh được cập nhật:', formattedDate);
        } catch (error) {
          console.error('Lỗi khi định dạng ngày sinh:', error);
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra xem đã chọn đủ ngày tháng năm chưa
    if (!birthDateComponents.day || !birthDateComponents.month || !birthDateComponents.year) {
      setError('Vui lòng chọn đầy đủ ngày, tháng và năm sinh');
      return;
    }
    
    // Kiểm tra ngày sinh hợp lệ
    if (formData.birthDate) {
      try {
        const birthDate = new Date(formData.birthDate);
        const maxDate = new Date(new Date().getFullYear() - 10, new Date().getMonth(), new Date().getDate());
        
        if (isNaN(birthDate.getTime())) {
          setError('Ngày sinh không hợp lệ');
          return;
        }
        
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
      
      console.log('Đang gửi dữ liệu đăng ký:', {
        ...formData,
        password: '******' // Ẩn mật khẩu trong log
      });
      
      const user = await userApi.create(formData);
      console.log('Đăng ký thành công:', user);
      
      // Chuyển hướng đến trang xác thực email
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      console.error('Chi tiết lỗi đăng ký:', err);
      let errorMessage = 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.';
      
      // Xử lý các trường hợp lỗi cụ thể
      if (err.message?.includes('email')) {
        errorMessage = 'Email này đã được sử dụng. Vui lòng dùng email khác.';
      } else if (err.message?.includes('password')) {
        errorMessage = 'Mật khẩu không đủ mạnh. Vui lòng sử dụng ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.';
      } else if (err.message?.includes('Network Error') || err.message?.includes('timeout')) {
        errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn và thử lại.';
      }
      
      setError(errorMessage);
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
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <select
                    id="day"
                    name="day"
                    required
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition"
                    value={birthDateComponents.day}
                    onChange={handleChange}
                  >
                    <option value="">Ngày</option>
                    {days.map(day => (
                      <option key={day} value={String(day).padStart(2, '0')}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    id="month"
                    name="month"
                    required
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition"
                    value={birthDateComponents.month}
                    onChange={handleChange}
                  >
                    <option value="">Tháng</option>
                    {months.map(month => (
                      <option key={month} value={String(month).padStart(2, '0')}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    id="year"
                    name="year"
                    required
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition"
                    value={birthDateComponents.year}
                    onChange={handleChange}
                  >
                    <option value="">Năm</option>
                    {years.map(year => (
                      <option key={year} value={String(year)}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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