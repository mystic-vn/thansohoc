'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NumerologyCompatibility } from '@/lib/numerology-db';

export default function CompatibilityPage() {
  const [type, setType] = useState<string>('life-path-life-path');
  const [data, setData] = useState<NumerologyCompatibility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const compatibilityTypes = [
    { id: 'life-path-life-path', name: 'Số chủ đạo - Số chủ đạo' },
    { id: 'life-path-zodiac', name: 'Số chủ đạo - Cung hoàng đạo' },
    { id: 'zodiac-zodiac', name: 'Cung hoàng đạo - Cung hoàng đạo' },
    { id: 'expression-life-path', name: 'Số biểu đạt - Số chủ đạo' },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Đơn giản hóa: Trong thực tế, API này sẽ phải hỗ trợ phân trang, lọc, v.v.
        const response = await fetch(`/api/numerology/compatibility?type=${type}`);
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu');
        }
        const data = await response.json();
        setData(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi');
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [type]);

  const handleTypeChange = (selectedType: string) => {
    setType(selectedType);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Quản lý dữ liệu tương hợp</h1>
        <Link href="/admin" className="text-blue-600 hover:underline">
          &larr; Quay lại
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {compatibilityTypes.map((compatType) => (
              <button
                key={compatType.id}
                onClick={() => handleTypeChange(compatType.id)}
                className={`px-4 py-2 rounded-md whitespace-nowrap ${
                  type === compatType.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {compatType.name}
              </button>
            ))}
          </div>
          <Link
            href={`/admin/compatibility/add?type=${type}`}
            className="bg-green-600 text-white px-4 py-2 rounded-md whitespace-nowrap"
          >
            + Thêm mới
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="spinner"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Không có dữ liệu nào. Hãy thêm dữ liệu mới.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Yếu tố 1</th>
                  <th className="py-3 px-4 text-left">Yếu tố 2</th>
                  <th className="py-3 px-4 text-left">Điểm tương hợp</th>
                  <th className="py-3 px-4 text-left">Ngày tạo</th>
                  <th className="py-3 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item._id?.toString() || Math.random().toString()} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{item.factor1}</td>
                    <td className="py-3 px-4">{item.factor2}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-purple-600 h-2.5 rounded-full"
                            style={{ width: `${(item.compatibilityScore || 0) * 10}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{item.compatibilityScore}/10</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link
                          href={`/admin/compatibility/edit/${item._id?.toString()}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
                              // Handle delete functionality
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Xóa
                        </button>
                        <Link
                          href={`/admin/compatibility/view/${item._id?.toString()}`}
                          className="text-green-600 hover:text-green-800"
                        >
                          Xem
                        </Link>
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