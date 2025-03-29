'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCookie } from '@/lib/cookies';

interface CompatibilityResult {
  _id?: string;
  type: string;
  factor1Type: string;
  factor1Code: string;
  factor2Type: string;
  factor2Code: string;
  title: string;
  overview: string;
  compatibilityScore?: number;
  compatibility_breakdown?: {
    intellectual?: number;
    emotional?: number;
    spiritual?: number;
    practical?: number;
    description?: string;
  };
  strengths: string[];
  challenges: string[];
  communication_patterns?: {
    strengths?: string[];
    challenges?: string[];
    advice?: string;
  };
  relationship_dynamics?: {
    personal?: string;
    professional?: string;
    friendship?: string;
  };
  famous_examples?: string[];
  advice: string;
}

export default function CompatibilityPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [compatibilityType, setCompatibilityType] = useState('life-path-life-path');
  const [factor1Type, setFactor1Type] = useState('life-path');
  const [factor1Code, setFactor1Code] = useState('');
  const [factor2Type, setFactor2Type] = useState('life-path');
  const [factor2Code, setFactor2Code] = useState('');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState('');

  // Kiểm tra xác thực
  useEffect(() => {
    const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Danh sách các số chủ đạo
  const lifePathNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '22', '33'];
  
  // Danh sách các cung hoàng đạo
  const zodiacSigns = [
    'Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải', 
    'Sư Tử', 'Xử Nữ', 'Thiên Bình', 'Bọ Cạp', 
    'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư'
  ];

  // Cập nhật các loại của factor theo compatibility type
  useEffect(() => {
    if (compatibilityType === 'life-path-life-path') {
      setFactor1Type('life-path');
      setFactor2Type('life-path');
    } else if (compatibilityType === 'life-path-zodiac') {
      setFactor1Type('life-path');
      setFactor2Type('zodiac');
    }
    // Reset các giá trị đã chọn
    setFactor1Code('');
    setFactor2Code('');
    setResult(null);
    setError('');
  }, [compatibilityType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    if (!factor1Code || !factor2Code) {
      setError('Vui lòng chọn đầy đủ thông tin');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `/api/numerology/compatibility?type=${compatibilityType}&factor1Type=${factor1Type}&factor1Code=${factor1Code}&factor2Type=${factor2Type}&factor2Code=${factor2Code}`
      );
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Đã xảy ra lỗi khi lấy dữ liệu');
      }
      
      setResult(responseData.data);
    } catch (error: any) {
      console.error('Lỗi:', error);
      setError(error.message || 'Đã xảy ra lỗi khi lấy dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Phân Tích Tương Hợp Thần Số Học
        </h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-2xl border border-white/20 max-w-4xl mx-auto">
          <div className="mb-8">
            <p className="text-white/90 text-center mb-6">
              Khám phá sự tương hợp giữa các số chủ đạo và cung hoàng đạo để hiểu sâu sắc hơn về mối quan hệ và điểm tương đồng.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-4 flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-pink-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold">9</span>
                </div>
                <h3 className="font-medium mb-1">Số Chủ Đạo</h3>
                <p className="text-sm text-white/70">Đại diện cho bản chất cốt lõi</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">♌</span>
                </div>
                <h3 className="font-medium mb-1">Cung Hoàng Đạo</h3>
                <p className="text-sm text-white/70">Thể hiện tính cách và đặc điểm</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-6">
              <label className="block text-white mb-2 font-medium">Chọn loại tương hợp</label>
              <select 
                value={compatibilityType} 
                onChange={(e) => setCompatibilityType(e.target.value)}
                className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="life-path-life-path">Số chủ đạo - Số chủ đạo</option>
                <option value="life-path-zodiac">Số chủ đạo - Cung hoàng đạo</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2 font-medium">
                  {factor1Type === 'life-path' ? 'Số chủ đạo thứ nhất' : 'Yếu tố thứ nhất'}
                </label>
                <select 
                  value={factor1Code} 
                  onChange={(e) => setFactor1Code(e.target.value)}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                >
                  <option value="">-- Chọn --</option>
                  {factor1Type === 'life-path' && lifePathNumbers.map(num => (
                    <option key={`lp1-${num}`} value={num}>Số {num}</option>
                  ))}
                  {factor1Type === 'zodiac' && zodiacSigns.map(sign => (
                    <option key={`zod1-${sign}`} value={sign}>{sign}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-white mb-2 font-medium">
                  {factor2Type === 'life-path' ? 'Số chủ đạo thứ hai' : 'Cung hoàng đạo'}
                </label>
                <select 
                  value={factor2Code} 
                  onChange={(e) => setFactor2Code(e.target.value)}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                >
                  <option value="">-- Chọn --</option>
                  {factor2Type === 'life-path' && lifePathNumbers.map(num => (
                    <option key={`lp2-${num}`} value={num}>Số {num}</option>
                  ))}
                  {factor2Type === 'zodiac' && zodiacSigns.map(sign => (
                    <option key={`zod2-${sign}`} value={sign}>{sign}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-500/20 text-red-200 p-3 rounded-lg border border-red-500/30">
                {error}
              </div>
            )}
            
            <div className="mt-6">
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg transition-all flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang phân tích...
                  </span>
                ) : (
                  'Phân tích tương hợp'
                )}
              </button>
            </div>
          </form>
          
          {showLoginModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-gradient-to-b from-purple-900 to-indigo-900 rounded-xl p-6 max-w-md mx-auto shadow-xl border border-white/20">
                <h2 className="text-xl font-bold mb-4">Đăng nhập để tiếp tục</h2>
                <p className="mb-6">Bạn cần đăng nhập để sử dụng tính năng này.</p>
                <div className="flex space-x-4">
                  <Link 
                    href="/login" 
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded text-center"
                  >
                    Đăng nhập
                  </Link>
                  <button 
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Kết quả tương hợp */}
        {result && (
          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-2xl border border-white/20 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-center">{result.title || 'Kết Quả Phân Tích Tương Hợp'}</h2>
            
            {result.compatibilityScore !== undefined && (
              <div className="mb-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full px-4 py-1 text-sm font-medium">
                    Điểm tương hợp: {result.compatibilityScore}/10
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="relative w-full max-w-sm">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-500">
                        {result.compatibilityScore}/10
                      </span>
                    </div>
                    <div className="h-5 w-full bg-white/10 rounded-full overflow-hidden border border-white/20">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-500 to-indigo-500" 
                        style={{ width: `${(result.compatibilityScore / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center mb-8 space-x-6">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-indigo-500 text-xl font-bold mb-2">
                  {factor1Type === 'life-path' ? factor1Code : 
                    factor1Type === 'zodiac' ? (
                      factor1Code === 'Bạch Dương' ? '♈' :
                      factor1Code === 'Kim Ngưu' ? '♉' :
                      factor1Code === 'Song Tử' ? '♊' :
                      factor1Code === 'Cự Giải' ? '♋' :
                      factor1Code === 'Sư Tử' ? '♌' :
                      factor1Code === 'Xử Nữ' ? '♍' :
                      factor1Code === 'Thiên Bình' ? '♎' :
                      factor1Code === 'Bọ Cạp' ? '♏' :
                      factor1Code === 'Nhân Mã' ? '♐' :
                      factor1Code === 'Ma Kết' ? '♑' :
                      factor1Code === 'Bảo Bình' ? '♒' :
                      '♓'
                    ) : ''
                  }
                </div>
                <span className="text-sm text-white/80">
                  {factor1Type === 'life-path' ? 'Số chủ đạo ' + factor1Code : factor1Code}
                </span>
              </div>
              
              <div className="text-3xl text-white/70">+</div>
              
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-xl font-bold mb-2">
                  {factor2Type === 'life-path' ? factor2Code : 
                    factor2Type === 'zodiac' ? (
                      factor2Code === 'Bạch Dương' ? '♈' :
                      factor2Code === 'Kim Ngưu' ? '♉' :
                      factor2Code === 'Song Tử' ? '♊' :
                      factor2Code === 'Cự Giải' ? '♋' :
                      factor2Code === 'Sư Tử' ? '♌' :
                      factor2Code === 'Xử Nữ' ? '♍' :
                      factor2Code === 'Thiên Bình' ? '♎' :
                      factor2Code === 'Bọ Cạp' ? '♏' :
                      factor2Code === 'Nhân Mã' ? '♐' :
                      factor2Code === 'Ma Kết' ? '♑' :
                      factor2Code === 'Bảo Bình' ? '♒' :
                      '♓'
                    ) : ''
                  }
                </div>
                <span className="text-sm text-white/80">
                  {factor2Type === 'life-path' ? 'Số chủ đạo ' + factor2Code : factor2Code}
                </span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-3">Tổng Quan</h3>
                <p className="whitespace-pre-line text-white/90">{result.overview}</p>
              </div>
              
              {/* Phân tích chi tiết về độ tương hợp */}
              {result.compatibility_breakdown && (
                <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-4">Phân tích chi tiết</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {result.compatibility_breakdown.intellectual !== undefined && (
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <h4 className="text-sm font-medium text-white/70 mb-1">Trí tuệ</h4>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-lg font-semibold inline-block text-indigo-300">
                                {result.compatibility_breakdown.intellectual}/10
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-white/20">
                            <div 
                              style={{ width: `${(result.compatibility_breakdown.intellectual / 10) * 100}%` }} 
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {result.compatibility_breakdown.emotional !== undefined && (
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <h4 className="text-sm font-medium text-white/70 mb-1">Cảm xúc</h4>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-lg font-semibold inline-block text-pink-300">
                                {result.compatibility_breakdown.emotional}/10
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-white/20">
                            <div 
                              style={{ width: `${(result.compatibility_breakdown.emotional / 10) * 100}%` }} 
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {result.compatibility_breakdown.spiritual !== undefined && (
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <h4 className="text-sm font-medium text-white/70 mb-1">Tâm linh</h4>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-lg font-semibold inline-block text-purple-300">
                                {result.compatibility_breakdown.spiritual}/10
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-white/20">
                            <div 
                              style={{ width: `${(result.compatibility_breakdown.spiritual / 10) * 100}%` }} 
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {result.compatibility_breakdown.practical !== undefined && (
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <h4 className="text-sm font-medium text-white/70 mb-1">Thực tế</h4>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-lg font-semibold inline-block text-green-300">
                                {result.compatibility_breakdown.practical}/10
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-white/20">
                            <div 
                              style={{ width: `${(result.compatibility_breakdown.practical / 10) * 100}%` }} 
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {result.compatibility_breakdown.description && (
                    <p className="text-white/90">{result.compatibility_breakdown.description}</p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-3 text-green-300">Điểm Mạnh</h3>
                  <ul className="list-disc pl-5 space-y-2 text-white/90">
                    {result.strengths.map((strength: string, index: number) => (
                      <li key={`strength-${index}`}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-3 text-orange-300">Thách Thức</h3>
                  <ul className="list-disc pl-5 space-y-2 text-white/90">
                    {result.challenges.map((challenge: string, index: number) => (
                      <li key={`challenge-${index}`}>{challenge}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Mô hình giao tiếp */}
              {result.communication_patterns && (
                <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-4 text-yellow-300">Mô hình giao tiếp</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    {result.communication_patterns.strengths && result.communication_patterns.strengths.length > 0 && (
                      <div>
                        <h4 className="text-lg font-medium mb-2">Điểm mạnh trong giao tiếp</h4>
                        <ul className="list-disc pl-5 space-y-1 text-white/90">
                          {result.communication_patterns.strengths.map((item, index) => (
                            <li key={`comm-strength-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {result.communication_patterns.challenges && result.communication_patterns.challenges.length > 0 && (
                      <div>
                        <h4 className="text-lg font-medium mb-2">Thách thức trong giao tiếp</h4>
                        <ul className="list-disc pl-5 space-y-1 text-white/90">
                          {result.communication_patterns.challenges.map((item, index) => (
                            <li key={`comm-challenge-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {result.communication_patterns.advice && (
                    <div>
                      <h4 className="text-lg font-medium mb-2">Lời khuyên cho giao tiếp hiệu quả</h4>
                      <p className="text-white/90">{result.communication_patterns.advice}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Động lực trong mối quan hệ */}
              {result.relationship_dynamics && (
                <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-4 text-pink-300">Động lực trong mối quan hệ</h3>
                  
                  {result.relationship_dynamics.personal && (
                    <div className="mb-4">
                      <h4 className="text-lg font-medium mb-2">Mối quan hệ cá nhân</h4>
                      <p className="text-white/90">{result.relationship_dynamics.personal}</p>
                    </div>
                  )}
                  
                  {result.relationship_dynamics.professional && (
                    <div className="mb-4">
                      <h4 className="text-lg font-medium mb-2">Môi trường làm việc</h4>
                      <p className="text-white/90">{result.relationship_dynamics.professional}</p>
                    </div>
                  )}
                  
                  {result.relationship_dynamics.friendship && (
                    <div>
                      <h4 className="text-lg font-medium mb-2">Tình bạn</h4>
                      <p className="text-white/90">{result.relationship_dynamics.friendship}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Ví dụ nổi tiếng */}
              {result.famous_examples && result.famous_examples.length > 0 && (
                <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-3">Ví dụ nổi tiếng</h3>
                  <ul className="list-disc pl-5 space-y-2 text-white/90">
                    {result.famous_examples.map((example, index) => (
                      <li key={`example-${index}`}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-3 text-blue-300">Lời Khuyên</h3>
                <p className="whitespace-pre-line text-white/90">{result.advice}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Thông tin thêm */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/5 rounded-lg p-5 hover:bg-white/10 transition-all">
            <h3 className="font-medium text-lg mb-2">Thần Số Học</h3>
            <p className="text-white/70 text-sm mb-3">Khám phá chi tiết về các số chủ đạo và ý nghĩa của chúng</p>
            <Link 
              href="/numerology" 
              className="text-indigo-300 hover:text-indigo-200 inline-flex items-center text-sm"
            >
              Xem thêm
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-white/5 rounded-lg p-5 hover:bg-white/10 transition-all">
            <h3 className="font-medium text-lg mb-2">Cung Hoàng Đạo</h3>
            <p className="text-white/70 text-sm mb-3">Tìm hiểu thêm về 12 cung hoàng đạo và đặc điểm của từng cung</p>
            <Link 
              href="/astrology" 
              className="text-indigo-300 hover:text-indigo-200 inline-flex items-center text-sm"
            >
              Xem thêm
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-white/5 rounded-lg p-5 hover:bg-white/10 transition-all">
            <h3 className="font-medium text-lg mb-2">Hồ Sơ Cá Nhân</h3>
            <p className="text-white/70 text-sm mb-3">Xem lại và cập nhật thông tin cá nhân của bạn</p>
            <Link 
              href="/profile" 
              className="text-indigo-300 hover:text-indigo-200 inline-flex items-center text-sm"
            >
              Xem hồ sơ
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 