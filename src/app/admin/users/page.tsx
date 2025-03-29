'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faUndo, faEye } from '@fortawesome/free-solid-svg-icons';
import { userApi } from '@/lib/api';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [deletedFilter, setDeletedFilter] = useState<'all' | 'active' | 'deleted'>('active');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getAll();
      setUsers(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra khi tải danh sách người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (userId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await userApi.softDelete(userId);
        // Cập nhật lại danh sách người dùng
        fetchUsers();
      } catch (err: any) {
        console.error(err);
        alert(err.message || 'Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại.');
      }
    }
  };

  const handleHardDelete = async (userId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn người dùng này? Hành động này không thể hoàn tác!')) {
      try {
        await userApi.hardDelete(userId);
        // Cập nhật lại danh sách người dùng
        fetchUsers();
      } catch (err: any) {
        console.error(err);
        alert(err.message || 'Có lỗi xảy ra khi xóa vĩnh viễn người dùng. Vui lòng thử lại.');
      }
    }
  };

  const handleRestore = async (userId: number) => {
    try {
      await userApi.restore(userId);
      // Cập nhật lại danh sách người dùng
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Có lỗi xảy ra khi khôi phục người dùng. Vui lòng thử lại.');
    }
  };

  // Lọc người dùng dựa trên các bộ lọc hiện tại
  const filteredUsers = users.filter(user => {
    // Lọc theo từ khóa tìm kiếm
    const searchMatch = 
      searchTerm === '' || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Lọc theo trạng thái xác minh email
    let statusMatch = true;
    if (statusFilter === 'verified') {
      statusMatch = user.isEmailVerified === true;
    } else if (statusFilter === 'unverified') {
      statusMatch = user.isEmailVerified === false;
    }
    
    // Lọc theo trạng thái xóa
    let deletedMatch = true;
    if (deletedFilter === 'active') {
      deletedMatch = user.isDeleted === false;
    } else if (deletedFilter === 'deleted') {
      deletedMatch = user.isDeleted === true;
    }
    
    return searchMatch && statusMatch && deletedMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Quản lý người dùng</h1>
        <Link href="/admin/users/new" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded inline-flex items-center">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Thêm người dùng
        </Link>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="mb-6 bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Tìm kiếm</label>
            <input
              type="text"
              id="search"
              placeholder="Tìm kiếm theo tên, email..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Trạng thái</label>
              <select
                id="statusFilter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'verified' | 'unverified')}
              >
                <option value="all">Tất cả</option>
                <option value="verified">Đã xác minh</option>
                <option value="unverified">Chưa xác minh</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="deletedFilter" className="block text-sm font-medium text-gray-700">Hiển thị</label>
              <select
                id="deletedFilter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={deletedFilter}
                onChange={(e) => setDeletedFilter(e.target.value as 'all' | 'active' | 'deleted')}
              >
                <option value="active">Người dùng hoạt động</option>
                <option value="deleted">Người dùng đã xóa</option>
                <option value="all">Tất cả</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-600 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-700">Đang tải danh sách người dùng...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy người dùng nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Họ tên
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày sinh
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={user.isDeleted ? 'bg-gray-100' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      {user.isEmailVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Đã xác minh
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Chưa xác minh
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.birthDate ? new Date(user.birthDate).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role === 'Admin' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Quản trị viên
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Người dùng
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.isDeleted ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Đã xóa
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Hoạt động
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/admin/users/${user.id}`} className="text-indigo-600 hover:text-indigo-900" title="Xem chi tiết">
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                        
                        {!user.isDeleted && (
                          <>
                            <Link href={`/admin/users/edit/${user.id}`} className="text-blue-600 hover:text-blue-900" title="Chỉnh sửa">
                              <FontAwesomeIcon icon={faEdit} />
                            </Link>
                            <button 
                              onClick={() => handleSoftDelete(user.id)} 
                              className="text-red-600 hover:text-red-900"
                              title="Xóa"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </>
                        )}
                        
                        {user.isDeleted && (
                          <>
                            <button 
                              onClick={() => handleRestore(user.id)} 
                              className="text-green-600 hover:text-green-900"
                              title="Khôi phục"
                            >
                              <FontAwesomeIcon icon={faUndo} />
                            </button>
                            <button 
                              onClick={() => handleHardDelete(user.id)} 
                              className="text-red-600 hover:text-red-900"
                              title="Xóa vĩnh viễn"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 