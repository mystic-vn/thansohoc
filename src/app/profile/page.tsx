'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCookie, setCookie, syncAuthToken } from '@/lib/cookies';
import { userApi, User, UpdateUserRequest } from '@/lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faCalendarAlt, 
  faEnvelope, 
  faSave, 
  faSpinner,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { calculateLifePathNumber, getZodiacSign, normalizeBirthDate } from '@/lib/numerology';

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UpdateUserRequest>({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Thông tin thần số học và cung hoàng đạo
  const [lifePathNumber, setLifePathNumber] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');

  useEffect(() => {
    // Đồng bộ token giữa cookie và localStorage
    const token = syncAuthToken();
    
    if (!token) {
      console.error('Không tìm thấy token xác thực');
      setError('Vui lòng đăng nhập để xem thông tin cá nhân.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        console.log('Bắt đầu lấy thông tin người dùng...');
        
        // Đảm bảo token được đồng bộ trước khi gọi API
        syncAuthToken();
        
        const userData = await userApi.getCurrentUser();
        
        // Kiểm tra kết quả trả về
        if (!userData) {
          console.error('Không nhận được dữ liệu người dùng từ API');
          setError('Phiên đăng nhập của bạn có thể đã hết hạn. Vui lòng đăng nhập lại.');
          return;
        }
        
        console.log('Thông tin người dùng nhận được:', {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName
        });
        
        if (!userData.id) {
          console.error('Dữ liệu người dùng không chứa ID');
          setError('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.');
          return;
        }

        console.log('Ngày sinh gốc:', userData.birthDate);
        setUser(userData);
        
        // Chuẩn hóa ngày sinh để đảm bảo định dạng đúng
        let formattedBirthDate = '';
        if (userData.birthDate) {
          try {
            const normalizedDate = normalizeBirthDate(userData.birthDate);
            console.log('Ngày sinh sau khi chuẩn hóa:', normalizedDate);
            formattedBirthDate = normalizedDate;
          } catch (e) {
            console.error('Lỗi khi chuẩn hóa ngày sinh:', e);
          }
        }
        
        // Set form data for editing với ngày sinh đã được chuẩn hóa
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          birthDate: formattedBirthDate
        });
        
        // Tính toán số chủ đạo và cung hoàng đạo
        if (userData.birthDate) {
          console.log('Đang tính toán cho ngày sinh:', userData.birthDate);
          const normalizedDate = normalizeBirthDate(userData.birthDate);
          console.log('Ngày sinh sau khi chuẩn hóa:', normalizedDate);
          
          const lpNumber = calculateLifePathNumber(userData.birthDate);
          const zodiac = getZodiacSign(userData.birthDate);
          
          console.log('Số chủ đạo:', lpNumber);
          console.log('Cung hoàng đạo:', zodiac);
          
          setLifePathNumber(lpNumber);
          setZodiacSign(zodiac);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        setError('Không thể lấy thông tin người dùng. Kiểm tra kết nối mạng và thử lại hoặc đăng nhập lại.');
      } finally {
        setIsLoading(false);
      }
    };

    // Thử lại lấy dữ liệu nếu không thành công
    let retryCount = 0;
    const MAX_RETRIES = 2;
    
    const attemptFetchWithRetry = async () => {
      try {
        await fetchUserData();
      } catch (error) {
        console.error(`Lần thử ${retryCount + 1} thất bại:`, error);
        
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Đang thử lại lần ${retryCount}...`);
          
          // Thử làm mới token trước khi thử lại
          if (retryCount === 1) {
            console.log('Đang thử làm mới token...');
            // Xóa token hiện tại và lấy lại từ cookie
            localStorage.removeItem('token');
            syncAuthToken();
          }
          
          // Chờ một khoảng thời gian trước khi thử lại (tăng dần thời gian chờ)
          setTimeout(attemptFetchWithRetry, retryCount * 1500);
        } else {
          console.error('Đã thử lại tối đa số lần, không thể lấy thông tin người dùng');
          setError('Không thể lấy thông tin người dùng sau nhiều lần thử. Vui lòng đăng nhập lại.');
        }
      }
    };
    
    attemptFetchWithRetry();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Nếu thay đổi ngày sinh, cập nhật số chủ đạo và cung hoàng đạo
    if (name === 'birthDate' && value) {
      console.log('Ngày sinh đã thay đổi:', value);
      const normalizedDate = normalizeBirthDate(value);
      console.log('Ngày sinh sau khi chuẩn hóa:', normalizedDate);
      
      const lpNumber = calculateLifePathNumber(value);
      const zodiac = getZodiacSign(value);
      
      console.log('Số chủ đạo mới:', lpNumber);
      console.log('Cung hoàng đạo mới:', zodiac);
      
      setLifePathNumber(lpNumber);
      setZodiacSign(zodiac);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Kiểm tra thông tin người dùng trước khi cập nhật
      if (!user) {
        console.error('Không có thông tin người dùng');
        throw new Error('Không tìm thấy thông tin người dùng. Vui lòng làm mới trang và thử lại.');
      }

      if (!user.id && !user._id) {
        console.error('ID người dùng không hợp lệ');
        throw new Error('Thông tin người dùng không đầy đủ. Vui lòng đăng nhập lại.');
      }

      // Kiểm tra dữ liệu đầu vào
      if (!formData.firstName?.trim()) {
        throw new Error('Vui lòng nhập họ của bạn');
      }
      if (!formData.lastName?.trim()) {
        throw new Error('Vui lòng nhập tên của bạn');
      }
      if (!formData.email?.trim()) {
        throw new Error('Vui lòng nhập email của bạn');
      }

      // Xác thực ngày sinh nếu có
      let normalizedBirthDate = '';
      if (formData.birthDate) {
        normalizedBirthDate = normalizeBirthDate(formData.birthDate);
        if (!normalizedBirthDate) {
          throw new Error('Định dạng ngày sinh không hợp lệ. Vui lòng nhập theo định dạng YYYY-MM-DD');
        }
      }

      // Tạo đối tượng dữ liệu gửi đi với ngày sinh đã chuẩn hóa
      const submitData: UpdateUserRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        birthDate: normalizedBirthDate || formData.birthDate
      };

      console.log('Đang gửi yêu cầu cập nhật thông tin người dùng...');
      console.log('Dữ liệu gửi đi:', submitData);
      console.log('ID người dùng:', user.id || user._id);

      // Lấy token từ localStorage hoặc cookie
      const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token') || localStorage.getItem('token');
      
      if (!token) {
        console.error('Không tìm thấy token xác thực');
        throw new Error('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
      }

      // Gọi API cập nhật thông tin người dùng với token xác thực
      console.log('Bắt đầu gọi API cập nhật...', `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/users/${user.id || user._id}`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/users/${user.id || user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData),
      });

      console.log('Kết quả trả về từ API:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Lỗi từ API:', errorData);
        
        // Xử lý lỗi phổ biến
        if (response.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện thao tác này.');
        } else if (response.status === 404) {
          throw new Error('Không tìm thấy người dùng. Tài khoản có thể đã bị xóa.');
        } else {
          throw new Error(errorData.message || 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
        }
      }

      const updatedUser = await response.json();
      console.log('Thông tin người dùng sau khi cập nhật:', updatedUser);

      // Kiểm tra dữ liệu trả về
      if (!updatedUser || !updatedUser.id) {
        throw new Error('Dữ liệu người dùng trả về không hợp lệ.');
      }

      // Cập nhật thông tin người dùng trong state
      setUser(updatedUser);
      
      // Cập nhật lại dữ liệu form với ngày sinh đã chuẩn hóa
      setFormData({
        firstName: updatedUser.firstName || '',
        lastName: updatedUser.lastName || '',
        email: updatedUser.email || '',
        birthDate: normalizeBirthDate(updatedUser.birthDate || '')
      });

      // Cập nhật số chủ đạo và cung hoàng đạo nếu có ngày sinh
      if (updatedUser.birthDate) {
        console.log('Cập nhật số chủ đạo và cung hoàng đạo với ngày sinh mới:', updatedUser.birthDate);
        const normalizedDate = normalizeBirthDate(updatedUser.birthDate);
        console.log('Ngày sinh sau khi chuẩn hóa:', normalizedDate);
        
        const lpNumber = calculateLifePathNumber(updatedUser.birthDate);
        const zodiac = getZodiacSign(updatedUser.birthDate);
        
        console.log('Số chủ đạo mới:', lpNumber);
        console.log('Cung hoàng đạo mới:', zodiac);
        
        setLifePathNumber(lpNumber);
        setZodiacSign(zodiac);
      }

      setSuccess('Thông tin cá nhân đã được cập nhật thành công!');
      setEditMode(false);
    } catch (err: any) {
      console.error('Lỗi chi tiết khi cập nhật:', err);
      setError(err.message || 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
      
      // Nếu lỗi liên quan đến xác thực, đăng xuất và chuyển hướng người dùng
      if (err.message && (
        err.message.includes('đăng nhập lại') || 
        err.message.includes('phiên') || 
        err.message.includes('token')
      )) {
        setTimeout(() => {
          userApi.logout();
          router.push('/login');
        }, 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  // Thêm hàm xử lý đăng xuất thủ công
  const handleLogout = () => {
    userApi.logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-800 text-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-white mb-8 hover:text-pink-300 transition">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Quay lại trang chủ
        </Link>
        
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-2xl">
          <h1 className="text-3xl font-bold mb-6">Thông tin cá nhân</h1>
          
          {error && (
            <div className="bg-red-400/20 border border-red-400/50 text-white px-4 py-3 rounded-lg mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
              {error.includes('đăng nhập lại') && (
                <div className="mt-3">
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
          
          {success && (
            <div className="bg-green-400/20 border border-green-400/50 text-white px-4 py-3 rounded-lg mb-6" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-white/80 mb-1">
                      Họ
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-white/80 mb-1">
                      Tên
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      disabled
                      className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-white/50 text-white/50 focus:outline-none focus:z-10 sm:text-sm transition cursor-not-allowed"
                      value={formData.email}
                    />
                    <p className="text-xs text-white/50 mt-1">Email không thể thay đổi.</p>
                  </div>
                  
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-white/80 mb-1">
                      Ngày sinh (định dạng YYYY-MM-DD)
                    </label>
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm transition"
                      value={formData.birthDate}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-white/50 mt-1">
                      Ngày sinh được sử dụng để tính số chủ đạo và cung hoàng đạo của bạn.
                    </p>
                  </div>
                  
                  <div className="flex space-x-4 mt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition flex items-center"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} className="mr-2" />
                          Lưu thông tin
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                      onClick={() => setEditMode(false)}
                      disabled={saving}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl overflow-hidden">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
                      <p className="text-white/70">{user?.role}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    <div className="flex items-start">
                      <FontAwesomeIcon icon={faEnvelope} className="mt-1 mr-3 text-white/70" />
                      <div>
                        <p className="text-sm text-white/70">Email</p>
                        <p>{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mt-1 mr-3 text-white/70" />
                      <div>
                        <p className="text-sm text-white/70">Ngày sinh</p>
                        <p>
                          {user?.birthDate 
                            ? normalizeBirthDate(user.birthDate).split('-').reverse().join('/')
                            : 'Chưa cập nhật'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 mt-4 bg-white/10 rounded-lg hover:bg-white/20 transition"
                  >
                    Chỉnh sửa thông tin
                  </button>
                </div>
              )}
            </div>
            
            <div className="border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
              <h2 className="text-xl font-semibold mb-6">Thông tin chiêm tinh</h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-medium mb-2">Số chủ đạo</h3>
                  {lifePathNumber ? (
                    <>
                      <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-2xl font-bold mb-4">
                        {lifePathNumber}
                      </div>
                      <p className="text-white/80">
                        {lifePathNumber === '1' && 'Độc lập, sáng tạo, mạnh mẽ và quyết đoán'}
                        {lifePathNumber === '2' && 'Hợp tác, cân bằng, nhạy cảm và kiên nhẫn'}
                        {lifePathNumber === '3' && 'Sáng tạo, giao tiếp, tự tin và lạc quan'}
                        {lifePathNumber === '4' && 'Vững vàng, thực tế, tổ chức và chăm chỉ'}
                        {lifePathNumber === '5' && 'Tự do, khám phá, thay đổi và phiêu lưu'}
                        {lifePathNumber === '6' && 'Hài hòa, chăm sóc, trách nhiệm và yêu thương'}
                        {lifePathNumber === '7' && 'Phân tích, suy ngẫm, trực giác và khoa học'}
                        {lifePathNumber === '8' && 'Quyền lực, thành công, tham vọng và thịnh vượng'}
                        {lifePathNumber === '9' && 'Nhân đạo, lý tưởng, sáng tạo và từ thiện'}
                        {lifePathNumber === '11' && 'Trực giác cao, sự hiểu biết tâm linh và sứ mệnh'}
                        {lifePathNumber === '22' && 'Kiến trúc sư bậc thầy, thực hiện ước mơ lớn'}
                        {lifePathNumber === '33' && 'Người thầy tinh thần, tình yêu vô điều kiện và phụng sự cao cả'}
                      </p>
                    </>
                  ) : (
                    <p className="text-white/50 italic">Cập nhật ngày sinh để tính toán số chủ đạo của bạn</p>
                  )}
                </div>
                
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-medium mb-2">Cung hoàng đạo</h3>
                  {zodiacSign ? (
                    <>
                      <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl mb-4">
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
                      <p className="font-medium text-lg mb-2">{zodiacSign}</p>
                      <p className="text-white/80">
                        {zodiacSign === 'Bạch Dương' && 'Năng động, nhiệt tình, quyết đoán và dám nghĩ dám làm'}
                        {zodiacSign === 'Kim Ngưu' && 'Kiên định, thực tế, đáng tin cậy và yêu thích sự ổn định'}
                        {zodiacSign === 'Song Tử' && 'Linh hoạt, thông minh, hòa đồng và giao tiếp tốt'}
                        {zodiacSign === 'Cự Giải' && 'Nhạy cảm, trực giác, chăm sóc và gắn bó với gia đình'}
                        {zodiacSign === 'Sư Tử' && 'Tự tin, hào phóng, quyến rũ và có khả năng lãnh đạo'}
                        {zodiacSign === 'Xử Nữ' && 'Cẩn thận, phân tích, thực tế và có óc tổ chức'}
                        {zodiacSign === 'Thiên Bình' && 'Hài hòa, công bằng, thẩm mỹ cao và yêu thích sự cân bằng'}
                        {zodiacSign === 'Bọ Cạp' && 'Quyết tâm, sâu sắc, đam mê và có trực giác mạnh mẽ'}
                        {zodiacSign === 'Nhân Mã' && 'Tự do, tò mò, phiêu lưu và lạc quan'}
                        {zodiacSign === 'Ma Kết' && 'Tham vọng, kỷ luật, trách nhiệm và kiên trì'}
                        {zodiacSign === 'Bảo Bình' && 'Độc lập, sáng tạo, tiến bộ và nhân văn'}
                        {zodiacSign === 'Song Ngư' && 'Nhạy cảm, giàu trí tưởng tượng, đồng cảm và mơ mộng'}
                      </p>
                    </>
                  ) : (
                    <p className="text-white/50 italic">Cập nhật ngày sinh để xác định cung hoàng đạo của bạn</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 