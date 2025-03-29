'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserCheck, faUserClock, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { userApi } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className={`h-12 w-12 rounded-full ${color} flex items-center justify-center text-white`}>
        <FontAwesomeIcon icon={icon} className="text-xl" />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    deletedUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const users = await userApi.getAll();
        
        // Tính toán thống kê
        const totalUsers = users.length;
        const verifiedUsers = users.filter(user => user.isEmailVerified).length;
        const unverifiedUsers = users.filter(user => !user.isEmailVerified).length;
        const deletedUsers = users.filter(user => user.isDeleted).length;
        
        setStats({
          totalUsers,
          verifiedUsers,
          unverifiedUsers,
          deletedUsers,
        });
        
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tổng quan</h1>
      
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : loading ? (
        <LoadingSpinner 
          fullScreen={false}
          message="Đang tải dữ liệu tổng quan..." 
          showTips={false}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Tổng số người dùng" 
              value={stats.totalUsers} 
              icon={faUsers} 
              color="bg-blue-500"
            />
            <StatCard 
              title="Đã xác minh" 
              value={stats.verifiedUsers} 
              icon={faUserCheck} 
              color="bg-green-500"
            />
            <StatCard 
              title="Chưa xác minh" 
              value={stats.unverifiedUsers} 
              icon={faUserClock} 
              color="bg-yellow-500"
            />
            <StatCard 
              title="Đã xóa" 
              value={stats.deletedUsers} 
              icon={faUserSlash} 
              color="bg-red-500"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4">Hoạt động gần đây</h2>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-500 text-center py-6">Chưa có hoạt động nào gần đây</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 