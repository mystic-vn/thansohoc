'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCookie } from '@/lib/cookies';
import { userApi } from '@/lib/api';
import { calculateLifePathNumber, normalizeBirthDate } from '@/lib/numerology';

// Hàm tính toán thần số học đơn giản
const calculateSimpleNumber = () => {
  return Math.floor(Math.random() * 9) + 1 + '';
};

// Mô tả các số chủ đạo
const lifePathDescriptions: { [key: string]: { title: string; description: string; strengths: string[]; weaknesses: string[] } } = {
  '1': {
    title: 'Người Tiên Phong',
    description: 'Bạn là người có tính độc lập cao, sáng tạo và có khả năng lãnh đạo tự nhiên. Bạn thường là người tiên phong, mở đường trong nhiều lĩnh vực và có tham vọng lớn.',
    strengths: ['Độc lập', 'Quyết đoán', 'Sáng tạo', 'Tham vọng', 'Tự tin'],
    weaknesses: ['Bướng bỉnh', 'Thống trị', 'Thiếu kiên nhẫn', 'Ích kỷ']
  },
  '2': {
    title: 'Người Hòa Giải',
    description: 'Bạn là người nhạy cảm, hòa đồng và có khả năng ngoại cảm. Bạn thường đóng vai trò là người hòa giải trong các mối quan hệ và có khả năng làm việc hiệu quả trong nhóm.',
    strengths: ['Hợp tác', 'Kiên nhẫn', 'Nhạy cảm', 'Khả năng ngoại cảm', 'Chu đáo'],
    weaknesses: ['Nhút nhát', 'Quá nhạy cảm', 'Do dự', 'Phụ thuộc']
  },
  '3': {
    title: 'Người Sáng Tạo',
    description: 'Bạn là người có khả năng giao tiếp và biểu đạt tuyệt vời. Bạn có tài năng trong các lĩnh vực nghệ thuật, âm nhạc, văn học và có thể truyền cảm hứng cho người khác.',
    strengths: ['Giao tiếp tốt', 'Sáng tạo', 'Lạc quan', 'Hài hước', 'Biểu cảm'],
    weaknesses: ['Phân tán', 'Nông nổi', 'Thiếu tập trung', 'Tự phụ']
  },
  '4': {
    title: 'Người Xây Dựng',
    description: 'Bạn là người thực tế, đáng tin cậy và làm việc chăm chỉ. Bạn có khả năng tổ chức và xây dựng nền tảng vững chắc cho bất kỳ dự án nào.',
    strengths: ['Đáng tin cậy', 'Chăm chỉ', 'Thực tế', 'Tổ chức tốt', 'Trung thành'],
    weaknesses: ['Bảo thủ', 'Cứng nhắc', 'Cầu toàn', 'Thiếu linh hoạt']
  },
  '5': {
    title: 'Người Tự Do',
    description: 'Bạn là người yêu tự do, thích khám phá và mạo hiểm. Bạn thích những thay đổi, trải nghiệm mới và có khả năng thích nghi cao.',
    strengths: ['Linh hoạt', 'Thích nghi', 'Tò mò', 'Năng động', 'Giao tiếp tốt'],
    weaknesses: ['Thiếu kiên nhẫn', 'Bốc đồng', 'Không ổn định', 'Ghét bị ràng buộc']
  },
  '6': {
    title: 'Người Bảo Vệ',
    description: 'Bạn là người có trách nhiệm, yêu thương và quan tâm đến người khác. Bạn thường đặt nhu cầu của gia đình và cộng đồng lên trên nhu cầu của bản thân.',
    strengths: ['Trách nhiệm', 'Chăm sóc', 'Yêu thương', 'Thấu hiểu', 'Cân bằng'],
    weaknesses: ['Hy sinh quá mức', 'Lo lắng', 'Can thiệp', 'Chỉ trích']
  },
  '7': {
    title: 'Người Tìm Kiếm',
    description: 'Bạn là người có trí tuệ, thích phân tích và tìm hiểu sâu về mọi thứ. Bạn thường có xu hướng tâm linh và thích suy ngẫm về các vấn đề triết học.',
    strengths: ['Thông minh', 'Trực giác', 'Phân tích', 'Sâu sắc', 'Tâm linh'],
    weaknesses: ['Khép kín', 'Hoài nghi', 'Quá phân tích', 'Xa cách']
  },
  '8': {
    title: 'Người Thành Đạt',
    description: 'Bạn là người có khả năng quản lý và lãnh đạo xuất sắc. Bạn có tài năng trong lĩnh vực kinh doanh, tài chính và thường đạt được thành công về vật chất.',
    strengths: ['Quyền lực', 'Quyết đoán', 'Quản lý tốt', 'Tham vọng', 'Thực tế'],
    weaknesses: ['Bảo thủ', 'Thống trị', 'Vật chất', 'Căng thẳng']
  },
  '9': {
    title: 'Người Nhân Ái',
    description: 'Bạn là người có lòng nhân ái, vị tha và khả năng thấu hiểu rộng lớn. Bạn thường có xu hướng muốn giúp đỡ người khác và cống hiến cho xã hội.',
    strengths: ['Nhân ái', 'Vị tha', 'Thấu hiểu', 'Sáng tạo', 'Trực giác'],
    weaknesses: ['Lý tưởng hóa', 'Thiếu thực tế', 'Hy sinh', 'Xa cách']
  },
  '11': {
    title: 'Nhà Tiên Tri',
    description: 'Số 11 là số chủ đạo đặc biệt, mang năng lượng tâm linh cao. Bạn có khả năng trực giác mạnh mẽ, có thể nhìn thấy những điều người khác không thấy và truyền cảm hứng cho mọi người.',
    strengths: ['Trực giác', 'Tâm linh', 'Lý tưởng', 'Sáng tạo', 'Truyền cảm hứng'],
    weaknesses: ['Căng thẳng', 'Quá nhạy cảm', 'Không thực tế', 'Thiếu cân bằng']
  },
  '22': {
    title: 'Nhà Kiến Tạo',
    description: 'Số 22 là số chủ đạo mạnh mẽ nhất. Bạn có khả năng biến ước mơ thành hiện thực, tạo nên những thành tựu lớn lao và có tầm nhìn vượt thời gian.',
    strengths: ['Tầm nhìn', 'Thực tế', 'Hiệu quả', 'Quyền lực', 'Ảnh hưởng'],
    weaknesses: ['Áp lực lớn', 'Quá tham vọng', 'Căng thẳng', 'Khó đạt được tiềm năng']
  },
  '33': {
    title: 'Bậc Thầy Tâm Linh',
    description: 'Số 33 là số chủ đạo hiếm và đặc biệt. Bạn có khả năng hy sinh vì người khác, mang đến sự chữa lành và nâng cao tâm thức của nhân loại.',
    strengths: ['Vị tha', 'Tâm linh', 'Chữa lành', 'Trí tuệ', 'Thấu hiểu'],
    weaknesses: ['Hy sinh quá mức', 'Gánh nặng trách nhiệm', 'Thiếu cân bằng', 'Quá lý tưởng']
  }
};

export default function NumerologyPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [lifePathNumber, setLifePathNumber] = useState('');
  const [lifePathData, setLifePathData] = useState<any>(null);
  const [showMoreLifePath, setShowMoreLifePath] = useState(false);
  
  // Các số thần số học khác
  const [destinyNumber, setDestinyNumber] = useState('');
  const [personalityNumber, setPersonalityNumber] = useState('');
  const [soulNumber, setSoulNumber] = useState('');
  const [birthDayNumber, setBirthDayNumber] = useState('');
  
  useEffect(() => {
    // Kiểm tra xác thực
    const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token');
    
    if (!token) {
      // Nếu không có token, chuyển hướng đến trang đăng nhập
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      
      // Lấy thông tin người dùng
      const fetchUserData = async () => {
        try {
          setIsLoading(true);
          
          const userData = await userApi.getCurrentUser();
          
          if (!userData) {
            console.error('Không nhận được dữ liệu người dùng');
            setIsLoading(false);
            return;
          }
          
          setUser(userData);
          
          // Tính toán các số thần số học từ ngày sinh
          if (userData.birthDate) {
            try {
              console.log('Ngày sinh gốc:', userData.birthDate);
              const normalizedDate = normalizeBirthDate(userData.birthDate);
              console.log('Ngày sinh sau khi chuẩn hóa:', normalizedDate);
              
              // Tính số chủ đạo
              const lpNumber = calculateLifePathNumber(userData.birthDate);
              
              setLifePathNumber(lpNumber);
              
              // Tính số ngày sinh
              const day = normalizedDate.split('-')[2];
              setBirthDayNumber(day.startsWith('0') ? day[1] : day);
              
              // Giả lập các số khác (trong thực tế, bạn sẽ sử dụng hàm tính toán thực tế)
              // Tính số định mệnh từ tên đầy đủ
              setDestinyNumber(calculateSimpleNumber());
              // Tính số linh hồn từ nguyên âm trong tên
              setSoulNumber(calculateSimpleNumber());
              // Tính số cá tính từ phụ âm trong tên
              setPersonalityNumber(calculateSimpleNumber());
              
              // Lấy dữ liệu từ database
              await fetchNumerologyData(lpNumber);
            } catch (error) {
              console.error('Lỗi khi tính toán thông tin thần số học:', error);
            }
          } else {
            // Nếu không có ngày sinh, hiển thị thông báo cập nhật
            console.log('Người dùng chưa cập nhật ngày sinh');
          }
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserData();
    }
  }, [router]);
  
  // Hàm lấy dữ liệu thần số học từ database
  const fetchNumerologyData = async (lpNumber: string) => {
    try {
      // Lấy dữ liệu số chủ đạo
      const lifePathResponse = await fetch(`/api/numerology?type=life-path&code=${lpNumber}`);
      if (lifePathResponse.ok) {
        const lifePathResult = await lifePathResponse.json();
        if (lifePathResult.data) {
          setLifePathData(lifePathResult.data);
          console.log('Lấy dữ liệu số chủ đạo từ database thành công', lifePathResult.data);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ database:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Không hiển thị gì cả, vì sẽ chuyển hướng đến trang đăng nhập
  }
  
  if (!user?.birthDate) {
    // Hiển thị thông báo cập nhật ngày sinh
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-800 text-white">
        <header className="bg-black/30 backdrop-blur-md">
          <div className="container mx-auto py-4 px-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-xl font-bold">Thần Số Học</div>
            </Link>
            <nav>
              <Link href="/" className="px-4 py-2 rounded hover:bg-indigo-600/30 transition">
                Trang chủ
              </Link>
            </nav>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Chưa có thông tin ngày sinh</h1>
            <p className="text-xl mb-8">
              Để xem thông tin thần số học đầy đủ, vui lòng cập nhật ngày sinh trong hồ sơ cá nhân của bạn.
            </p>
            <Link 
              href="/profile" 
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full text-lg font-medium hover:from-pink-600 hover:to-orange-600 transition shadow-lg"
            >
              Cập nhật hồ sơ cá nhân
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-800 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-xl font-bold">Thần Số Học</div>
          </Link>
          <nav>
            <Link href="/" className="px-4 py-2 rounded hover:bg-indigo-600/30 transition">
              Trang chủ
            </Link>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Bản đồ thần số học cá nhân</h1>
          
          <div className="text-center mb-8">
            <p className="text-xl">
              {user.firstName} {user.lastName} - Ngày sinh: {new Date(user.birthDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
          
          {/* Phần số chủ đạo */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-center">Số Chủ Đạo</h3>
              <div className="flex justify-center mb-4">
                <div className="h-28 w-28 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 flex items-center justify-center text-5xl font-bold shadow-lg">
                  {lifePathNumber}
                </div>
              </div>
              
              {lifePathData ? (
                <>
                  <p className="mb-4">{lifePathData.overview}</p>
                  
                  <h3 className="text-lg font-semibold mb-2">Đặc điểm chính:</h3>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    {lifePathData.traits.slice(0, showMoreLifePath ? lifePathData.traits.length : 3).map((trait: string, index: number) => (
                      <li key={index}>{trait}</li>
                    ))}
                  </ul>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Điểm mạnh:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {lifePathData.strengths.slice(0, showMoreLifePath ? lifePathData.strengths.length : 3).map((strength: string, index: number) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Điểm yếu:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {lifePathData.weaknesses.slice(0, showMoreLifePath ? lifePathData.weaknesses.length : 3).map((weakness: string, index: number) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {showMoreLifePath && (
                    <>
                      {lifePathData.details && (
                        <>
                          <h3 className="text-lg font-semibold mb-2">Chi tiết:</h3>
                          <div className="space-y-4">
                            {lifePathData.details.career && (
                              <div>
                                <h4 className="font-medium">Sự nghiệp</h4>
                                <p>{lifePathData.details.career}</p>
                              </div>
                            )}
                            {lifePathData.details.relationships && (
                              <div>
                                <h4 className="font-medium">Các mối quan hệ</h4>
                                <p>{lifePathData.details.relationships}</p>
                              </div>
                            )}
                            {lifePathData.details.health && (
                              <div>
                                <h4 className="font-medium">Sức khỏe</h4>
                                <p>{lifePathData.details.health}</p>
                              </div>
                            )}
                            {lifePathData.details.spiritual_growth && (
                              <div>
                                <h4 className="font-medium">Phát triển tâm linh</h4>
                                <p>{lifePathData.details.spiritual_growth}</p>
                              </div>
                            )}
                            {lifePathData.details.financial_aspects && (
                              <div>
                                <h4 className="font-medium">Khía cạnh tài chính</h4>
                                <p>{lifePathData.details.financial_aspects}</p>
                              </div>
                            )}
                            {lifePathData.details.life_lessons && (
                              <div>
                                <h4 className="font-medium">Bài học cuộc sống</h4>
                                <p>{lifePathData.details.life_lessons}</p>
                              </div>
                            )}
                            {lifePathData.details.challenges && (
                              <div>
                                <h4 className="font-medium">Thách thức</h4>
                                <p>{lifePathData.details.challenges}</p>
                              </div>
                            )}
                            {lifePathData.details.advice && (
                              <div>
                                <h4 className="font-medium">Lời khuyên</h4>
                                <p>{lifePathData.details.advice}</p>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                      
                      {lifePathData.symbols && lifePathData.symbols.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">Biểu tượng:</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {lifePathData.symbols.map((symbol: string, index: number) => (
                              <li key={index}>{symbol}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {lifePathData.famous_people && lifePathData.famous_people.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">Nhân vật nổi tiếng:</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {lifePathData.famous_people.map((person: string, index: number) => (
                              <li key={index}>{person}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {lifePathData.lucky_elements && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">Yếu tố may mắn:</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {lifePathData.lucky_elements.colors && lifePathData.lucky_elements.colors.length > 0 && (
                              <div>
                                <h4 className="font-medium">Màu sắc:</h4>
                                <p>{lifePathData.lucky_elements.colors.join(", ")}</p>
                              </div>
                            )}
                            {lifePathData.lucky_elements.numbers && lifePathData.lucky_elements.numbers.length > 0 && (
                              <div>
                                <h4 className="font-medium">Số may mắn:</h4>
                                <p>{lifePathData.lucky_elements.numbers.join(", ")}</p>
                              </div>
                            )}
                            {lifePathData.lucky_elements.days && lifePathData.lucky_elements.days.length > 0 && (
                              <div>
                                <h4 className="font-medium">Ngày may mắn:</h4>
                                <p>{lifePathData.lucky_elements.days.join(", ")}</p>
                              </div>
                            )}
                            {lifePathData.lucky_elements.gemstones && lifePathData.lucky_elements.gemstones.length > 0 && (
                              <div>
                                <h4 className="font-medium">Đá quý:</h4>
                                <p>{lifePathData.lucky_elements.gemstones.join(", ")}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {lifePathData.compatibility && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">Tương hợp:</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            {lifePathData.compatibility.most_compatible && lifePathData.compatibility.most_compatible.length > 0 && (
                              <div>
                                <h4 className="font-medium">Hợp nhất với:</h4>
                                <p>{lifePathData.compatibility.most_compatible.join(", ")}</p>
                              </div>
                            )}
                            {lifePathData.compatibility.least_compatible && lifePathData.compatibility.least_compatible.length > 0 && (
                              <div>
                                <h4 className="font-medium">Ít hợp với:</h4>
                                <p>{lifePathData.compatibility.least_compatible.join(", ")}</p>
                              </div>
                            )}
                          </div>
                          {lifePathData.compatibility.compatibility_explanation && (
                            <p>{lifePathData.compatibility.compatibility_explanation}</p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  
                  <button
                    onClick={() => setShowMoreLifePath(!showMoreLifePath)}
                    className="mt-4 text-indigo-300 hover:text-indigo-200 transition text-sm font-medium flex items-center"
                  >
                    {showMoreLifePath ? 'Thu gọn ↑' : 'Xem thêm ↓'}
                  </button>
                </>
              ) : (
                <p className="mb-4">Đang tải thông tin số chủ đạo...</p>
              )}
            </div>
          </div>
          
          {/* Phần các số khác */}
          <h2 className="text-3xl font-bold text-center mb-6">Các số thần số học khác</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">Số Định Mệnh</h3>
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 flex items-center justify-center text-4xl font-bold shadow-lg">
                  {destinyNumber}
                </div>
              </div>
              <p className="text-center">
                Thể hiện mục đích sống, nhiệm vụ và sứ mệnh của bạn trong cuộc đời này.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">Số Linh Hồn</h3>
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-4xl font-bold shadow-lg">
                  {soulNumber}
                </div>
              </div>
              <p className="text-center">
                Phản ánh bản chất bên trong, khao khát và động lực sâu thẳm của bạn.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">Số Cá Tính</h3>
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-4xl font-bold shadow-lg">
                  {personalityNumber}
                </div>
              </div>
              <p className="text-center">
                Thể hiện cách bạn thể hiện bản thân với thế giới bên ngoài.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">Số Ngày Sinh</h3>
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-4xl font-bold shadow-lg">
                  {birthDayNumber}
                </div>
              </div>
              <p className="text-center">
                Cho biết tài năng bẩm sinh và khả năng đặc biệt của bạn.
              </p>
            </div>
          </div>
          
          {/* Phần biểu đồ và phân tích thời gian */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">Biểu đồ thần số học</h3>
              <div className="aspect-square w-full max-w-xs mx-auto bg-white/5 rounded-lg p-4">
                <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-white/30 rounded-md flex items-center justify-center text-xl font-bold">
                      {/* Đây là nơi sẽ hiển thị các số trong biểu đồ ngày sinh */}
                      {Math.random() > 0.5 ? i + 1 : ''}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-center mt-4">
                Biểu đồ ngày sinh thể hiện các năng lượng và khả năng tiềm ẩn của bạn.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">Năm cá nhân: {new Date().getFullYear()}</h3>
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center text-4xl font-bold shadow-lg">
                  {calculateSimpleNumber()}
                </div>
              </div>
              <p className="mb-4">
                Năm {new Date().getFullYear()} là năm mang năng lượng số {calculateSimpleNumber()} đối với bạn. Đây là thời điểm thuận lợi để...
              </p>
              <div className="text-center">
                <Link
                  href="/year-analysis"
                  className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium hover:bg-white/20 transition"
                >
                  Xem phân tích chi tiết
                </Link>
              </div>
            </div>
          </div>
          
          {/* Phần tương hợp */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Tương hợp thần số học</h3>
            <p className="text-center mb-6">
              Khám phá mức độ tương hợp giữa bạn và người khác dựa trên các con số thần số học.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link
                href="/compatibility"
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition shadow-lg text-center"
              >
                Kiểm tra tương hợp
              </Link>
              <Link
                href="/compatibility-guide"
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-full text-lg font-medium hover:bg-white/20 transition shadow-lg text-center"
              >
                Hướng dẫn tương hợp
              </Link>
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