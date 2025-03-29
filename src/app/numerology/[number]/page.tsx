'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';

// Thêm một bản đồ biểu tượng và hình ảnh
const LIFE_PATH_IMAGES: Record<string, string> = {
  '1': '/images/numerology/lifepath-1.png',
  '2': '/images/numerology/lifepath-2.png',
  '3': '/images/numerology/lifepath-3.png',
  '4': '/images/numerology/lifepath-4.png',
  '5': '/images/numerology/lifepath-5.png',
  '6': '/images/numerology/lifepath-6.png',
  '7': '/images/numerology/lifepath-7.png',
  '8': '/images/numerology/lifepath-8.png',
  '9': '/images/numerology/lifepath-9.png',
  '11': '/images/numerology/lifepath-11.png',
  '22': '/images/numerology/lifepath-22.png',
  '33': '/images/numerology/lifepath-33.png',
};

// Mảng các số chủ đạo để navigation
const LIFE_PATH_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '22', '33'];

export default function LifePathDetailPage() {
  const params = useParams();
  const number = params.number as string;
  
  const [lifePathData, setLifePathData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLifePathData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/numerology?type=lifepath&code=${number}`);
        
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu số chủ đạo');
        }
        
        const data = await response.json();
        setLifePathData(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu số chủ đạo:', err);
        setError('Không thể tải dữ liệu số chủ đạo');
        setLoading(false);
      }
    };

    if (number) {
      fetchLifePathData();
    }
  }, [number]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !lifePathData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-white mb-4">Đã xảy ra lỗi</h1>
        <p className="text-white mb-8">{error || 'Không tìm thấy dữ liệu số chủ đạo'}</p>
        <Link href="/numerology" className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
          Quay lại trang thần số học
        </Link>
      </div>
    );
  }

  // Lấy hình ảnh của số chủ đạo
  const lifePathImagePath = LIFE_PATH_IMAGES[number] || '';

  // Xử lý các trường dữ liệu để hiển thị
  const {
    title, overview, traits, strengths, weaknesses, details, symbols, 
    famous_people, compatibility, lucky_elements
  } = lifePathData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-xl font-bold">Thần Số Học</div>
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className="px-4 py-2 rounded hover:bg-indigo-600/30 transition">
              Trang chủ
            </Link>
            <Link href="/astrology" className="px-4 py-2 rounded hover:bg-indigo-600/30 transition">
              Cung Hoàng Đạo
            </Link>
            <Link href="/numerology" className="px-4 py-2 rounded hover:bg-indigo-600/30 transition">
              Thần Số Học
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Nút quay lại */}
          <div className="mb-6">
            <Link href="/numerology" className="inline-flex items-center text-indigo-300 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Quay lại trang thần số học
            </Link>
          </div>
          
          {/* Header cho số chủ đạo */}
          <div className="bg-gradient-to-br from-indigo-800/70 to-purple-800/70 rounded-lg p-6 backdrop-blur-md shadow-xl mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-32 h-32 flex-shrink-0">
                {lifePathImagePath ? (
                  <Image
                    src={lifePathImagePath}
                    alt={`Số chủ đạo ${number}`}
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl font-bold bg-gradient-to-br from-pink-500 to-orange-500 rounded-full">
                    {number}
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Số Chủ Đạo {number}</h1>
                {title && <p className="text-xl text-indigo-200 mb-4">{title}</p>}
              </div>
            </div>
          </div>
          
          {/* Nội dung chính */}
          <div className="space-y-8">
            {/* Tổng quan */}
            {overview && (
              <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-indigo-200">Tổng quan</h2>
                <p className="text-white/90 whitespace-pre-line">{overview}</p>
              </section>
            )}
            
            {/* Đặc điểm, Điểm mạnh, Điểm yếu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {traits && traits.length > 0 && (
                <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-indigo-200">Đặc điểm</h2>
                  <ul className="list-disc list-inside space-y-2 text-white/90">
                    {traits.map((trait: string, index: number) => (
                      <li key={index}>{trait}</li>
                    ))}
                  </ul>
                </section>
              )}
              
              {strengths && strengths.length > 0 && (
                <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-emerald-300">Điểm mạnh</h2>
                  <ul className="list-disc list-inside space-y-2 text-white/90">
                    {strengths.map((strength: string, index: number) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </section>
              )}
              
              {weaknesses && weaknesses.length > 0 && (
                <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-rose-300">Điểm yếu</h2>
                  <ul className="list-disc list-inside space-y-2 text-white/90">
                    {weaknesses.map((weakness: string, index: number) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
            
            {/* Chi tiết */}
            {details && (
              <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-indigo-200">Chi tiết</h2>
                <div className="space-y-6">
                  {details.career && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-indigo-300">Sự nghiệp</h3>
                      <p className="text-white/90 whitespace-pre-line">{details.career}</p>
                    </div>
                  )}
                  
                  {details.relationships && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-pink-300">Các mối quan hệ</h3>
                      <p className="text-white/90 whitespace-pre-line">{details.relationships}</p>
                    </div>
                  )}
                  
                  {details.health && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-green-300">Sức khỏe</h3>
                      <p className="text-white/90 whitespace-pre-line">{details.health}</p>
                    </div>
                  )}
                  
                  {details.spiritual_growth && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-purple-300">Phát triển tâm linh</h3>
                      <p className="text-white/90 whitespace-pre-line">{details.spiritual_growth}</p>
                    </div>
                  )}
                  
                  {details.financial_aspects && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-yellow-300">Khía cạnh tài chính</h3>
                      <p className="text-white/90 whitespace-pre-line">{details.financial_aspects}</p>
                    </div>
                  )}
                  
                  {details.life_lessons && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-blue-300">Bài học cuộc sống</h3>
                      <p className="text-white/90 whitespace-pre-line">{details.life_lessons}</p>
                    </div>
                  )}
                  
                  {details.challenges && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-red-300">Thách thức</h3>
                      <p className="text-white/90 whitespace-pre-line">{details.challenges}</p>
                    </div>
                  )}
                  
                  {details.advice && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-cyan-300">Lời khuyên</h3>
                      <p className="text-white/90 whitespace-pre-line">{details.advice}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
            
            {/* Biểu tượng */}
            {symbols && symbols.length > 0 && (
              <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-indigo-200">Biểu tượng</h2>
                <ul className="list-disc list-inside space-y-2 text-white/90">
                  {symbols.map((symbol: string, index: number) => (
                    <li key={index}>{symbol}</li>
                  ))}
                </ul>
              </section>
            )}
            
            {/* Tương hợp */}
            {compatibility && (
              <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-indigo-200">Tương hợp</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {compatibility.most_compatible && compatibility.most_compatible.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-green-300">Hợp nhất với</h3>
                      <div className="flex flex-wrap gap-2">
                        {compatibility.most_compatible.map((compatNumber: string, index: number) => (
                          <Link href={`/numerology/${compatNumber}`} key={index} 
                            className="px-3 py-1 bg-green-600/30 border border-green-500/50 rounded-full hover:bg-green-600/50 transition">
                            Số {compatNumber}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {compatibility.least_compatible && compatibility.least_compatible.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-red-300">Ít hợp với</h3>
                      <div className="flex flex-wrap gap-2">
                        {compatibility.least_compatible.map((compatNumber: string, index: number) => (
                          <Link href={`/numerology/${compatNumber}`} key={index}
                            className="px-3 py-1 bg-red-600/30 border border-red-500/50 rounded-full hover:bg-red-600/50 transition">
                            Số {compatNumber}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {compatibility.compatibility_explanation && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2 text-indigo-300">Chi tiết tương hợp</h3>
                    <p className="text-white/90 whitespace-pre-line">{compatibility.compatibility_explanation}</p>
                  </div>
                )}
              </section>
            )}
            
            {/* Người nổi tiếng */}
            {famous_people && famous_people.length > 0 && (
              <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-indigo-200">Người nổi tiếng</h2>
                <ul className="list-disc list-inside space-y-2 text-white/90">
                  {famous_people.map((person: string, index: number) => (
                    <li key={index}>{person}</li>
                  ))}
                </ul>
              </section>
            )}
            
            {/* Yếu tố may mắn */}
            {lucky_elements && (
              <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-indigo-200">Các yếu tố may mắn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {lucky_elements.colors && lucky_elements.colors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-indigo-300">Màu sắc</h3>
                      <ul className="list-disc list-inside text-white/90">
                        {lucky_elements.colors.map((color: string, index: number) => (
                          <li key={index}>{color}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {lucky_elements.numbers && lucky_elements.numbers.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-indigo-300">Số may mắn</h3>
                      <ul className="list-disc list-inside text-white/90">
                        {lucky_elements.numbers.map((luckyNum: string, index: number) => (
                          <li key={index}>{luckyNum}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {lucky_elements.days && lucky_elements.days.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-indigo-300">Ngày may mắn</h3>
                      <ul className="list-disc list-inside text-white/90">
                        {lucky_elements.days.map((day: string, index: number) => (
                          <li key={index}>{day}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {lucky_elements.gemstones && lucky_elements.gemstones.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-indigo-300">Đá quý</h3>
                      <ul className="list-disc list-inside text-white/90">
                        {lucky_elements.gemstones.map((gemstone: string, index: number) => (
                          <li key={index}>{gemstone}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
          
          {/* Navigation đến các số chủ đạo khác */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4 text-center">Khám phá các số chủ đạo khác</h2>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {LIFE_PATH_NUMBERS.map((lifePathNumber) => (
                <Link
                  key={lifePathNumber}
                  href={`/numerology/${lifePathNumber}`}
                  className={`px-4 py-3 rounded-full text-sm font-medium transition ${
                    lifePathNumber === number
                      ? 'bg-pink-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                  }`}
                >
                  {lifePathNumber}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/40 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Thần Số Học. Tất cả các quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
} 