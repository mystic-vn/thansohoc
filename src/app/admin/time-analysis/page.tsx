'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NumerologyTimeAnalysis } from '@/lib/numerology-db';

export default function TimeAnalysisPage() {
  const [selectedType, setSelectedType] = useState<string>('life-path-year');
  const [data, setData] = useState<NumerologyTimeAnalysis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const timeTypes = [
    { id: 'life-path-year', name: 'Số chủ đạo - Năm' },
    { id: 'universal-year', name: 'Năm toàn cầu' },
    { id: 'personal-month', name: 'Tháng cá nhân' },
    { id: 'personal-day', name: 'Ngày cá nhân' },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/numerology/time-analysis?type=${selectedType}`);
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
  }, [selectedType]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Quản lý phân tích thời gian</h1>
        <Link href="/admin" className="text-blue-600 hover:underline">
          &larr; Quay lại
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            {timeTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeChange(type.id)}
                className={`px-4 py-2 rounded-md ${
                  selectedType === type.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
          <Link
            href={`/admin/time-analysis/add?type=${selectedType}`}
            className="bg-green-600 text-white px-4 py-2 rounded-md"
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
                  <th className="py-3 px-4 text-left">Mã</th>
                  <th className="py-3 px-4 text-left">Tiêu đề</th>
                  {selectedType === 'life-path-year' && (
                    <>
                      <th className="py-3 px-4 text-left">Số chủ đạo</th>
                      <th className="py-3 px-4 text-left">Năm cá nhân</th>
                    </>
                  )}
                  {selectedType === 'universal-year' && (
                    <th className="py-3 px-4 text-left">Năm</th>
                  )}
                  <th className="py-3 px-4 text-left">Ngày tạo</th>
                  <th className="py-3 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item._id?.toString() || Math.random().toString()} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{item.code}</td>
                    <td className="py-3 px-4">{item.title}</td>
                    {selectedType === 'life-path-year' && (
                      <>
                        <td className="py-3 px-4">{item.lifePathNumber}</td>
                        <td className="py-3 px-4">{item.personalYear}</td>
                      </>
                    )}
                    {selectedType === 'universal-year' && (
                      <td className="py-3 px-4">{item.year}</td>
                    )}
                    <td className="py-3 px-4">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link
                          href={`/admin/time-analysis/edit/${item._id?.toString()}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
                              // Implement delete functionality
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Xóa
                        </button>
                        <Link
                          href={`/admin/time-analysis/view/${item._id?.toString()}`}
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