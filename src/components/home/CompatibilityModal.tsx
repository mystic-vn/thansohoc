'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Shield, AlertCircle, Bookmark, Star } from 'lucide-react';

interface CompatibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  lifePathNumber: string | number;
  zodiacSign: string;
  description?: string;
  score?: number;
  strongPoints?: string[];
  weakPoints?: string[];
  lifePathInfluence?: string;
  zodiacInfluence?: string;
  advice?: string[];
  isAuthenticated: boolean;
  compatibilityData?: any;
}

const CompatibilityModal: React.FC<CompatibilityModalProps> = ({
  isOpen,
  onClose,
  title,
  lifePathNumber,
  zodiacSign,
  description,
  score,
  strongPoints,
  weakPoints,
  lifePathInfluence,
  zodiacInfluence,
  advice,
  isAuthenticated,
  compatibilityData
}) => {
  const normalizedScore = score ? (score > 10 ? score : score * 10) : 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-b from-purple-900 to-indigo-900 text-white border border-purple-500/30 shadow-2xl">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-xl md:text-2xl font-semibold text-center text-white">
            {title || "Sự Kết Hợp Tính Cách Trong Con Người Bạn"}
          </DialogTitle>
          <div className="text-center pt-2 text-white/70">
            <div className="flex items-center justify-center gap-3 text-lg">
              <span className="font-bold text-pink-300">{lifePathNumber}</span>
              <span className="text-white/60">+</span>
              <span className="font-bold text-cyan-300">{zodiacSign}</span>
            </div>
            <div className="text-sm text-white/60 mt-1">Số chủ đạo + Cung hoàng đạo</div>
          </div>
        </DialogHeader>

        {normalizedScore > 0 && (
          <div className="mb-4 flex justify-center">
            <div className={`py-1 px-6 rounded-full font-medium border ${
              normalizedScore >= 80 ? 'bg-green-800/50 border-green-500/40 text-green-200' :
              normalizedScore >= 65 ? 'bg-teal-800/50 border-teal-500/40 text-teal-200' :
              normalizedScore >= 50 ? 'bg-blue-800/50 border-blue-500/40 text-blue-200' :
              normalizedScore >= 35 ? 'bg-yellow-800/50 border-yellow-500/40 text-yellow-200' :
              'bg-red-800/50 border-red-500/40 text-red-200'
            }`}>
              Điểm hài hòa nội tại: {Math.round(normalizedScore)}/100
              <span className="ml-2 text-xs">
                {normalizedScore >= 80 ? '(Rất hài hòa)' :
                 normalizedScore >= 65 ? '(Khá hài hòa)' :
                 normalizedScore >= 50 ? '(Hài hòa trung bình)' :
                 normalizedScore >= 35 ? '(Hơi mâu thuẫn)' :
                 '(Khá mâu thuẫn)'}
              </span>
            </div>
          </div>
        )}

        <div className="text-white/90 space-y-6">
          <p className="text-sm md:text-base">{description}</p>

          
          
          {/* Hiển thị các khía cạnh tính cách nếu có */}
          {compatibilityData && compatibilityData.personality_aspects && (
            <div className="border-t border-white/10 pt-4">
              <h3 className="font-medium text-lg text-white mb-3">Các khía cạnh tính cách</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {compatibilityData.personality_aspects.emotional && (
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-pink-300">Cảm xúc</h4>
                      {compatibilityData.personality_aspects.emotional.score && (
                        <span className="bg-pink-900/50 text-pink-200 text-xs px-2 py-1 rounded-full">
                          {compatibilityData.personality_aspects.emotional.score}/100
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/70 max-h-32 overflow-y-auto">
                      {compatibilityData.personality_aspects.emotional.description}
                    </p>
                  </div>
                )}
                
                {compatibilityData.personality_aspects.spiritual && (
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-indigo-300">Tâm linh</h4>
                      {compatibilityData.personality_aspects.spiritual.score && (
                        <span className="bg-indigo-900/50 text-indigo-200 text-xs px-2 py-1 rounded-full">
                          {compatibilityData.personality_aspects.spiritual.score}/100
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/70 max-h-32 overflow-y-auto">
                      {compatibilityData.personality_aspects.spiritual.description}
                    </p>
                  </div>
                )}
                
                {compatibilityData.personality_aspects.practical && (
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-amber-300">Thực tế</h4>
                      {compatibilityData.personality_aspects.practical.score && (
                        <span className="bg-amber-900/50 text-amber-200 text-xs px-2 py-1 rounded-full">
                          {compatibilityData.personality_aspects.practical.score}/100
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/70 max-h-32 overflow-y-auto">
                      {compatibilityData.personality_aspects.practical.description}
                    </p>
                  </div>
                )}
                
                {compatibilityData.personality_aspects.relationships && (
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-rose-300">Các mối quan hệ</h4>
                      {compatibilityData.personality_aspects.relationships.score && (
                        <span className="bg-rose-900/50 text-rose-200 text-xs px-2 py-1 rounded-full">
                          {compatibilityData.personality_aspects.relationships.score}/100
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/70 max-h-32 overflow-y-auto">
                      {compatibilityData.personality_aspects.relationships.description}
                    </p>
                  </div>
                )}
                
                {compatibilityData.personality_aspects.career && (
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-blue-300">Sự nghiệp</h4>
                      {compatibilityData.personality_aspects.career.score && (
                        <span className="bg-blue-900/50 text-blue-200 text-xs px-2 py-1 rounded-full">
                          {compatibilityData.personality_aspects.career.score}/100
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/70 max-h-32 overflow-y-auto">
                      {compatibilityData.personality_aspects.career.description}
                    </p>
                  </div>
                )}
                
                {compatibilityData.personality_aspects.communication && (
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-emerald-300">Giao tiếp</h4>
                      {compatibilityData.personality_aspects.communication.score && (
                        <span className="bg-emerald-900/50 text-emerald-200 text-xs px-2 py-1 rounded-full">
                          {compatibilityData.personality_aspects.communication.score}/100
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/70 max-h-32 overflow-y-auto">
                      {compatibilityData.personality_aspects.communication.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {lifePathInfluence && (
            <div className="border-t border-white/10 pt-4">
              <h3 className="font-medium text-lg text-pink-300 mb-2 flex items-center">
                <div className="h-6 w-6 rounded-full bg-pink-500/30 flex items-center justify-center mr-2 text-sm">{lifePathNumber}</div>
                Ảnh hưởng của Số chủ đạo
              </h3>
              <p className="text-sm md:text-base text-white/80">
                {lifePathInfluence}
              </p>
            </div>
          )}

          {zodiacInfluence && (
            <div className="border-t border-white/10 pt-4">
              <h3 className="font-medium text-lg text-cyan-300 mb-2 flex items-center">
                <div className="h-6 w-6 rounded-full bg-cyan-500/30 flex items-center justify-center mr-2 text-sm">{zodiacSign.charAt(0)}</div>
                Ảnh hưởng của cung {zodiacSign}
              </h3>
              <p className="text-sm md:text-base text-white/80">
                {zodiacInfluence}
              </p>
            </div>
          )}

          {/* Đặc điểm tính cách nổi bật nếu có */}
          {compatibilityData && compatibilityData.personality_traits && 
           compatibilityData.personality_traits.dominant_traits && 
           compatibilityData.personality_traits.dominant_traits.length > 0 && (
            <div className="border-t border-white/10 pt-4">
              <h3 className="font-medium text-lg text-purple-300 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                  <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
                </svg>
                Đặc điểm tính cách nổi bật
              </h3>
              <ul className="list-disc list-inside text-sm md:text-base text-white/80 space-y-2">
                {compatibilityData.personality_traits.dominant_traits.map((trait: string, index: number) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            </div>
          )}

          {(strongPoints && strongPoints.length > 0) && (
            <div className="border-t border-white/10 pt-4">
              <h3 className="font-medium text-lg text-green-300 flex items-center mb-2">
                <CheckCircle size={18} className="mr-2" /> Điểm mạnh
              </h3>
              <ul className="list-disc list-inside text-sm md:text-base text-white/80 space-y-2">
                {strongPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {(weakPoints && weakPoints.length > 0) && (
            <div className="border-t border-white/10 pt-4">
              <h3 className="font-medium text-lg text-red-300 flex items-center mb-2">
                <XCircle size={18} className="mr-2" /> Điểm cần lưu ý
              </h3>
              <ul className="list-disc list-inside text-sm md:text-base text-white/80 space-y-2">
                {weakPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {(advice && advice.length > 0) && (
            <div className="border-t border-white/10 pt-4">
              <h3 className="font-medium text-lg text-yellow-300 mb-2 flex items-center">
                <Star size={18} className="mr-2" /> Lời khuyên cho bạn
              </h3>
              <ul className="list-disc list-inside text-sm md:text-base text-white/80 space-y-2">
                {Array.isArray(advice) ? (
                  advice.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>{advice}</li>
                )}
              </ul>
            </div>
          )}

          {!isAuthenticated && (
            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="bg-purple-800/30 rounded-lg p-4 text-center border border-purple-500/30">
                <p className="text-white font-medium mb-2">Đăng nhập để xem thêm thông tin chi tiết</p>
                <p className="text-white/70 text-sm">
                  Bao gồm phân tích sâu về tính cách, sự nghiệp, tài chính, các mối quan hệ và lời khuyên cá nhân hóa.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-white/10 pt-4">
          <Button onClick={onClose} className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border border-white/10">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompatibilityModal; 