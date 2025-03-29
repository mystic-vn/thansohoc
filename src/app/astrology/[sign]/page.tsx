'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';

// Thêm một bản đồ biểu tượng và slug cho các cung hoàng đạo
const ZODIAC_SYMBOLS: Record<string, string> = {
  'bach-duong': '♈',
  'kim-nguu': '♉',
  'song-tu': '♊',
  'cu-giai': '♋',
  'su-tu': '♌',
  'xu-nu': '♍',
  'thien-binh': '♎',
  'bo-cap': '♏',
  'nhan-ma': '♐',
  'ma-ket': '♑',
  'bao-binh': '♒',
  'song-ngu': '♓',
};

// Bản đồ chuyển đổi từ slug không dấu sang tên tiếng Việt có dấu
const ZODIAC_NAMES: Record<string, string> = {
  'bach-duong': 'Bạch Dương',
  'kim-nguu': 'Kim Ngưu',
  'song-tu': 'Song Tử',
  'cu-giai': 'Cự Giải',
  'su-tu': 'Sư Tử',
  'xu-nu': 'Xử Nữ',
  'thien-binh': 'Thiên Bình',
  'bo-cap': 'Bọ Cạp',
  'nhan-ma': 'Nhân Mã',
  'ma-ket': 'Ma Kết',
  'bao-binh': 'Bảo Bình',
  'song-ngu': 'Song Ngư',
};

// Mảng các cung hoàng đạo để navigation
const ZODIAC_SIGNS = [
  'bach-duong', 'kim-nguu', 'song-tu', 'cu-giai', 'su-tu', 'xu-nu',
  'thien-binh', 'bo-cap', 'nhan-ma', 'ma-ket', 'bao-binh', 'song-ngu'
];

export default function ZodiacDetailPage() {
  const params = useParams();
  const signSlug = params.sign as string;
  const sign = ZODIAC_NAMES[signSlug] || '';
  
  const [zodiacData, setZodiacData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchZodiacData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/numerology?type=zodiac&code=${encodeURIComponent(sign)}`);
        
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu cung hoàng đạo');
        }
        
        const data = await response.json();
        setZodiacData(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu cung hoàng đạo:', err);
        setError('Không thể tải dữ liệu cung hoàng đạo');
        setLoading(false);
      }
    };

    if (sign) {
      fetchZodiacData();
    } else {
      setError('Cung hoàng đạo không hợp lệ');
      setLoading(false);
    }
  }, [sign]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-800 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !zodiacData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-800 to-purple-900 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-white mb-4">Đã xảy ra lỗi</h1>
        <p className="text-white mb-8">{error || 'Không tìm thấy dữ liệu cung hoàng đạo'}</p>
        <Link href="/astrology" className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
          Quay lại danh sách cung hoàng đạo
        </Link>
      </div>
    );
  }

  // Lấy biểu tượng của cung hoàng đạo
  const zodiacSymbol = ZODIAC_SYMBOLS[signSlug] || '';

  // Xử lý các trường dữ liệu để hiển thị
  const {
    title, date_range, ruling_planet, element, modality, symbol, overview,
    traits, strengths, weaknesses, details, compatibility, famous_people, lucky_elements,
    personality_in_different_life_stages
  } = zodiacData;

  // Xử lý hiển thị nguyên tố và hành tinh cai quản
  const elementDisplay = element ? element.split('-')[0].trim() : "";
  const rulingPlanetDisplay = ruling_planet ? ruling_planet.split('-')[0].trim() : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-800 to-purple-900 text-white">
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Nút quay lại */}
          <div className="mb-6">
            <Link href="/astrology" className="inline-flex items-center text-blue-300 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Quay lại trang cung hoàng đạo
            </Link>
          </div>
          
          {/* Header cho cung hoàng đạo */}
          <div className="bg-gradient-to-br from-blue-800/70 to-purple-800/70 rounded-lg p-6 backdrop-blur-md shadow-xl mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center text-6xl">
                {zodiacSymbol}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <span className="text-4xl mr-2">{zodiacSymbol}</span>
                  <h1 className="text-3xl md:text-4xl font-bold">Cung {title}</h1>
                </div>
                {date_range && <p className="text-xl text-blue-200 mb-4">{date_range}</p>}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {element && (
                    <div>
                      <span className="text-blue-300">Nguyên tố:</span>
                      <p className="text-white font-medium">{elementDisplay}</p>
                    </div>
                  )}
                  
                  {ruling_planet && (
                    <div>
                      <span className="text-blue-300">Hành tinh cai quản:</span>
                      <p className="text-white font-medium">{rulingPlanetDisplay}</p>
                    </div>
                  )}
                  
                  {modality && (
                    <div>
                      <span className="text-blue-300">Tính chất:</span>
                      <p className="text-white font-medium">{modality.split('-')[0].trim()}</p>
                    </div>
                  )}
                  
                  {symbol && (
                    <div>
                      <span className="text-blue-300">Biểu tượng:</span>
                      <p className="text-white font-medium">{symbol.split('-')[0].trim()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Nội dung chính */}
          <div className="space-y-8">
            {/* Tổng quan */}
            {overview && (
              <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-blue-200">Tổng quan</h2>
                <p className="text-white/90 whitespace-pre-line">{overview}</p>
              </section>
            )}
            
            {/* Đặc điểm, Điểm mạnh, Điểm yếu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {traits && traits.length > 0 && (
                <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-blue-200">Đặc điểm</h2>
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
                <h2 className="text-2xl font-bold mb-6 text-blue-200">Chi tiết</h2>
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
                  
                  {details.spiritual_aspects && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-purple-300">Khía cạnh tâm linh</h3>
                      <p className="text-white/90 whitespace-pre-line">{details.spiritual_aspects}</p>
                    </div>
                  )}
                  
                  {details.financial_aspects && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-yellow-300">Khía cạnh tài chính</h3>
                      <p className="text-white/90 whitespace-pre-line">{details.financial_aspects}</p>
                    </div>
                  )}
                  
                  {details.advice && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-blue-300">Lời khuyên</h3>
                      <p className="text-white/90 whitespace-pre-line">{details.advice}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
            
            {/* Tương hợp */}
            {compatibility && (
              <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-blue-200">Tương hợp</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {compatibility.most_compatible && compatibility.most_compatible.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-green-300">Hợp nhất với</h3>
                      <div className="flex flex-wrap gap-2">
                        {compatibility.most_compatible.map((compatSign: string, index: number) => (
                          <Link href={`/astrology/${encodeURIComponent(compatSign)}`} key={index} 
                            className="px-3 py-1 bg-green-600/30 border border-green-500/50 rounded-full hover:bg-green-600/50 transition">
                            {compatSign}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {compatibility.least_compatible && compatibility.least_compatible.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-red-300">Ít hợp với</h3>
                      <div className="flex flex-wrap gap-2">
                        {compatibility.least_compatible.map((compatSign: string, index: number) => (
                          <Link href={`/astrology/${encodeURIComponent(compatSign)}`} key={index}
                            className="px-3 py-1 bg-red-600/30 border border-red-500/50 rounded-full hover:bg-red-600/50 transition">
                            {compatSign}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {compatibility.compatibility_explanation && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2 text-blue-300">Chi tiết tương hợp</h3>
                    <p className="text-white/90 whitespace-pre-line">{compatibility.compatibility_explanation}</p>
                  </div>
                )}
              </section>
            )}
            
            {/* Người nổi tiếng */}
            {famous_people && famous_people.length > 0 && (
              <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-blue-200">Người nổi tiếng</h2>
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
                <h2 className="text-2xl font-bold mb-4 text-blue-200">Các yếu tố may mắn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {lucky_elements.colors && lucky_elements.colors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-300">Màu sắc</h3>
                      <ul className="list-disc list-inside text-white/90">
                        {lucky_elements.colors.map((color: string, index: number) => (
                          <li key={index}>{color}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {lucky_elements.numbers && lucky_elements.numbers.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-300">Số may mắn</h3>
                      <ul className="list-disc list-inside text-white/90">
                        {lucky_elements.numbers.map((number: string, index: number) => (
                          <li key={index}>{number}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {lucky_elements.days && lucky_elements.days.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-300">Ngày may mắn</h3>
                      <ul className="list-disc list-inside text-white/90">
                        {lucky_elements.days.map((day: string, index: number) => (
                          <li key={index}>{day}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {lucky_elements.gemstones && lucky_elements.gemstones.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-300">Đá quý</h3>
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
            
            {/* Tính cách trong các giai đoạn khác nhau của cuộc đời */}
            {personality_in_different_life_stages && (
              <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-blue-200">Tính cách trong các giai đoạn cuộc đời</h2>
                <div className="space-y-4">
                  {personality_in_different_life_stages.childhood && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-yellow-300">Thời thơ ấu</h3>
                      <p className="text-white/90">{personality_in_different_life_stages.childhood}</p>
                    </div>
                  )}
                  
                  {personality_in_different_life_stages.teenage_years && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-orange-300">Tuổi thiếu niên</h3>
                      <p className="text-white/90">{personality_in_different_life_stages.teenage_years}</p>
                    </div>
                  )}
                  
                  {personality_in_different_life_stages.young_adult && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-green-300">Tuổi trưởng thành</h3>
                      <p className="text-white/90">{personality_in_different_life_stages.young_adult}</p>
                    </div>
                  )}
                  
                  {personality_in_different_life_stages.middle_age && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-300">Tuổi trung niên</h3>
                      <p className="text-white/90">{personality_in_different_life_stages.middle_age}</p>
                    </div>
                  )}
                  
                  {personality_in_different_life_stages.senior_years && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-purple-300">Tuổi già</h3>
                      <p className="text-white/90">{personality_in_different_life_stages.senior_years}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
          
          {/* Navigation đến các cung khác */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4 text-center">Khám phá các cung hoàng đạo khác</h2>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {ZODIAC_SIGNS.map((zodiacSign) => (
                <Link
                  key={zodiacSign}
                  href={`/astrology/${encodeURIComponent(zodiacSign)}`}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                    zodiacSign === signSlug
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                  }`}
                >
                  {ZODIAC_SYMBOLS[zodiacSign]} {ZODIAC_NAMES[zodiacSign]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 