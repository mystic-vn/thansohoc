'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isAuthenticated, isAdmin } from '@/lib/auth';

export default function MigrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Kiểm tra xác thực phía client
        const auth = await isAuthenticated();
        const admin = await isAdmin();
        
        console.log('Kiểm tra xác thực:', { auth, admin });
        
        if (!auth) {
          console.log('Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập');
          router.push('/login');
          return;
        }
        
        if (!admin) {
          console.log('Người dùng không có quyền admin, chuyển hướng đến trang chủ');
          router.push('/');
          return;
        }
        
        setAuthenticated(true);
        
        // Lấy thông tin về tiến trình di chuyển dữ liệu
        await fetchStatus();
      } catch (error) {
        console.error('Lỗi khi kiểm tra xác thực:', error);
        setError('Không thể xác thực. Vui lòng đăng nhập lại.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const fetchStatus = async () => {
    try {
      console.log('Đang lấy trạng thái di chuyển dữ liệu...');
      const response = await fetch('/api/migration');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể lấy trạng thái di chuyển dữ liệu');
      }
      
      const data = await response.json();
      console.log('Đã nhận trạng thái:', data);
      setStatus(data.stats);
    } catch (error: any) {
      console.error('Lỗi khi lấy trạng thái:', error);
      setError(`Không thể lấy thông tin trạng thái di chuyển dữ liệu: ${error.message}`);
    }
  };

  const startMigration = async () => {
    setMigrating(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log('Bắt đầu quá trình di chuyển dữ liệu...');
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }
      
      const response = await fetch('/api/migration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Lỗi khi di chuyển dữ liệu');
      }
      
      const result = await response.json();
      console.log('Kết quả di chuyển dữ liệu:', result);
      setSuccess(`Di chuyển dữ liệu thành công! Đã di chuyển ${result.stats.lifePath.migrated} số chủ đạo và ${result.stats.zodiac.migrated} cung hoàng đạo.`);
      
      // Cập nhật trạng thái
      await fetchStatus();
    } catch (error: any) {
      console.error('Lỗi khi di chuyển dữ liệu:', error);
      setError(`Lỗi khi di chuyển dữ liệu: ${error.message}`);
    } finally {
      setMigrating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert variant="destructive">
          <AlertTitle>Lỗi xác thực</AlertTitle>
          <AlertDescription>
            Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản admin.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Di chuyển dữ liệu</h1>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin hiện tại</h2>
          
          {status ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Dữ liệu cũ</p>
                  <p className="text-2xl font-bold">{status.oldData}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Số chủ đạo</p>
                  <p className="text-2xl font-bold">{status.lifePath}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${status.progress.lifePath}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{Math.round(status.progress.lifePath)}% hoàn thành</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Cung hoàng đạo</p>
                  <p className="text-2xl font-bold">{status.zodiac}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${status.progress.zodiac}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{Math.round(status.progress.zodiac)}% hoàn thành</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Đang tải thông tin...</p>
          )}
        </CardContent>
      </Card>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertTitle>Thành công</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col space-y-4">
        <Button
          onClick={startMigration}
          disabled={migrating}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {migrating ? 'Đang di chuyển dữ liệu...' : 'Bắt đầu di chuyển dữ liệu'}
        </Button>
        
        <Button
          onClick={fetchStatus}
          variant="outline"
          className="border-gray-300"
        >
          Làm mới trạng thái
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="text-lg font-semibold text-amber-800 mb-2">Lưu ý quan trọng</h3>
        <ul className="list-disc list-inside space-y-2 text-amber-700">
          <li>Di chuyển dữ liệu sẽ sao chép dữ liệu từ collection cũ sang collection mới.</li>
          <li>Dữ liệu cũ vẫn được giữ nguyên để đảm bảo tính khả dụng của hệ thống.</li>
          <li>Quá trình này có thể mất thời gian nếu có nhiều dữ liệu.</li>
          <li>API sẽ tự động sử dụng dữ liệu từ collection mới nếu có.</li>
        </ul>
      </div>
    </div>
  );
} 