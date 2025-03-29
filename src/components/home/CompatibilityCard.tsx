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
      <Card className="border border-purple-500/30 bg-gradient-to-br from-purple-900/30 to-indigo-900/40 backdrop-blur-sm">
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

  return (
    <>
      <Card className="border border-purple-500/30 bg-gradient-to-br from-purple-900/30 to-indigo-900/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-lg text-white">Phân Tích Tính Cách</CardTitle>
          <CardDescription className="text-center text-white/70">
            Sự kết hợp giữa số chủ đạo và cung hoàng đạo
          </CardDescription>
        </CardHeader>
        <CardContent className="text-white/80 space-y-4">
          <div className="flex items-center justify-center gap-3 text-lg">
            <span className="font-bold text-pink-300">{lifePathNumber}</span>
            <span className="text-white/60">+</span>
            <span className="font-bold text-cyan-300">{zodiacSign}</span>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-center">Điểm Hài Hòa Nội Tại</h4>
            <div className="w-full bg-gray-800/50 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  score >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  score >= 65 ? 'bg-gradient-to-r from-teal-500 to-cyan-500' :
                  score >= 50 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                  score >= 35 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-orange-500 to-red-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-center text-sm flex justify-center items-center gap-1">
              {Math.round(score)}/100
              <span className={`inline-block w-2 h-2 rounded-full ml-1 ${
                score >= 80 ? 'bg-green-500' :
                score >= 65 ? 'bg-teal-500' :
                score >= 50 ? 'bg-blue-500' :
                score >= 35 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}></span>
            </p>
          </div>

          <p className="text-sm text-white/70 mt-2 text-center">
            {overview.length > 120 ? overview.substring(0, 120) + "..." : overview}
          </p>
          
          {strengths.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <h4 className="text-sm font-medium text-green-300 mb-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Điểm mạnh
              </h4>
              <div className="text-xs text-white/70">{strengths[0]?.substring(0, 70)}...</div>
            </div>
          )}
          
          {challenges.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <h4 className="text-sm font-medium text-red-300 mb-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Thách thức
              </h4>
              <div className="text-xs text-white/70">{challenges[0]?.substring(0, 70)}...</div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            onClick={openModal} 
            variant="outline" 
            className="w-full bg-white/5 hover:bg-white/10 text-white border-white/20"
          >
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

export default CompatibilityCard; 