/**
 * Chuẩn hóa ngày sinh từ định dạng bất kỳ sang định dạng YYYY-MM-DD
 * @param birthDate Ngày sinh cần chuẩn hóa
 * @returns Ngày sinh đã chuẩn hóa
 */
export const normalizeBirthDate = (birthDate: string): string => {
  if (!birthDate) return '';

  console.log('Bắt đầu chuẩn hóa ngày sinh:', birthDate);

  try {
    // Xử lý các trường hợp đặc biệt
    // Trường hợp 1: "+019997-02-07T17:00:00.000Z"
    if (birthDate.includes('+')) {
      console.log('Đang xử lý ngày sinh có dấu +');
      const cleanedDate = birthDate.replace('+', '');
      
      // Nếu có định dạng chuỗi ISO
      if (cleanedDate.includes('T')) {
        console.log('Ngày sinh có định dạng ISO');
        const datePart = cleanedDate.split('T')[0];
        const [year, month, day] = datePart.split('-');
        
        // Xử lý năm không hợp lệ (quá dài)
        let normalizedYear = year;
        if (year.length > 4) {
          normalizedYear = year.substring(year.length - 4);
          console.log('Đã chuẩn hóa năm từ', year, 'thành', normalizedYear);
        }
        
        return `${normalizedYear}-${month}-${day}`;
      }
    }
    
    // Trường hợp 2: Định dạng ISO chuẩn "2023-02-07T17:00:00.000Z"
    if (birthDate.includes('T')) {
      console.log('Xử lý định dạng ISO chuẩn');
      // Thử chuyển đổi thành Date object
      const date = new Date(birthDate);
      
      // Kiểm tra xem date có hợp lệ không
      if (!isNaN(date.getTime())) {
        const result = date.toISOString().split('T')[0];
        console.log('Kết quả chuyển đổi ISO:', result);
        return result;
      } else {
        // Nếu không hợp lệ, trích xuất thủ công
        console.log('Không thể chuyển đổi thành Date object, trích xuất thủ công');
        const datePart = birthDate.split('T')[0];
        // Kiểm tra định dạng YYYY-MM-DD
        if (/^\d{1,4}-\d{1,2}-\d{1,2}$/.test(datePart)) {
          const [year, month, day] = datePart.split('-');
          // Chuẩn hóa tháng và ngày thành 2 chữ số
          const normalizedMonth = month.length === 1 ? `0${month}` : month;
          const normalizedDay = day.length === 1 ? `0${day}` : day;
          return `${year}-${normalizedMonth}-${normalizedDay}`;
        }
        return datePart;
      }
    }

    // Trường hợp 3: Định dạng YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      console.log('Ngày sinh đã ở định dạng YYYY-MM-DD');
      return birthDate;
    }
    
    // Trường hợp 4: Các định dạng khác (DD/MM/YYYY, MM/DD/YYYY, v.v.)
    console.log('Thử chuyển đổi định dạng khác');
    
    // Xử lý định dạng ngày/tháng/năm hoặc tháng/ngày/năm
    if (birthDate.includes('/')) {
      const parts = birthDate.split('/');
      if (parts.length === 3) {
        // Giả sử định dạng DD/MM/YYYY
        if (parts[2].length === 4) {
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
    }

    // Thử chuyển đổi bằng Date object
    const date = new Date(birthDate);
    if (!isNaN(date.getTime())) {
      const result = date.toISOString().split('T')[0];
      console.log('Kết quả chuyển đổi định dạng khác:', result);
      return result;
    }

    // Nếu không thể chuyển đổi, trả về chuỗi rỗng
    console.error('Không thể chuẩn hóa ngày sinh:', birthDate);
    return '';
  } catch (error) {
    console.error('Lỗi khi chuẩn hóa ngày sinh:', error);
    return '';
  }
};

/**
 * Tính toán số chủ đạo dựa trên ngày sinh
 * @param birthDate Ngày sinh trong định dạng bất kỳ
 * @returns Số chủ đạo
 */
export const calculateLifePathNumber = (birthDate: string): string => {
  if (!birthDate) return '';

  // Chuẩn hóa ngày sinh
  const normalizedDate = normalizeBirthDate(birthDate);
  if (!normalizedDate) return '';

  // Lấy ngày, tháng, năm từ chuỗi ngày sinh
  const [year, month, day] = normalizedDate.split('-');
  
  // Tính tổng các chữ số của ngày sinh
  const daySum = day.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  const monthSum = month.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  const yearSum = year.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  
  // Tính tổng chung
  let total = daySum + monthSum + yearSum;
  
  // Giảm xuống thành một chữ số (trừ trường hợp số chủ đạo 11, 22, 33)
  while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
    total = total.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  
  return total.toString();
};

/**
 * Xác định cung hoàng đạo từ ngày sinh
 * @param birthDate Ngày sinh trong định dạng bất kỳ
 * @returns Tên cung hoàng đạo
 */
export const getZodiacSign = (birthDate: string): string => {
  if (!birthDate) return '';

  // Chuẩn hóa ngày sinh
  const normalizedDate = normalizeBirthDate(birthDate);
  if (!normalizedDate) return '';

  const [year, month, day] = normalizedDate.split('-');
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

/**
 * Tính toán số định mệnh dựa trên tên đầy đủ
 * @param fullName Tên đầy đủ
 * @returns Số định mệnh
 */
export const calculateDestinyNumber = (fullName: string): string => {
  // Triển khai sau
  return '';
};

/**
 * Tính toán số linh hồn dựa trên nguyên âm trong tên
 * @param fullName Tên đầy đủ
 * @returns Số linh hồn
 */
export const calculateSoulNumber = (fullName: string): string => {
  // Triển khai sau
  return '';
};

/**
 * Tính toán số cá tính dựa trên phụ âm trong tên
 * @param fullName Tên đầy đủ
 * @returns Số cá tính
 */
export const calculatePersonalityNumber = (fullName: string): string => {
  // Triển khai sau
  return '';
};

/**
 * Tính toán số ngày sinh
 * @param birthDate Ngày sinh trong định dạng bất kỳ
 * @returns Số ngày sinh
 */
export const calculateBirthdayNumber = (birthDate: string): string => {
  if (!birthDate) return '';

  // Chuẩn hóa ngày sinh
  const normalizedDate = normalizeBirthDate(birthDate);
  if (!normalizedDate) return '';

  // Lấy ngày từ chuỗi ngày sinh
  const day = normalizedDate.split('-')[2];
  
  // Xóa số 0 ở đầu nếu có
  return day.startsWith('0') ? day[1] : day;
};

/**
 * Tính toán mức độ tương hợp giữa hai yếu tố
 * @param factor1 Yếu tố 1
 * @param factor2 Yếu tố 2  
 * @returns Mức độ tương hợp (0-100)
 */
export const getCompatibility = (factor1: string, factor2: string): number => {
  // Hàm giả lập tạm thời để tránh lỗi build
  return Math.floor(Math.random() * 100);
};

/**
 * Mô tả về các số chủ đạo
 */
export const lifePathDescriptions: Record<string, any> = {
  '1': {
    title: 'Số 1 - Người Tiên Phong',
    overview: 'Nhà lãnh đạo bẩm sinh, độc lập và sáng tạo.',
    traits: ['Độc lập', 'Quyết đoán', 'Sáng tạo', 'Tự tin']
  },
  '2': {
    title: 'Số 2 - Người Hòa Giải',
    overview: 'Người hòa giải, nhạy cảm và hợp tác.',
    traits: ['Nhạy cảm', 'Hợp tác', 'Kiên nhẫn', 'Chu đáo']
  },
  '3': {
    title: 'Số 3 - Người Sáng Tạo',
    overview: 'Người biểu đạt, sáng tạo và lạc quan.',
    traits: ['Lạc quan', 'Sáng tạo', 'Giao tiếp tốt', 'Biểu cảm']
  },
  '4': {
    title: 'Số 4 - Người Xây Dựng',
    overview: 'Người thực tế, đáng tin cậy và có tổ chức.',
    traits: ['Đáng tin cậy', 'Có tổ chức', 'Thực tế', 'Kiên trì']
  },
  '5': {
    title: 'Số 5 - Người Tự Do',
    overview: 'Người ưa phiêu lưu, linh hoạt và yêu tự do.',
    traits: ['Linh hoạt', 'Phiêu lưu', 'Tò mò', 'Thích nghi']
  },
  '6': {
    title: 'Số 6 - Người Bảo Vệ',
    overview: 'Người nuôi dưỡng, trách nhiệm và yêu thương.',
    traits: ['Trách nhiệm', 'Yêu thương', 'Quan tâm', 'Hài hòa']
  },
  '7': {
    title: 'Số 7 - Người Tìm Kiếm',
    overview: 'Người phân tích, nội tâm và tìm kiếm chân lý.',
    traits: ['Phân tích', 'Nội tâm', 'Trực giác', 'Khôn ngoan']
  },
  '8': {
    title: 'Số 8 - Người Thành Đạt',
    overview: 'Người có năng lực, quyền lực và thành công.',
    traits: ['Tự tin', 'Có năng lực', 'Điều hành', 'Tham vọng']
  },
  '9': {
    title: 'Số 9 - Người Nhân Đạo',
    overview: 'Người nhân đạo, từ thiện và khoan dung.',
    traits: ['Nhân đạo', 'Từ thiện', 'Trí tuệ', 'Sâu sắc']
  },
  '11': {
    title: 'Số 11 - Người Trực Giác',
    overview: 'Người có trực giác cao, nhạy cảm và tinh thần.',
    traits: ['Trực giác', 'Sáng suốt', 'Nhạy cảm', 'Tinh thần']
  },
  '22': {
    title: 'Số 22 - Người Kiến Tạo',
    overview: 'Người kiến tạo vĩ đại, có tầm nhìn và khả năng thực tế.',
    traits: ['Tầm nhìn', 'Thực tế', 'Thực hiện', 'Kiến trúc']
  },
  '33': {
    title: 'Số 33 - Người Chỉ Dạy',
    overview: 'Người thầy tâm linh, nuôi dưỡng và phục vụ nhân loại.',
    traits: ['Tâm linh', 'Nuôi dưỡng', 'Phục vụ', 'Tình yêu']
  }
};

/**
 * Mô tả về các cung hoàng đạo
 */
export const zodiacDescriptions: Record<string, any> = {
  'Bạch Dương': {
    title: 'Bạch Dương (Aries)',
    overview: 'Năng động, quyết đoán và nhiệt huyết.',
    element: 'Lửa',
    date_range: '21/3 - 19/4',
    traits: ['Dũng cảm', 'Tự tin', 'Nhiệt tình', 'Quyết đoán']
  },
  'Kim Ngưu': {
    title: 'Kim Ngưu (Taurus)',
    overview: 'Kiên định, đáng tin cậy và thực tế.',
    element: 'Đất',
    date_range: '20/4 - 20/5',
    traits: ['Kiên nhẫn', 'Thực tế', 'Đáng tin cậy', 'Thích sự ổn định']
  },
  'Song Tử': {
    title: 'Song Tử (Gemini)',
    overview: 'Linh hoạt, thông minh và tò mò.',
    element: 'Khí',
    date_range: '21/5 - 20/6',
    traits: ['Thông minh', 'Giao tiếp tốt', 'Linh hoạt', 'Tò mò']
  },
  'Cự Giải': {
    title: 'Cự Giải (Cancer)',
    overview: 'Nhạy cảm, chu đáo và trực giác.',
    element: 'Nước',
    date_range: '21/6 - 22/7',
    traits: ['Nhạy cảm', 'Trực giác', 'Bảo vệ', 'Quan tâm']
  },
  'Sư Tử': {
    title: 'Sư Tử (Leo)',
    overview: 'Tự tin, sáng tạo và hào phóng.',
    element: 'Lửa',
    date_range: '23/7 - 22/8',
    traits: ['Tự tin', 'Sáng tạo', 'Hào phóng', 'Lãnh đạo']
  },
  'Xử Nữ': {
    title: 'Xử Nữ (Virgo)',
    overview: 'Phân tích, cẩn thận và thực tế.',
    element: 'Đất',
    date_range: '23/8 - 22/9',
    traits: ['Phân tích', 'Cẩn thận', 'Thực tế', 'Chu đáo']
  },
  'Thiên Bình': {
    title: 'Thiên Bình (Libra)',
    overview: 'Cân bằng, hài hòa và công bằng.',
    element: 'Khí',
    date_range: '23/9 - 22/10',
    traits: ['Cân bằng', 'Hài hòa', 'Công bằng', 'Ngoại giao']
  },
  'Bọ Cạp': {
    title: 'Bọ Cạp (Scorpio)',
    overview: 'Sâu sắc, quyết tâm và đam mê.',
    element: 'Nước',
    date_range: '23/10 - 21/11',
    traits: ['Quyết tâm', 'Đam mê', 'Trực giác', 'Sâu sắc']
  },
  'Nhân Mã': {
    title: 'Nhân Mã (Sagittarius)',
    overview: 'Phiêu lưu, lạc quan và tự do.',
    element: 'Lửa',
    date_range: '22/11 - 21/12',
    traits: ['Phiêu lưu', 'Lạc quan', 'Tự do', 'Triết lý']
  },
  'Ma Kết': {
    title: 'Ma Kết (Capricorn)',
    overview: 'Kỷ luật, có trách nhiệm và tham vọng.',
    element: 'Đất',
    date_range: '22/12 - 19/1',
    traits: ['Kỷ luật', 'Trách nhiệm', 'Tham vọng', 'Kiên trì']
  },
  'Bảo Bình': {
    title: 'Bảo Bình (Aquarius)',
    overview: 'Độc lập, sáng tạo và nhân đạo.',
    element: 'Khí',
    date_range: '20/1 - 18/2',
    traits: ['Độc lập', 'Sáng tạo', 'Nhân đạo', 'Tiến bộ']
  },
  'Song Ngư': {
    title: 'Song Ngư (Pisces)',
    overview: 'Trực giác, nhạy cảm và giàu trí tưởng tượng.',
    element: 'Nước',
    date_range: '19/2 - 20/3',
    traits: ['Trực giác', 'Nhạy cảm', 'Trí tưởng tượng', 'Thấu cảm']
  }
}; 