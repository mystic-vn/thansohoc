'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('Đang đăng nhập...');
    
    const apiUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3001/auth/login'
      : 'https://thansohoc.mystic.vn/api/auth/login';
    
    console.log('Đang gửi yêu cầu đến:', apiUrl);
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      console.log('Status code:', response.status);
      
      // Lưu toàn bộ response text để debug
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Máy chủ trả về dữ liệu không hợp lệ');
      }
      
      if (!response.ok || !data.token) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
      
      setMessage('Đăng nhập thành công! Đang chuyển hướng...');
      
      // Lưu token bằng tất cả các phương pháp có thể
      const token = data.token;
      
      // Phương pháp 1: sessionStorage (hoạt động tốt trên mobile)
      try { sessionStorage.setItem('token', token); } catch (e) { console.error(e); }
      
      // Phương pháp 2: localStorage (có thể bị hạn chế trên mobile)
      try { localStorage.setItem('token', token); } catch (e) { console.error(e); }
      
      // Phương pháp 3: Cookie (phương pháp dự phòng)
      try {
        document.cookie = `token=${token}; path=/; max-age=604800`;
      } catch (e) { console.error(e); }
      
      // Lưu thông tin người dùng cơ bản
      if (data.firstName || data.lastName) {
        try {
          sessionStorage.setItem('userName', `${data.firstName || ''} ${data.lastName || ''}`.trim());
        } catch (e) { console.error(e); }
      }
      
      // Đảm bảo chuyển hướng hoạt động
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
    } catch (err) {
      console.error('Lỗi:', err);
      setError(err.message || 'Đăng nhập không thành công');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Đăng nhập</h2>
        
        {error && (
          <div className="bg-red-400/20 border border-red-400 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-blue-400/20 border border-blue-400 text-white p-3 rounded-lg mb-4">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-white mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-white">Ghi nhớ</label>
            </div>
            <Link href="/forgot-password" className="text-pink-400 hover:text-pink-300">
              Quên mật khẩu?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium ${loading ? 'opacity-70' : 'hover:from-indigo-600 hover:to-purple-700'}`}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
        
        <p className="text-center text-white mt-4">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-pink-400 hover:text-pink-300">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
} 