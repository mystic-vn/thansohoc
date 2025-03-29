'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { userApi, VerifyEmailRequest } from '@/lib/api';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Tự động đếm ngược khi gửi lại OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Xử lý xác thực OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Không tìm thấy email để xác thực. Vui lòng thử lại.');
      return;
    }

    const verifyData: VerifyEmailRequest = {
      email,
      otp,
    };

    try {
      setLoading(true);
      setError(null);
      
      const user = await userApi.verifyEmail(verifyData);
      
      setSuccess(true);
      // Sau 3 giây sẽ chuyển hướng đến trang chính
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra khi xác thực. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý gửi lại OTP
  const handleResendOtp = async () => {
    if (!email) {
      setError('Không tìm thấy email để gửi OTP. Vui lòng thử lại.');
      return;
    }

    try {
      setResendLoading(true);
      setError(null);
      
      await userApi.resendOtp({ email });
      
      setResendSuccess(true);
      // Đặt thời gian chờ 60 giây trước khi có thể gửi lại OTP
      setCountdown(60);
      
      // Sau 5 giây ẩn thông báo thành công
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra khi gửi lại OTP. Vui lòng thử lại.');
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-2xl">
          <div className="bg-green-400/20 border border-green-400/50 text-white px-6 py-4 rounded-lg relative" role="alert">
            <h2 className="text-lg font-medium">Xác thực email thành công!</h2>
            <p className="mt-2">Tài khoản của bạn đã được kích hoạt.</p>
            <p className="mt-2">Đang chuyển hướng đến trang chính...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Xác thực email
          </h2>
          <p className="mt-2 text-center text-sm text-white/70">
            Vui lòng nhập mã xác thực gồm 6 chữ số đã được gửi đến email của bạn
          </p>
          <p className="mt-2 text-center text-sm text-white/70">
            <span className="font-medium">{email}</span>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-400/20 border border-red-400/50 text-white px-4 py-3 rounded-lg relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {resendSuccess && (
          <div className="bg-green-400/20 border border-green-400/50 text-white px-4 py-3 rounded-lg relative" role="alert">
            <span className="block sm:inline">Mã OTP mới đã được gửi đến email của bạn.</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-white/80 mb-1">
              Mã xác thực
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition text-center tracking-wider text-lg"
              placeholder="Nhập mã 6 chữ số"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]{6}"
            />
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
              {loading ? 'Đang xử lý...' : 'Xác thực'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <button 
            onClick={handleResendOtp}
            disabled={resendLoading || countdown > 0}
            className={`text-sm font-medium ${
              resendLoading || countdown > 0
                ? 'text-white/40 cursor-not-allowed'
                : 'text-pink-400 hover:text-pink-300 transition'
            }`}
          >
            {resendLoading ? 'Đang gửi...' : countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã xác thực'}
          </button>
        </div>
        
        <div className="text-center mt-4">
          <Link 
            href="/"
            className="text-sm font-medium text-white/70 hover:text-white transition"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
} 