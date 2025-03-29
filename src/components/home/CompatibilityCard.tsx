'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CompatibilityModal from './CompatibilityModal';

interface CompatibilityCardProps {
  compatibilityData: any;
  lifePathNumber: string | number;
  zodiacSign: string;
  getCompatibility: () => void;
}

const CompatibilityCard = ({
  compatibilityData,
  lifePathNumber,
  zodiacSign,
  getCompatibility
}: CompatibilityCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDynamicLoading, setIsDynamicLoading] = useState(false);
  const [dynamicData, setDynamicData] = useState<any>(null);

  if (!compatibilityData) {
    return (
      <Card className="border border-purple-500/30 bg-gradient-to-br from-purple-900/30 to-indigo-900/40 backdrop-blur-sm mt-8">
        <CardHeader>
          <CardTitle className="text-center text-white">Phân Tích Tính Cách</CardTitle>
          <CardDescription className="text-center text-white/70">
            Đang tải dữ liệu...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </CardContent>
      </Card>
    );
  }

  console.log("Compatibility data:", compatibilityData);

  // Xử lý cả dữ liệu cũ và mới
  let score = 0;
  
  // Xử lý điểm số từ nhiều định dạng dữ liệu có thể có
  if (compatibilityData.internal_harmony) {
    // Nếu internal_harmony là một đối tượng có score
    if (typeof compatibilityData.internal_harmony === 'object' && compatibilityData.internal_harmony.score) {
      // Nếu score đã là số từ 1-100, sử dụng nguyên giá trị
      if (compatibilityData.internal_harmony.score >= 1 && compatibilityData.internal_harmony.score <= 100) {
        score = Number(compatibilityData.internal_harmony.score);
      } else {
        // Chuyển đổi thang điểm 1-10 sang 1-100 nếu cần
        score = Number(compatibilityData.internal_harmony.score) * 10;
      }
    } else {
      // Nếu internal_harmony là một số
      score = Number(compatibilityData.internal_harmony) * 10;
    }
  } else if (compatibilityData.compatibilityScore) {
    // Nếu có compatibilityScore
    score = Number(compatibilityData.compatibilityScore);
  }
  
  // Đảm bảo điểm nằm trong khoảng 1-100
  score = Math.min(100, Math.max(1, score));

  // Các dữ liệu khác
  const overview = compatibilityData.overview || 
                  (compatibilityData.internal_harmony && compatibilityData.internal_harmony.description) || 
                  compatibilityData.description || 
                  "";

  // Nếu strengths là mảng sử dụng trực tiếp, nếu không chuyển thành mảng rỗng
  const strengths = Array.isArray(compatibilityData.strengths) ? compatibilityData.strengths : 
                  (Array.isArray(compatibilityData.strongPoints) ? compatibilityData.strongPoints : []);

  // Nếu challenges là mảng sử dụng trực tiếp, nếu không chuyển thành mảng rỗng
  const challenges = Array.isArray(compatibilityData.challenges) ? compatibilityData.challenges : 
                  (Array.isArray(compatibilityData.weakPoints) ? compatibilityData.weakPoints : []);

  const lifePathInfluence = compatibilityData.life_path_influence || compatibilityData.lifePathInfluence || "";
  const zodiacInfluence = compatibilityData.zodiac_influence || compatibilityData.zodiacInfluence || "";
  
  // Lời khuyên có thể là mảng hoặc chuỗi
  let advice = [];
  if (compatibilityData.advice) {
    if (Array.isArray(compatibilityData.advice)) {
      advice = compatibilityData.advice;
    } else if (typeof compatibilityData.advice === 'string') {
      advice = [compatibilityData.advice];
    }
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const getDynamicScore = async () => {
    if (!lifePathNumber || !zodiacSign) return;
    
    try {
      setIsDynamicLoading(true);
      const response = await fetch('/api/numerology/compatibility/dynamic-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lifePathNumber, zodiacSign }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dynamic score');
      }
      
      const result = await response.json();
      setDynamicData(result.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching dynamic score:', error);
    } finally {
      setIsDynamicLoading(false);
    }
  };

  // Xác định màu gradient dựa trên điểm số
  const getScoreGradient = () => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 65) return 'from-teal-500 to-cyan-600';
    if (score >= 50) return 'from-blue-500 to-indigo-600';
    if (score >= 35) return 'from-yellow-500 to-orange-600';
    return 'from-orange-500 to-red-600';
  };

  return (
    <>
      <Card className="border-purple-500/30 bg-gradient-to-br from-violet-900/40 to-fuchsia-900/30 backdrop-blur-md shadow-xl mt-8">
        <CardHeader className="bg-gradient-to-b from-indigo-900/60 to-transparent pb-2">
          <CardTitle className="text-center text-xl text-white flex justify-center items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-300">
              <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
              <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
            </svg>
            Phân Tích Tính Cách
          </CardTitle>
          <CardDescription className="text-center text-purple-200/80">
            Sự kết hợp giữa số chủ đạo và cung hoàng đạo
          </CardDescription>
        </CardHeader>
        <CardContent className="text-white/80 space-y-4 px-6 py-4">
          <div className="flex items-center justify-center gap-4 text-xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-600/30 border border-pink-500/30">
              <span className="font-bold text-pink-300">{lifePathNumber}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
              <line x1="8" y1="12" x2="16" y2="12"></line>
              <line x1="12" y1="16" x2="12" y2="8"></line>
            </svg>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/30">
              <span className="font-bold text-cyan-300">{ZODIAC_SYMBOLS[zodiacSign] || zodiacSign[0]}</span>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="font-medium text-center text-purple-200 mb-3">Điểm Hài Hòa Nội Tại</h4>
            <div className="w-full bg-black/30 rounded-full h-4 mb-1">
              <div
                className={`h-4 rounded-full bg-gradient-to-r ${getScoreGradient()}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-center text-sm flex justify-center items-center gap-1 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-300">
                <path d="M12 20v-6M6 20V10M18 20V4" />
              </svg>
              <span className="font-semibold">{Math.round(score)}</span>/100
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm text-white leading-relaxed">
              {overview.length > 120 ? overview.substring(0, 120) + "..." : overview}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {strengths.length > 0 && (
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3">
                <h4 className="text-sm font-medium text-green-300 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Điểm mạnh
                </h4>
                <div className="text-xs text-white/80">{strengths[0]?.substring(0, 70)}...</div>
              </div>
            )}
            
            {challenges.length > 0 && (
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3">
                <h4 className="text-sm font-medium text-red-300 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Thách thức
                </h4>
                <div className="text-xs text-white/80">{challenges[0]?.substring(0, 70)}...</div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-4 pt-2">
          <Button 
            onClick={openModal} 
            variant="outline" 
            className="w-full bg-white/5 hover:bg-white/10 text-white border-white/20 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            Xem Chi Tiết
          </Button>
        </CardFooter>
      </Card>

      <CompatibilityModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={dynamicData ? "Phân Tích Tính Cách (AI)" : undefined}
        lifePathNumber={lifePathNumber.toString()}
        zodiacSign={zodiacSign}
        description={dynamicData ? dynamicData.description : overview}
        score={dynamicData ? dynamicData.score : score}
        strongPoints={dynamicData ? dynamicData.strengths : strengths}
        weakPoints={dynamicData ? dynamicData.challenges : challenges}
        lifePathInfluence={dynamicData ? dynamicData.lifePathInfluence : lifePathInfluence}
        zodiacInfluence={dynamicData ? dynamicData.zodiacInfluence : zodiacInfluence}
        advice={dynamicData ? dynamicData.advice : advice}
        isAuthenticated={true}
        compatibilityData={dynamicData || compatibilityData}
      />
    </>
  );
};

// Thêm ZODIAC_SYMBOLS để hiển thị biểu tượng cung hoàng đạo
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

export default CompatibilityCard; 