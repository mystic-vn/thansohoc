'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

// Thêm một bản đồ các hình ảnh cho số chủ đạo
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

// Mô tả ngắn gọn về các số chủ đạo
const LIFE_PATH_DESCRIPTIONS: Record<string, string> = {
  '1': 'Số 1 tượng trưng cho sự lãnh đạo, độc lập và tiên phong',
  '2': 'Số 2 tượng trưng cho sự hòa hợp, cân bằng và hợp tác',
  '3': 'Số 3 tượng trưng cho sự sáng tạo, giao tiếp và biểu đạt',
  '4': 'Số 4 tượng trưng cho sự ổn định, trật tự và kỷ luật',
  '5': 'Số 5 tượng trưng cho sự tự do, phiêu lưu và thay đổi',
  '6': 'Số 6 tượng trưng cho sự hài hòa, trách nhiệm và yêu thương',
  '7': 'Số 7 tượng trưng cho sự khám phá, phân tích và tâm linh',
  '8': 'Số 8 tượng trưng cho sự thành công, quyền lực và thịnh vượng',
  '9': 'Số 9 tượng trưng cho sự nhân đạo, trí tuệ và hoàn thiện',
  '11': 'Số 11 là số thầy, tượng trưng cho trực giác cao và sự khai sáng',
  '22': 'Số 22 là số thầy, tượng trưng cho sự xây dựng và hoàn thành',
  '33': 'Số 33 là số thầy, tượng trưng cho lòng vị tha và sự phụng sự',
};

interface LifePathCardProps {
  userData: {
    life_path_number: string;
  };
  userLifePath?: any; // Dữ liệu chi tiết về số chủ đạo từ database
  onViewDetails: () => void;
}

const LifePathCard: React.FC<LifePathCardProps> = ({ 
  userData, 
  userLifePath, 
  onViewDetails 
}) => {
  const lifePathNumber = userData?.life_path_number || '';

  if (!lifePathNumber) {
    return null;
  }

  const lifePathImagePath = LIFE_PATH_IMAGES[lifePathNumber] || '';
  
  // Đảm bảo rằng chúng ta có dữ liệu hoặc cung cấp giá trị mặc định
  const title = userLifePath?.title || "";
  const overview = userLifePath?.overview || "";
  const traits = userLifePath?.traits || [];
  const strengths = userLifePath?.strengths || [];
  
  console.log("LifePathCard userLifePath:", userLifePath);

  return (
    <Card className="w-full bg-gradient-to-br from-pink-800/40 to-purple-900/40 border-pink-500/30 flex-1 backdrop-blur-lg shadow-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <span>Số Chủ Đạo {lifePathNumber}</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto md:mx-0 mb-4 md:mb-0">
            {lifePathImagePath ? (
              <Image
                src={lifePathImagePath}
                alt={`Số chủ đạo ${lifePathNumber}`}
                width={128}
                height={128}
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-bold bg-gradient-to-br from-pink-500 to-orange-500 rounded-full">
                {lifePathNumber}
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            {title && (
              <h3 className="text-lg font-semibold text-pink-200 mb-2">{title}</h3>
            )}
            
            <p className="text-white/80">
              {LIFE_PATH_DESCRIPTIONS[lifePathNumber] || "Số chủ đạo của bạn"}
            </p>
          </div>
        </div>

        {overview && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-pink-200">Tổng quan</h3>
            <p className="text-white/80">{overview.length > 150 ? `${overview.substring(0, 150)}...` : overview}</p>
          </div>
        )}

        {strengths && strengths.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-pink-200">Điểm mạnh</h3>
            <div className="flex flex-wrap gap-2">
              {strengths.slice(0, 5).map((strength: string, index: number) => (
                <span 
                  key={index} 
                  className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-200 text-sm border border-pink-500/30"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onViewDetails}
          className="w-full py-2.5 mt-2 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium hover:from-pink-700 hover:to-purple-700 transition shadow-lg"
        >
          Xem chi tiết
        </button>
      </CardContent>
    </Card>
  );
};

export default LifePathCard; 