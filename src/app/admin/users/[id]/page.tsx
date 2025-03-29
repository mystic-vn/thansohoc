'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowLeft, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { userApi } from '@/lib/api';

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const userId = parseInt(id, 10);
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userData = await userApi.getById(userId);
        setUser(userData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Có lỗi xảy ra khi tải thông tin người dùng. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]);

  const handleSoftDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await userApi.softDelete(userId);
        
        // Cập nhật lại thông tin người dùng
        const updatedUser = await userApi.getById(userId);
        setUser(updatedUser);
      } catch (err: any) {
        console.error(err);
        alert(err.message || 'Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại.');
      }
    }
  };

  const handleRestore = async () => {
    try {
      await userApi.restore(userId);
      
      // Cập nhật lại thông tin người dùng
      const updatedUser = await userApi.getById(userId);
      setUser(updatedUser);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Có lỗi xảy ra khi khôi phục người dùng. Vui lòng thử lại.');
    }
  };

  const handleHardDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn người dùng này? Hành động này không thể hoàn tác!')) {
      try {
        await userApi.hardDelete(userId);
        
        // Chuyển hướng về trang danh sách người dùng
        router.push('/admin/users');
      } catch (err: any) {
        console.error(err);
        alert(err.message || 'Có lỗi xảy ra khi xóa vĩnh viễn người dùng. Vui lòng thử lại.');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-600 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-700">Đang tải thông tin người dùng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Chi tiết người dùng</h1>
          <button
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded inline-flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Quay lại
          </button>
        </div>
        
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Chi tiết người dùng</h1>
          <button
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded inline-flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Quay lại
          </button>
        </div>
        
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Không tìm thấy thông tin người dùng.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Chi tiết người dùng</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded inline-flex items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Quay lại
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
            </div>
            
            <div className="flex space-x-2">
              {!user.isDeleted ? (
                <>
                  <Link 
                    href={`/admin/users/edit/${user.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-flex items-center"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" /> Chỉnh sửa
                  </Link>
                  <button
                    onClick={handleSoftDelete}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded inline-flex items-center"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" /> Xóa
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleRestore}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded inline-flex items-center"
                  >
                    <FontAwesomeIcon icon={faUndo} className="mr-2" /> Khôi phục
                  </button>
                  <button
                    onClick={handleHardDelete}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded inline-flex items-center"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" /> Xóa vĩnh viễn
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cá nhân</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 block">Họ và tên:</span>
                  <span className="text-base text-gray-900">{user.firstName} {user.lastName}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block">Email:</span>
                  <span className="text-base text-gray-900">{user.email}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block">Vai trò:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role === 'Admin' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block">Ngày sinh:</span>
                  <span className="text-base text-gray-900">
                    {user.birthDate ? new Date(user.birthDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Trạng thái tài khoản</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 block">Trạng thái:</span>
                  {user.isDeleted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Đã xóa
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Hoạt động
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block">Xác minh email:</span>
                  {user.isEmailVerified ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Đã xác minh
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Chưa xác minh
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block">Ngày tạo:</span>
                  <span className="text-base text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : 'N/A'}
                  </span>
                </div>
                {user.updatedAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">Cập nhật lần cuối:</span>
                    <span className="text-base text-gray-900">
                      {new Date(user.updatedAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                )}
                {user.deletedAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">Ngày xóa:</span>
                    <span className="text-base text-gray-900">
                      {new Date(user.deletedAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 