'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCookie } from '@/lib/cookies';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Xác định cung hoàng đạo từ ngày sinh
const getZodiacSign = (birthDate: string): string => {
  if (!birthDate) return '';

  const [year, month, day] = birthDate.split('-');
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  
  if ((monthNum === 3 && dayNum >= 21) || (monthNum === 4 && dayNum <= 19)) {
    return 'Bạch Dương';
  } else if ((monthNum === 4 && dayNum >= 20) || (monthNum === 5 && dayNum <= 20)) {
    return 'Kim Ngưu';
  } else if ((monthNum === 5 && dayNum >= 21) || (monthNum === 6 && dayNum <= 20)) {
    return 'Song Tử';
  } else if ((monthNum === 6 && dayNum >= 21) || (monthNum === 7 && dayNum <= 22)) {
    return 'Cự Giải';
  } else if ((monthNum === 7 && dayNum >= 23) || (monthNum === 8 && dayNum <= 22)) {
    return 'Sư Tử';
  } else if ((monthNum === 8 && dayNum >= 23) || (monthNum === 9 && dayNum <= 22)) {
    return 'Xử Nữ';
  } else if ((monthNum === 9 && dayNum >= 23) || (monthNum === 10 && dayNum <= 22)) {
    return 'Thiên Bình';
  } else if ((monthNum === 10 && dayNum >= 23) || (monthNum === 11 && dayNum <= 21)) {
    return 'Bọ Cạp';
  } else if ((monthNum === 11 && dayNum >= 22) || (monthNum === 12 && dayNum <= 21)) {
    return 'Nhân Mã';
  } else if ((monthNum === 12 && dayNum >= 22) || (monthNum === 1 && dayNum <= 19)) {
    return 'Ma Kết';
  } else if ((monthNum === 1 && dayNum >= 20) || (monthNum === 2 && dayNum <= 18)) {
    return 'Bảo Bình';
  } else {
    return 'Song Ngư';
  }
};

// Mô tả các cung hoàng đạo
const zodiacDescriptions: { [key: string]: { element: string; planet: string; description: string; compatibility: string[]; strengths: string[]; weaknesses: string[] } } = {
  'Bạch Dương': {
    element: 'Lửa',
    planet: 'Sao Hỏa',
    description: 'Bạch Dương là người năng động, nhiệt tình và đầy tự tin. Họ thích thử thách và luôn muốn là người đi đầu trong mọi việc. Tinh thần chiến đấu và lòng dũng cảm là đặc điểm nổi bật của họ.',
    compatibility: ['Sư Tử', 'Nhân Mã', 'Bảo Bình'],
    strengths: ['Dũng cảm', 'Quyết đoán', 'Tự tin', 'Nhiệt tình', 'Trung thực'],
    weaknesses: ['Nóng nảy', 'Thiếu kiên nhẫn', 'Bốc đồng', 'Ích kỷ', 'Cạnh tranh']
  },
  'Kim Ngưu': {
    element: 'Đất',
    planet: 'Sao Kim',
    description: 'Kim Ngưu là người kiên nhẫn, đáng tin cậy và yêu thích sự ổn định. Họ thường có mắt thẩm mỹ tốt và đánh giá cao những giá trị vật chất. Sự bền bỉ và đáng tin cậy là đặc điểm nổi bật của họ.',
    compatibility: ['Xử Nữ', 'Ma Kết', 'Cự Giải'],
    strengths: ['Kiên nhẫn', 'Đáng tin cậy', 'Thực tế', 'Chăm chỉ', 'Chung thủy'],
    weaknesses: ['Bướng bỉnh', 'Quá cầu toàn', 'Vật chất', 'Ghét thay đổi', 'Chậm chạp']
  },
  'Song Tử': {
    element: 'Khí',
    planet: 'Sao Thủy',
    description: 'Song Tử là người thông minh, linh hoạt và có khả năng giao tiếp tuyệt vời. Họ thích tìm hiểu nhiều thứ khác nhau và luôn tò mò về thế giới xung quanh. Sự lanh lợi và khả năng thích nghi là đặc điểm nổi bật của họ.',
    compatibility: ['Thiên Bình', 'Bảo Bình', 'Sư Tử'],
    strengths: ['Thông minh', 'Giao tiếp tốt', 'Linh hoạt', 'Tò mò', 'Hài hước'],
    weaknesses: ['Thiếu kiên nhẫn', 'Thay đổi thất thường', 'Nông nổi', 'Thiếu tập trung', 'Hai mặt']
  },
  'Cự Giải': {
    element: 'Nước',
    planet: 'Mặt Trăng',
    description: 'Cự Giải là người nhạy cảm, quan tâm và có tính bảo vệ cao. Họ rất gắn bó với gia đình và truyền thống. Sự nhạy cảm và trực giác mạnh mẽ là đặc điểm nổi bật của họ.',
    compatibility: ['Bọ Cạp', 'Song Ngư', 'Kim Ngưu'],
    strengths: ['Nhạy cảm', 'Quan tâm', 'Trực giác', 'Tưởng tượng', 'Bảo vệ'],
    weaknesses: ['Hay thay đổi tâm trạng', 'Quá nhạy cảm', 'Bám víu', 'Khép kín', 'Bi quan']
  },
  'Sư Tử': {
    element: 'Lửa',
    planet: 'Mặt Trời',
    description: 'Sư Tử là người tự tin, hào phóng và có khả năng lãnh đạo tự nhiên. Họ thích được chú ý và ngưỡng mộ. Sự hào phóng và lòng tự hào là đặc điểm nổi bật của họ.',
    compatibility: ['Bạch Dương', 'Nhân Mã', 'Song Tử'],
    strengths: ['Tự tin', 'Hào phóng', 'Lãnh đạo', 'Trung thành', 'Nhiệt tình'],
    weaknesses: ['Tự phụ', 'Độc đoán', 'Thích được chú ý', 'Lười biếng', 'Nóng nảy']
  },
  'Xử Nữ': {
    element: 'Đất',
    planet: 'Sao Thủy',
    description: 'Xử Nữ là người cẩn thận, phân tích và có óc tổ chức tốt. Họ thích sự hoàn hảo và chú ý đến từng chi tiết nhỏ. Sự cẩn thận và tinh thần trách nhiệm là đặc điểm nổi bật của họ.',
    compatibility: ['Kim Ngưu', 'Ma Kết', 'Bọ Cạp'],
    strengths: ['Cẩn thận', 'Phân tích', 'Tổ chức', 'Thực tế', 'Trung thực'],
    weaknesses: ['Hay phê bình', 'Quá cầu toàn', 'Lo lắng', 'Bảo thủ', 'Khó tính']
  },
  'Thiên Bình': {
    element: 'Khí',
    planet: 'Sao Kim',
    description: 'Thiên Bình là người công bằng, hòa đồng và yêu thích sự cân bằng. Họ thường có mắt thẩm mỹ tốt và đánh giá cao vẻ đẹp trong cuộc sống. Sự duyên dáng và khả năng ngoại giao là đặc điểm nổi bật của họ.',
    compatibility: ['Song Tử', 'Bảo Bình', 'Nhân Mã'],
    strengths: ['Công bằng', 'Hòa đồng', 'Ngoại giao', 'Thẩm mỹ', 'Quyến rũ'],
    weaknesses: ['Do dự', 'Thiếu quyết đoán', 'Tránh xung đột', 'Phụ thuộc', 'Hời hợt']
  },
  'Bọ Cạp': {
    element: 'Nước',
    planet: 'Sao Diêm Vương',
    description: 'Bọ Cạp là người quyết đoán, có ý chí mạnh mẽ và rất sâu sắc. Họ có trực giác tốt và thường rất bí ẩn. Sự đam mê và khả năng phục hồi là đặc điểm nổi bật của họ.',
    compatibility: ['Cự Giải', 'Song Ngư', 'Xử Nữ'],
    strengths: ['Quyết đoán', 'Đam mê', 'Trực giác', 'Kiên trì', 'Khả năng phục hồi'],
    weaknesses: ['Ghen tuông', 'Kiểm soát', 'Bí ẩn', 'Thù hận', 'Ám ảnh']
  },
  'Nhân Mã': {
    element: 'Lửa',
    planet: 'Sao Mộc',
    description: 'Nhân Mã là người lạc quan, thích phiêu lưu và yêu tự do. Họ thích khám phá, học hỏi và có tinh thần cởi mở. Sự lạc quan và tinh thần tự do là đặc điểm nổi bật của họ.',
    compatibility: ['Bạch Dương', 'Sư Tử', 'Thiên Bình'],
    strengths: ['Lạc quan', 'Thích phiêu lưu', 'Cởi mở', 'Thẳng thắn', 'Hài hước'],
    weaknesses: ['Thiếu kiên nhẫn', 'Thiếu tế nhị', 'Bốc đồng', 'Hứa hẹn quá nhiều', 'Thiếu tập trung']
  },
  'Ma Kết': {
    element: 'Đất',
    planet: 'Sao Thổ',
    description: 'Ma Kết là người có kỷ luật, trách nhiệm và định hướng mục tiêu rõ ràng. Họ thực tế, kiên nhẫn và có khả năng quản lý tốt. Sự chăm chỉ và tham vọng là đặc điểm nổi bật của họ.',
    compatibility: ['Kim Ngưu', 'Xử Nữ', 'Bọ Cạp'],
    strengths: ['Kỷ luật', 'Trách nhiệm', 'Kiên nhẫn', 'Tham vọng', 'Thực tế'],
    weaknesses: ['Bi quan', 'Quá cầu toàn', 'Khắt khe', 'Lạnh lùng', 'Bảo thủ']
  },
  'Bảo Bình': {
    element: 'Khí',
    planet: 'Sao Thiên Vương',
    description: 'Bảo Bình là người độc lập, sáng tạo và có tư duy tiến bộ. Họ thích đổi mới và có những ý tưởng độc đáo. Sự nguyên bản và tính nhân đạo là đặc điểm nổi bật của họ.',
    compatibility: ['Song Tử', 'Thiên Bình', 'Bạch Dương'],
    strengths: ['Độc lập', 'Sáng tạo', 'Tiến bộ', 'Nhân đạo', 'Nguyên bản'],
    weaknesses: ['Nổi loạn', 'Xa cách', 'Không thực tế', 'Cố chấp', 'Khó đoán']
  },
  'Song Ngư': {
    element: 'Nước',
    planet: 'Sao Hải Vương',
    description: 'Song Ngư là người nhạy cảm, giàu trí tưởng tượng và có tâm hồn nghệ sĩ. Họ thường rất mơ mộng và có khả năng đồng cảm cao. Sự nhạy cảm và lòng vị tha là đặc điểm nổi bật của họ.',
    compatibility: ['Cự Giải', 'Bọ Cạp', 'Ma Kết'],
    strengths: ['Nhạy cảm', 'Giàu trí tưởng tượng', 'Tâm hồn nghệ sĩ', 'Đồng cảm', 'Vị tha'],
    weaknesses: ['Hay mơ mộng', 'Trốn tránh', 'Dễ bị lợi dụng', 'Nhầm lẫn', 'Thiếu thực tế']
  }
};

// Dữ liệu cung hoàng đạo với slug không dấu
const zodiacSlugs: { [key: string]: string } = {
  'Bạch Dương': 'bach-duong',
  'Kim Ngưu': 'kim-nguu',
  'Song Tử': 'song-tu',
  'Cự Giải': 'cu-giai',
  'Sư Tử': 'su-tu',
  'Xử Nữ': 'xu-nu',
  'Thiên Bình': 'thien-binh',
  'Bọ Cạp': 'bo-cap',
  'Nhân Mã': 'nhan-ma',
  'Ma Kết': 'ma-ket',
  'Bảo Bình': 'bao-binh',
  'Song Ngư': 'song-ngu',
};

// Biểu tượng Unicode cho các cung hoàng đạo
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

export default function AstrologyPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [birthDate, setBirthDate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDateError, setBirthDateError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [zodiacSign, setZodiacSign] = useState('');
  
  useEffect(() => {
    // Kiểm tra xác thực
    const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token');
    
    if (!token) {
      // Nếu không có token, chuyển hướng đến trang đăng nhập
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu đầu vào
    if (!birthDate) {
      setBirthDateError('Vui lòng chọn ngày sinh');
      return;
    }
    
    // Xác định cung hoàng đạo
    const sign = getZodiacSign(birthDate);
    
    setZodiacSign(sign);
    setShowResults(true);
  };
  
  if (isLoading) {
    return (
      <LoadingSpinner 
        message="Đang tải thông tin chiêm tinh học của bạn..." 
        showTips={true}
      />
    );
  }
  
  if (!isAuthenticated) {
    return null; // Không hiển thị gì cả, vì sẽ chuyển hướng đến trang đăng nhập
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-800 to-pink-700 text-white">
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Tra cứu Cung Hoàng Đạo</h1>
          
          {!showResults ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      Họ
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-white/20 backdrop-blur-sm border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50 focus:outline-none"
                      placeholder="Nhập họ của bạn"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Tên
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-white/20 backdrop-blur-sm border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50 focus:outline-none"
                      placeholder="Nhập tên của bạn"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDate}
                    onChange={(e) => {
                      setBirthDate(e.target.value);
                      setBirthDateError('');
                    }}
                    className="w-full px-4 py-2 rounded-md bg-white/20 backdrop-blur-sm border border-white/10 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50 focus:outline-none"
                    required
                  />
                  {birthDateError && (
                    <p className="mt-1 text-red-400 text-sm">{birthDateError}</p>
                  )}
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-lg font-medium hover:from-blue-600 hover:to-purple-600 transition shadow-lg"
                  >
                    Tra cứu
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-center">Kết quả</h2>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg mb-6">
                <h3 className="text-xl font-bold mb-3 text-center">
                  Cung hoàng đạo của bạn là:
                </h3>
                <div className="flex justify-center mb-4">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-5xl font-bold shadow-lg">
                    {zodiacSign && ZODIAC_SYMBOLS[zodiacSign]}
                  </div>
                </div>
                
                <p className="text-2xl font-bold text-center mb-4">
                  {zodiacSign}
                </p>
                
                <p className="text-center">
                  {firstName} {lastName}{firstName || lastName ? ', ' : ''}người sinh ngày {new Date(birthDate).toLocaleDateString('vi-VN')}
                </p>
                
                <div className="mt-6 text-center">
                  <Link
                    href={`/astrology/${zodiacSlugs[zodiacSign]}`}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-lg font-medium hover:from-pink-600 hover:to-purple-700 transition shadow-lg"
                  >
                    Xem chi tiết cung {zodiacSign}
                  </Link>
                </div>
              </div>
              
              {/* Thông tin ngắn gọn về cung hoàng đạo */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Tổng quan về cung {zodiacSign}</h3>
                
                {zodiacSign && (
                  <>
                    <p className="mb-4">{zodiacDescriptions[zodiacSign]?.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium mb-2">Nguyên tố:</h4>
                        <p>{zodiacDescriptions[zodiacSign]?.element}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Hành tinh cai quản:</h4>
                        <p>{zodiacDescriptions[zodiacSign]?.planet}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Điểm mạnh:</h4>
                        <ul className="list-disc list-inside">
                          {zodiacDescriptions[zodiacSign]?.strengths.map((strength: string, index: number) => (
                            <li key={index}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Điểm yếu:</h4>
                        <ul className="list-disc list-inside">
                          {zodiacDescriptions[zodiacSign]?.weaknesses.map((weakness: string, index: number) => (
                            <li key={index}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <h4 className="font-medium mt-4 mb-2">Tương hợp với:</h4>
                    <div className="flex flex-wrap gap-2">
                      {zodiacDescriptions[zodiacSign]?.compatibility.map((compatSign: string, index: number) => (
                        <Link
                          key={index}
                          href={`/astrology/${zodiacSlugs[compatSign]}`}
                          className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 transition"
                        >
                          {compatSign}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowResults(false)}
                  className="px-6 py-3 bg-white/10 rounded-full text-lg font-medium hover:bg-white/20 transition"
                >
                  Quay lại tra cứu
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">Danh sách cung hoàng đạo</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.keys(zodiacDescriptions).map((sign) => (
                <Link
                  key={sign}
                  href={`/astrology/${zodiacSlugs[sign]}`}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition shadow-lg text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-lg mx-auto mb-3">
                    {ZODIAC_SYMBOLS[sign]}
                  </div>
                  <h3 className="text-lg font-bold">{sign}</h3>
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