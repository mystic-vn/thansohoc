'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const ZODIAC_IMAGES: Record<string, string> = {
  'Bạch Dương': '/images/zodiac/aries.png',
  'Kim Ngưu': '/images/zodiac/taurus.png',
  'Song Tử': '/images/zodiac/gemini.png',
  'Cự Giải': '/images/zodiac/cancer.png',
  'Sư Tử': '/images/zodiac/leo.png',
  'Xử Nữ': '/images/zodiac/virgo.png',
  'Thiên Bình': '/images/zodiac/libra.png',
  'Bọ Cạp': '/images/zodiac/scorpio.png',
  'Nhân Mã': '/images/zodiac/sagittarius.png',
  'Ma Kết': '/images/zodiac/capricorn.png',
  'Bảo Bình': '/images/zodiac/aquarius.png',
  'Song Ngư': '/images/zodiac/pisces.png',
};

const ZODIAC_SYMBOLS: Record<string, string> = {
  'Bạch Dương': '♈',
  'Kim Ngưu': '♉',
  'Song Tử': '♊',
  'Cự Giải': '♋',
  'Sư Tử': '♌',
  'Xử Nữ': '♍',
  'Thiên Bình': '♎',
  'Bọ Cạp': '♏',
  'Nhân Mã': '♐',
  'Ma Kết': '♑',
  'Bảo Bình': '♒',
  'Song Ngư': '♓',
};

interface ZodiacCardProps {
  userData: {
    zodiac_sign: string;
  };
  userZodiac?: any;
  onViewDetails: () => void;
}

const ZodiacCard: React.FC<ZodiacCardProps> = ({ userData, userZodiac, onViewDetails }) => {
  const zodiacSign = userData?.zodiac_sign || '';

  if (!zodiacSign) {
    return null;
  }

  const zodiacSymbol = ZODIAC_SYMBOLS[zodiacSign] || '';
  const zodiacImagePath = ZODIAC_IMAGES[zodiacSign] || '';

  // Đảm bảo rằng chúng ta có dữ liệu hoặc cung cấp giá trị mặc định
  const dateRange = userZodiac?.date_range || "";
  const element = userZodiac?.element || "";
  const rulingPlanet = userZodiac?.ruling_planet || "";
  const modality = userZodiac?.modality || "";
  const overview = userZodiac?.overview || "";
  const traits = userZodiac?.traits || [];
  const strengths = userZodiac?.strengths || [];
  const weaknesses = userZodiac?.weaknesses || [];
  const compatibility = userZodiac?.compatibility || null;
  const lucky_elements = userZodiac?.lucky_elements || null;

  // Xử lý hiển thị nguyên tố và hành tinh cai quản
  // Các trường có thể có dạng "Lửa - Tượng trưng cho..." nên chỉ lấy phần đầu
  const elementDisplay = element ? element.split('-')[0].trim() : "";
  const rulingPlanetDisplay = rulingPlanet ? rulingPlanet.split('-')[0].trim() : "";
  
  console.log("ZodiacCard userZodiac:", userZodiac);

  return (
    <Card className="w-full bg-gradient-to-br from-blue-800/40 to-indigo-900/40 border-blue-500/30 flex-1 backdrop-blur-lg shadow-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">{zodiacSymbol}</span>
            <span>Cung {zodiacSign}</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          {zodiacImagePath && (
            <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto md:mx-0 mb-4 md:mb-0">
              <Image
                src={zodiacImagePath}
                alt={`Cung ${zodiacSign}`}
                width={128}
                height={128}
                className="object-contain"
              />
            </div>
          )}

          <div className="flex-1">
            {dateRange && (
              <div className="mb-3">
                <span className="text-blue-300 text-sm">Ngày sinh:</span>
                <p className="text-white">{dateRange}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-2">
              {element && (
                <div>
                  <span className="text-blue-300 text-sm">Nguyên tố:</span>
                  <p className="text-white">{elementDisplay}</p>
                </div>
              )}
              
              {rulingPlanet && (
                <div>
                  <span className="text-blue-300 text-sm">Hành tinh cai quản:</span>
                  <p className="text-white">{rulingPlanetDisplay}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {overview && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-200">Tổng quan</h3>
            <p className="text-white/80">{overview.length > 150 ? `${overview.substring(0, 150)}...` : overview}</p>
          </div>
        )}

        {/* Hiển thị điểm mạnh */}
        {strengths && strengths.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-200">Điểm mạnh</h3>
            <div className="flex flex-wrap gap-2">
              {strengths.slice(0, 3).map((strength: string, index: number) => (
                <span 
                  key={index} 
                  className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-sm border border-blue-500/30"
                >
                  {strength}
                </span>
              ))}
              {strengths.length > 3 && (
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-sm border border-blue-500/30">
                  +{strengths.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Hiển thị tương hợp nếu có */}
        {compatibility && compatibility.most_compatible && compatibility.most_compatible.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-200">Hợp với cung</h3>
            <div className="flex flex-wrap gap-2">
              {compatibility.most_compatible.slice(0, 2).map((compat: string, index: number) => (
                <span 
                  key={index} 
                  className="px-3 py-1 rounded-full bg-green-500/20 text-green-200 text-sm border border-green-500/30"
                >
                  {compat}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onViewDetails}
          className="w-full py-2.5 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
        >
          Xem chi tiết
        </button>
      </CardContent>
    </Card>
  );
};

export default ZodiacCard; 