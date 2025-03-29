'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/lib/cookies';
import { userApi } from '@/lib/api';
import { calculateLifePathNumber, getZodiacSign, getCompatibility, lifePathDescriptions, zodiacDescriptions, normalizeBirthDate } from '@/lib/numerology';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LifePathCard from './LifePathCard';
import ZodiacCard from './ZodiacCard';
import CompatibilityCard from './CompatibilityCard';

type User = {
  id?: number | null;
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  isActive?: boolean;
  isVerified?: boolean;
  roles?: string[];
};

const HomePage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [lifePathNumber, setLifePathNumber] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [compatibility, setCompatibility] = useState<string | null>(null);
  const [lifePathData, setLifePathData] = useState<any>(null);
  const [zodiacData, setZodiacData] = useState<any>(null);
  const [showLifePathDetails, setShowLifePathDetails] = useState(false);
  const [showZodiacDetails, setShowZodiacDetails] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [compatibilityData, setCompatibilityData] = useState<any>(null);

  useEffect(() => {
    // Kiểm tra xác thực
    const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token');
    
    if (token) {
      setIsAuthenticated(true);
      // Lưu token vào localStorage để sử dụng cho API call
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      
      // Lấy thông tin người dùng từ API
      const fetchUserData = async () => {
        try {
          setIsLoading(true);
          console.log('Trang chủ: Bắt đầu lấy thông tin người dùng...');
          
          const userData = await userApi.getCurrentUser();
          
          if (!userData) {
            console.error('Trang chủ: Không nhận được dữ liệu người dùng');
            // Vẫn giữ người dùng đã xác thực, nhưng không có dữ liệu để hiển thị
            setIsLoading(false);
            return;
          }
          
          console.log('Trang chủ: Dữ liệu người dùng nhận được:', {
            id: userData.id || userData._id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            hasId: Boolean(userData.id || userData._id)
          });
          
          if (!userData.id && !userData._id) {
            console.error('Trang chủ: Dữ liệu người dùng không có ID');
            setIsAuthenticated(true); // Vẫn giữ người dùng đã xác thực
            setIsLoading(false);
            return;
          }
          
          // Đặt dữ liệu người dùng
          setUserData(userData);
          const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
          setUserName(fullName || 'Người dùng');
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('userName', fullName || 'Người dùng');
          }
          
          // Tính toán số chủ đạo và cung hoàng đạo nếu có ngày sinh
          if (userData.birthDate) {
            try {
              console.log('Trang chủ: Ngày sinh gốc:', userData.birthDate);
              const normalizedDate = normalizeBirthDate(userData.birthDate);
              console.log('Trang chủ: Ngày sinh sau khi chuẩn hóa:', normalizedDate);
              
              const lpNumber = calculateLifePathNumber(userData.birthDate);
              const zodiac = getZodiacSign(userData.birthDate);
              
              console.log('Trang chủ: Số chủ đạo:', lpNumber);
              console.log('Trang chủ: Cung hoàng đạo:', zodiac);
              
              setLifePathNumber(lpNumber);
              setZodiacSign(zodiac);

              // Lấy dữ liệu số chủ đạo và cung hoàng đạo từ database
              try {
                const lifePathResponse = await fetch(`/api/numerology?type=life-path&code=${lpNumber}&fields=title,overview,traits,strengths,weaknesses,numberMeaning,vibration,personalityTraits,details,symbols,famous_people,compatibility,lucky_elements`);
                if (lifePathResponse.ok) {
                  const lifePathResult = await lifePathResponse.json();
                  if (lifePathResult.data) {
                    setLifePathData(lifePathResult.data);
                    console.log('Trang chủ: Lấy dữ liệu số chủ đạo từ database thành công', lifePathResult.data);
                  }
                }

                // Gọi API với cả name và code để tăng khả năng tìm kiếm
                console.log('Trang chủ: Đang lấy dữ liệu cung hoàng đạo với zodiac =', zodiac);
                const zodiacResponse = await fetch(`/api/numerology?type=zodiac&code=${encodeURIComponent(zodiac)}&fields=title,overview,traits,strengths,weaknesses,element,ruling_planet,date_range,modality,symbol,details,famous_people,compatibility,lucky_elements`);
                
                console.log('Trang chủ: Kết quả API cung hoàng đạo - status:', zodiacResponse.status);
                
                if (zodiacResponse.ok) {
                  const zodiacResult = await zodiacResponse.json();
                  console.log('Trang chủ: Dữ liệu cung hoàng đạo nhận được từ API:', zodiacResult);
                  
                  if (zodiacResult.data) {
                    setZodiacData(zodiacResult.data);
                    console.log('Trang chủ: Lấy dữ liệu cung hoàng đạo từ database thành công', zodiacResult.data);
                  } else {
                    console.error('Trang chủ: Không có dữ liệu cung hoàng đạo trong kết quả API');
                    
                    // Thử lại với cách khác nếu không tìm thấy dữ liệu
                    const fallbackResponse = await fetch(`/api/numerology?type=zodiac&code=${encodeURIComponent(zodiac)}`);
                    if (fallbackResponse.ok) {
                      const fallbackResult = await fallbackResponse.json();
                      console.log('Trang chủ: Kết quả fallback API cung hoàng đạo:', fallbackResult);
                      
                      if (fallbackResult.data) {
                        setZodiacData(fallbackResult.data);
                      } else if (Array.isArray(fallbackResult) && fallbackResult.length > 0) {
                        // Nếu API trả về mảng (trường hợp getAllZodiacData), lấy phần tử đầu tiên phù hợp
                        const matchingZodiac = fallbackResult.find(
                          item => item.code === zodiac || item.title === zodiac || item.name === zodiac
                        );
                        if (matchingZodiac) {
                          setZodiacData(matchingZodiac);
                          console.log('Trang chủ: Tìm thấy cung hoàng đạo trong danh sách:', matchingZodiac);
                        }
                      }
                    }
                  }
                } else {
                  console.error('Trang chủ: Lỗi khi lấy dữ liệu cung hoàng đạo:', zodiacResponse.status);
                }
              } catch (error) {
                console.error('Trang chủ: Lỗi khi lấy dữ liệu từ database:', error);
              }
            } catch (error) {
              console.error('Trang chủ: Lỗi khi tính toán thông tin chiêm tinh:', error);
            }
          }
        } catch (error) {
          console.error('Trang chủ: Lỗi khi lấy thông tin người dùng:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserData();
    } else {
      console.log('Trang chủ: Không tìm thấy token xác thực, chuyển hướng đến trang đăng nhập');
      // Chuyển hướng người dùng đến trang đăng nhập nếu chưa đăng nhập
      router.push('/login');
      setIsLoading(false);
    }
  }, [router]);

  // Lấy dữ liệu tương hợp từ API
  useEffect(() => {
    if (lifePathNumber && zodiacSign && isAuthenticated) {
      console.log("Trang chủ: Bắt đầu lấy dữ liệu tương hợp với params:", {
        lifePathNumber,
        zodiacSign
      });
      
      const fetchCompatibilityData = async () => {
        try {
          const apiUrl = `/api/numerology/compatibility?type=life-path-zodiac&factor1Type=life-path&factor1Code=${lifePathNumber}&factor2Type=zodiac&factor2Code=${zodiacSign}`;
          console.log("Trang chủ: Gọi API", apiUrl);
          
          const response = await fetch(apiUrl);
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Trang chủ: API trả về lỗi:', response.status, errorData);
            return;
          }
          
          const data = await response.json();
          if (data.data) {
            console.log('Trang chủ: Lấy dữ liệu tương hợp từ API thành công', data.data);
            setCompatibilityData(data.data);
          } else {
            console.log('Trang chủ: API không trả về dữ liệu', data);
          }
        } catch (error) {
          console.error('Trang chủ: Lỗi khi lấy dữ liệu tương hợp:', error);
        }
      };
      
      fetchCompatibilityData();
    } else {
      console.log("Trang chủ: Không đủ thông tin để lấy dữ liệu tương hợp", {
        lifePathNumber,
        zodiacSign,
        isAuthenticated
      });
    }
  }, [lifePathNumber, zodiacSign, isAuthenticated]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-800 text-white">
      {isAuthenticated ? (
        <>
          {/* Hiển thị thông tin cá nhân cho người dùng đã đăng nhập */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4">Chào mừng, {userName}</h1>
                
                {lifePathNumber && zodiacSign ? (
                  <p className="text-xl text-white/80">
                    Bạn là người có Số Chủ Đạo <span className="text-pink-400 font-semibold">{lifePathNumber}</span> và 
                    thuộc cung <span className="text-blue-400 font-semibold">{zodiacSign}</span>
                  </p>
                ) : (
                  <p className="text-xl text-white/80">
                    Cập nhật ngày sinh trong <Link href="/profile" className="text-pink-400 hover:text-pink-300 transition">hồ sơ cá nhân</Link> để khám phá thông tin thần số học của bạn
                  </p>
                )}
              </div>
              
              {lifePathNumber && zodiacSign ? (
                <div className="bg-black/30 backdrop-blur-md rounded-xl p-8 border border-white/10 shadow-2xl mb-12">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Số chủ đạo */}
                    <LifePathCard 
                      userData={{ life_path_number: lifePathNumber }}
                      userLifePath={lifePathData}
                      onViewDetails={() => setShowLifePathDetails(true)}
                    />
                    
                    {/* Cung hoàng đạo */}
                    <ZodiacCard 
                      userData={{ zodiac_sign: zodiacSign }}
                      userZodiac={zodiacData}
                      onViewDetails={() => setShowZodiacDetails(true)}
                    />
                  </div>
                  
                  {/* Phần kết hợp số chủ đạo và cung hoàng đạo */}
                  <CompatibilityCard 
                    compatibilityData={compatibilityData}
                    lifePathNumber={lifePathNumber}
                    zodiacSign={zodiacSign}
                    getCompatibility={() => getCompatibility(lifePathNumber, zodiacSign)}
                  />
                </div>
              ) : (
                <div className="bg-black/30 backdrop-blur-md rounded-xl p-8 border border-white/10 shadow-2xl">
                  <p className="text-center text-white/80 mb-6">
                    Bạn chưa cập nhật ngày sinh. Hãy cập nhật để khám phá thông tin thần số học cá nhân.
                  </p>
                  <div className="flex justify-center">
                    <Link 
                      href="/profile" 
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full text-white font-medium hover:from-pink-600 hover:to-indigo-600 transition shadow-lg"
                    >
                      Cập nhật hồ sơ
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold mb-6">Chào mừng đến với Thần Số Học</h1>
            <p className="text-xl text-white/80 mb-8">
              Khám phá bản thân thông qua con số và cung hoàng đạo. Đăng nhập để bắt đầu hành trình khám phá.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login" 
                className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/30 transition shadow-lg"
              >
                Đăng nhập
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full text-white font-medium hover:from-pink-600 hover:to-indigo-600 transition shadow-lg"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Modal chi tiết số chủ đạo */}
      {showLifePathDetails && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 md:p-8 shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowLifePathDetails(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition w-8 h-8 rounded-full bg-black/30 flex items-center justify-center z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="flex items-start mb-6">
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-orange-500 text-xl font-bold mr-4">
                {lifePathNumber}
              </div>
              <div>
                <h2 className="text-2xl font-bold">Số Chủ Đạo: {lifePathNumber}</h2>
                {lifePathData?.title && <p className="text-white/80">{lifePathData.title}</p>}
              </div>
            </div>
            
            {lifePathData ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{lifePathData.title || "Tổng quan"}</h3>
                  <p className="text-white/90">{lifePathData.overview}</p>
                </div>
                
                {lifePathData.traits && lifePathData.traits.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Đặc điểm chính</h3>
                    <ul className="list-disc pl-5 space-y-1 text-white/90">
                      {lifePathData.traits.map((trait: string, index: number) => (
                        <li key={index}>{trait}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lifePathData.strengths && lifePathData.strengths.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Điểm mạnh</h3>
                      <ul className="list-disc pl-5 space-y-1 text-white/90">
                        {lifePathData.strengths.map((strength: string, index: number) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {lifePathData.weaknesses && lifePathData.weaknesses.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Điểm yếu</h3>
                      <ul className="list-disc pl-5 space-y-1 text-white/90">
                        {lifePathData.weaknesses.map((weakness: string, index: number) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {lifePathData.details && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-2">Chi tiết</h3>
                    
                    {lifePathData.details.career && (
                      <div>
                        <h4 className="text-lg font-medium mb-1">Sự nghiệp</h4>
                        <p className="text-white/90">{lifePathData.details.career}</p>
                      </div>
                    )}
                    
                    {lifePathData.details.relationships && (
                      <div>
                        <h4 className="text-lg font-medium mb-1">Các mối quan hệ</h4>
                        <p className="text-white/90">{lifePathData.details.relationships}</p>
                      </div>
                    )}
                    
                    {lifePathData.details.health && (
                      <div>
                        <h4 className="text-lg font-medium mb-1">Sức khỏe</h4>
                        <p className="text-white/90">{lifePathData.details.health}</p>
                      </div>
                    )}
                    
                    {lifePathData.details.spiritual_growth && (
                      <div>
                        <h4 className="text-lg font-medium mb-1">Phát triển tâm linh</h4>
                        <p className="text-white/90">{lifePathData.details.spiritual_growth}</p>
                      </div>
                    )}
                    
                    {lifePathData.details.financial_aspects && (
                      <div>
                        <h4 className="text-lg font-medium mb-1">Khía cạnh tài chính</h4>
                        <p className="text-white/90">{lifePathData.details.financial_aspects}</p>
                      </div>
                    )}
                    
                    {lifePathData.details.life_lessons && (
                      <div>
                        <h4 className="text-lg font-medium mb-1">Bài học cuộc sống</h4>
                        <p className="text-white/90">{lifePathData.details.life_lessons}</p>
                      </div>
                    )}
                    
                    {lifePathData.details.challenges && (
                      <div>
                        <h4 className="text-lg font-medium mb-1">Thách thức</h4>
                        <p className="text-white/90">{lifePathData.details.challenges}</p>
                      </div>
                    )}
                    
                    {lifePathData.details.advice && (
                      <div>
                        <h4 className="text-lg font-medium mb-1">Lời khuyên</h4>
                        <p className="text-white/90">{lifePathData.details.advice}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {lifePathData.symbols && lifePathData.symbols.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Biểu tượng</h3>
                    <ul className="list-disc pl-5 space-y-1 text-white/90">
                      {lifePathData.symbols.map((symbol: string, index: number) => (
                        <li key={index}>{symbol}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {lifePathData.famous_people && lifePathData.famous_people.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Nhân vật nổi tiếng</h3>
                    <ul className="list-disc pl-5 space-y-1 text-white/90">
                      {lifePathData.famous_people.map((person: string, index: number) => (
                        <li key={index}>{person}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {lifePathData.lucky_elements && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Yếu tố may mắn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
                      {lifePathData.lucky_elements.colors && lifePathData.lucky_elements.colors.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-1">Màu sắc:</h4>
                          <p>{lifePathData.lucky_elements.colors.join(", ")}</p>
                        </div>
                      )}
                      {lifePathData.lucky_elements.numbers && lifePathData.lucky_elements.numbers.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-1">Số may mắn:</h4>
                          <p>{lifePathData.lucky_elements.numbers.join(", ")}</p>
                        </div>
                      )}
                      {lifePathData.lucky_elements.days && lifePathData.lucky_elements.days.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-1">Ngày may mắn:</h4>
                          <p>{lifePathData.lucky_elements.days.join(", ")}</p>
                        </div>
                      )}
                      {lifePathData.lucky_elements.gemstones && lifePathData.lucky_elements.gemstones.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-1">Đá quý:</h4>
                          <p>{lifePathData.lucky_elements.gemstones.join(", ")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {lifePathData.compatibility && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Tương hợp</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 text-white/90">
                      {lifePathData.compatibility.most_compatible && lifePathData.compatibility.most_compatible.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-1">Hợp nhất với:</h4>
                          <p>{lifePathData.compatibility.most_compatible.join(", ")}</p>
                        </div>
                      )}
                      {lifePathData.compatibility.least_compatible && lifePathData.compatibility.least_compatible.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-1">Ít hợp với:</h4>
                          <p>{lifePathData.compatibility.least_compatible.join(", ")}</p>
                        </div>
                      )}
                    </div>
                    {lifePathData.compatibility.compatibility_explanation && (
                      <p className="text-white/90">{lifePathData.compatibility.compatibility_explanation}</p>
                    )}
                  </div>
                )}
                
                <div className="pt-4 flex justify-center">
                  <Link 
                    href="/numerology" 
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full text-sm font-medium hover:from-pink-600 hover:to-orange-600 transition shadow-lg"
                  >
                    Xem tất cả số thần số học của bạn
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{lifePathDescriptions[lifePathNumber] ? lifePathDescriptions[lifePathNumber].title : "Tổng quan"}</h3>
                  <p className="text-white/90">{lifePathDescriptions[lifePathNumber] ? lifePathDescriptions[lifePathNumber].description : ""}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Điểm mạnh</h3>
                    <ul className="list-disc pl-5 space-y-1 text-white/90">
                      {lifePathDescriptions[lifePathNumber] && lifePathDescriptions[lifePathNumber].strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Điểm yếu</h3>
                    <ul className="list-disc pl-5 space-y-1 text-white/90">
                      {lifePathDescriptions[lifePathNumber] && lifePathDescriptions[lifePathNumber].weaknesses.map((weakness: string, index: number) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-center">
                  <Link 
                    href="/numerology" 
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full text-sm font-medium hover:from-pink-600 hover:to-orange-600 transition shadow-lg"
                  >
                    Xem tất cả số thần số học của bạn
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Modal chi tiết cung hoàng đạo */}
      {showZodiacDetails && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl p-6 md:p-8 shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowZodiacDetails(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition w-8 h-8 rounded-full bg-black/30 flex items-center justify-center z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="flex items-start mb-6">
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-xl mr-4">
                {zodiacSign === 'Bạch Dương' && '♈'}
                {zodiacSign === 'Kim Ngưu' && '♉'}
                {zodiacSign === 'Song Tử' && '♊'}
                {zodiacSign === 'Cự Giải' && '♋'}
                {zodiacSign === 'Sư Tử' && '♌'}
                {zodiacSign === 'Xử Nữ' && '♍'}
                {zodiacSign === 'Thiên Bình' && '♎'}
                {zodiacSign === 'Bọ Cạp' && '♏'}
                {zodiacSign === 'Nhân Mã' && '♐'}
                {zodiacSign === 'Ma Kết' && '♑'}
                {zodiacSign === 'Bảo Bình' && '♒'}
                {zodiacSign === 'Song Ngư' && '♓'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">Cung {zodiacSign}</h2>
                {zodiacData?.date_range && (
                  <p className="text-white/80">{zodiacData.date_range}</p>
                )}
              </div>
            </div>
            
            {zodiacData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg">
                  {zodiacData?.element && (
                    <div>
                      <h4 className="text-sm font-medium text-white/70">Nguyên tố</h4>
                      <p className="text-white/90">{zodiacData.element}</p>
                    </div>
                  )}
                  
                  {zodiacData?.ruling_planet && (
                    <div>
                      <h4 className="text-sm font-medium text-white/70">Hành tinh cai quản</h4>
                      <p className="text-white/90">{zodiacData.ruling_planet}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Tổng quan</h3>
                  <p className="text-white/90">{zodiacData?.overview || zodiacData?.description || ""}</p>
                </div>
                
                {zodiacData?.traits && zodiacData.traits.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Đặc điểm chính</h3>
                    <ul className="list-disc pl-5 space-y-1 text-white/90">
                      {zodiacData.traits.map((trait: string, index: number) => (
                        <li key={index}>{trait}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {zodiacData?.strengths && zodiacData.strengths.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Điểm mạnh</h3>
                      <ul className="list-disc pl-5 space-y-1 text-white/90">
                        {zodiacData.strengths.map((strength: string, index: number) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {zodiacData?.weaknesses && zodiacData.weaknesses.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Điểm yếu</h3>
                      <ul className="list-disc pl-5 space-y-1 text-white/90">
                        {zodiacData.weaknesses.map((weakness: string, index: number) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {zodiacData?.compatibility && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Tương hợp</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 text-white/90">
                      {zodiacData.compatibility.most_compatible && zodiacData.compatibility.most_compatible.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-1">Hợp nhất với:</h4>
                          <p>{zodiacData.compatibility.most_compatible.join(", ")}</p>
                        </div>
                      )}
                      {zodiacData.compatibility.least_compatible && zodiacData.compatibility.least_compatible.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-1">Ít hợp với:</h4>
                          <p>{zodiacData.compatibility.least_compatible.join(", ")}</p>
                        </div>
                      )}
                    </div>
                    {zodiacData.compatibility.compatibility_explanation && (
                      <p className="text-white/90">{zodiacData.compatibility.compatibility_explanation}</p>
                    )}
                  </div>
                )}
                
                {zodiacData?.details && (
                  <div className="space-y-4 mt-6">
                    <h3 className="text-xl font-semibold mb-2">Chi tiết</h3>
                    
                    {zodiacData.details.personality && (
                      <div>
                        <h4 className="text-lg font-medium mb-1">Tính cách</h4>
                        <p className="text-white/90">{zodiacData.details.personality}</p>
                      </div>
                    )}
                    
                    {zodiacData.details.relationships && (
                      <div>
                        <h4 className="text-lg font-medium mb-1">Các mối quan hệ</h4>
                        <p className="text-white/90">{zodiacData.details.relationships}</p>
                      </div>
                    )}
                    
                    {zodiacData.details.career && (
                      <div>
                        <h4 className="text-lg font-medium mb-1">Sự nghiệp</h4>
                        <p className="text-white/90">{zodiacData.details.career}</p>
                      </div>
                    )}
                    
                    {zodiacData.details.advice && (
                      <div>
                        <h4 className="text-lg font-medium mb-1">Lời khuyên</h4>
                        <p className="text-white/90">{zodiacData.details.advice}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {zodiacData?.famous_people && zodiacData.famous_people.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Người nổi tiếng</h3>
                    <ul className="list-disc pl-5 space-y-1 text-white/90">
                      {zodiacData.famous_people.map((person: string, index: number) => (
                        <li key={index}>{person}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {zodiacData?.lucky_elements && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Yếu tố may mắn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 text-white/90">
                      {zodiacData.lucky_elements.colors && zodiacData.lucky_elements.colors.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-1">Màu sắc:</h4>
                          <p>{zodiacData.lucky_elements.colors.join(", ")}</p>
                        </div>
                      )}
                      {zodiacData.lucky_elements.numbers && zodiacData.lucky_elements.numbers.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-1">Số may mắn:</h4>
                          <p>{zodiacData.lucky_elements.numbers.join(", ")}</p>
                        </div>
                      )}
                      {zodiacData.lucky_elements.days && zodiacData.lucky_elements.days.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-1">Ngày may mắn:</h4>
                          <p>{zodiacData.lucky_elements.days.join(", ")}</p>
                        </div>
                      )}
                      {zodiacData.lucky_elements.gemstones && zodiacData.lucky_elements.gemstones.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-1">Đá quý:</h4>
                          <p>{zodiacData.lucky_elements.gemstones.join(", ")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 flex justify-center">
                  <Link 
                    href="/astrology" 
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition shadow-lg"
                  >
                    Xem tất cả cung hoàng đạo
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Tổng quan</h3>
                  <p className="text-white/90">{zodiacDescriptions[zodiacSign] ? zodiacDescriptions[zodiacSign].description : ""}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Điểm mạnh</h3>
                    <ul className="list-disc pl-5 space-y-1 text-white/90">
                      {zodiacDescriptions[zodiacSign] && zodiacDescriptions[zodiacSign].strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Điểm yếu</h3>
                    <ul className="list-disc pl-5 space-y-1 text-white/90">
                      {zodiacDescriptions[zodiacSign] && zodiacDescriptions[zodiacSign].weaknesses.map((weakness: string, index: number) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-center">
                  <Link 
                    href="/astrology" 
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition shadow-lg"
                  >
                    Xem tất cả cung hoàng đạo
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage; 