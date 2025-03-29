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
    
    // Trường hợp 4: Định dạng iPhone "ngày 9 thg 2, 1997"
    if (birthDate.includes('ngày') && birthDate.includes('thg')) {
      console.log('Đang xử lý định dạng iPhone');
      try {
        // Trích xuất ngày, tháng và năm từ chuỗi
        const dayMatch = birthDate.match(/ngày\s+(\d+)/i);
        const monthMatch = birthDate.match(/thg\s+(\d+)/i);
        const yearMatch = birthDate.match(/,?\s*(\d{4})/);
        
        if (dayMatch && monthMatch && yearMatch) {
          const day = parseInt(dayMatch[1]);
          const month = parseInt(monthMatch[1]);
          const year = parseInt(yearMatch[1]);
          
          // Chuẩn hóa định dạng
          const formattedDay = day < 10 ? `0${day}` : `${day}`;
          const formattedMonth = month < 10 ? `0${month}` : `${month}`;
          
          console.log(`Đã chuyển đổi "${birthDate}" thành ${year}-${formattedMonth}-${formattedDay}`);
          return `${year}-${formattedMonth}-${formattedDay}`;
        }
      } catch (error) {
        console.error('Lỗi khi xử lý định dạng iPhone:', error);
      }
    }
    
    // Trường hợp 5: Các định dạng khác (DD/MM/YYYY, MM/DD/YYYY, v.v.)
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
    description: 'Bạch Dương là cung đầu tiên trong vòng hoàng đạo, đại diện cho sự khởi đầu mới, năng lượng và hành động. Người thuộc cung Bạch Dương thường nhiệt tình, dũng cảm và không ngại khó khăn. Họ là những người tiên phong, luôn đi đầu và sẵn sàng đối mặt với thử thách.',
    element: 'Lửa',
    date_range: '21/3 - 19/4',
    traits: ['Dũng cảm', 'Tự tin', 'Nhiệt tình', 'Quyết đoán'],
    strengths: ['Năng động và đầy sức sống', 'Quyết đoán và can đảm', 'Tự tin và không ngại thử thách', 'Tinh thần lãnh đạo mạnh mẽ'],
    weaknesses: ['Thiếu kiên nhẫn', 'Bốc đồng và nóng nảy', 'Thích cạnh tranh quá mức', 'Có thể ích kỷ']
  },
  'Kim Ngưu': {
    title: 'Kim Ngưu (Taurus)',
    overview: 'Kiên định, đáng tin cậy và thực tế.',
    description: 'Kim Ngưu là những người thực tế, đáng tin cậy và có tình yêu lớn với vẻ đẹp và sự thoải mái. Họ thường kiên nhẫn, chăm chỉ và kiên định trong mọi việc họ làm. Người Kim Ngưu thích sự ổn định và không thích thay đổi đột ngột trong cuộc sống.',
    element: 'Đất',
    date_range: '20/4 - 20/5',
    traits: ['Kiên nhẫn', 'Thực tế', 'Đáng tin cậy', 'Thích sự ổn định'],
    strengths: ['Kiên nhẫn và đáng tin cậy', 'Thực tế và có tổ chức', 'Trung thành và tận tâm', 'Yêu thích vẻ đẹp và nghệ thuật'],
    weaknesses: ['Bướng bỉnh và cứng đầu', 'Ngại thay đổi', 'Có thể quá cẩn trọng', 'Đôi khi quá cố chấp']
  },
  'Song Tử': {
    title: 'Song Tử (Gemini)',
    overview: 'Linh hoạt, thông minh và tò mò.',
    description: 'Song Tử là những người thông minh, tò mò và rất linh hoạt. Họ có khả năng giao tiếp xuất sắc và luôn thích học hỏi những điều mới. Người Song Tử dễ dàng thích nghi với môi trường xung quanh và thường có nhiều sở thích khác nhau.',
    element: 'Khí',
    date_range: '21/5 - 20/6',
    traits: ['Thông minh', 'Giao tiếp tốt', 'Linh hoạt', 'Tò mò'],
    strengths: ['Thông minh và học hỏi nhanh', 'Giao tiếp xuất sắc', 'Thích nghi tốt với mọi hoàn cảnh', 'Sáng tạo và đa tài'],
    weaknesses: ['Hay thay đổi ý kiến', 'Có thể hời hợt', 'Thiếu kiên nhẫn', 'Đôi khi thiếu tập trung']
  },
  'Cự Giải': {
    title: 'Cự Giải (Cancer)',
    overview: 'Nhạy cảm, chu đáo và trực giác.',
    description: 'Cự Giải là những người nhạy cảm, quan tâm và rất trực giác. Họ coi trọng gia đình và có bản năng bảo vệ mạnh mẽ. Người Cự Giải thường rất chu đáo, tình cảm và có ký ức tốt, đặc biệt về những kỷ niệm cảm xúc.',
    element: 'Nước',
    date_range: '21/6 - 22/7',
    traits: ['Nhạy cảm', 'Trực giác', 'Bảo vệ', 'Quan tâm'],
    strengths: ['Nhạy cảm và đầy trực giác', 'Coi trọng gia đình và tình cảm', 'Chu đáo và biết quan tâm người khác', 'Kiên trì và bền bỉ'],
    weaknesses: ['Dễ tổn thương', 'Hay lo lắng thái quá', 'Có thể bảo thủ', 'Đôi khi quá bảo vệ người thân']
  },
  'Sư Tử': {
    title: 'Sư Tử (Leo)',
    overview: 'Tự tin, sáng tạo và hào phóng.',
    description: 'Sư Tử là những người tự tin, hào phóng và có khả năng lãnh đạo tự nhiên. Họ thích được chú ý và thường rất sáng tạo. Người Sư Tử thường nhiệt tình, sống động và luôn mang lại năng lượng tích cực cho mọi người xung quanh.',
    element: 'Lửa',
    date_range: '23/7 - 22/8',
    traits: ['Tự tin', 'Sáng tạo', 'Hào phóng', 'Lãnh đạo'],
    strengths: ['Tự tin và có khả năng lãnh đạo', 'Sáng tạo và nhiệt huyết', 'Hào phóng và trung thành', 'Tinh thần lạc quan'],
    weaknesses: ['Tự cao và kiêu ngạo', 'Thích được chú ý quá mức', 'Đôi khi độc đoán', 'Khó chấp nhận chỉ trích']
  },
  'Xử Nữ': {
    title: 'Xử Nữ (Virgo)',
    overview: 'Phân tích, cẩn thận và thực tế.',
    description: 'Xử Nữ là những người cẩn thận, chi tiết và có óc phân tích sắc bén. Họ thường rất thực tế và luôn tìm cách cải thiện mọi thứ. Người Xử Nữ thường rất ngăn nắp, có tổ chức và luôn quan tâm đến sức khỏe cũng như lối sống lành mạnh.',
    element: 'Đất',
    date_range: '23/8 - 22/9',
    traits: ['Phân tích', 'Cẩn thận', 'Thực tế', 'Chu đáo'],
    strengths: ['Phân tích và cẩn thận', 'Thực tế và đáng tin cậy', 'Chú ý đến chi tiết', 'Chăm chỉ và có tổ chức'],
    weaknesses: ['Hay phê bình', 'Quá lo lắng về chi tiết', 'Quá cầu toàn', 'Đôi khi khó tính']
  },
  'Thiên Bình': {
    title: 'Thiên Bình (Libra)',
    overview: 'Cân bằng, hài hòa và công bằng.',
    description: 'Thiên Bình là những người coi trọng sự cân bằng, hài hòa và công bằng. Họ thường có khả năng ngoại giao tốt và luôn tìm cách tạo sự hòa thuận. Người Thiên Bình thường có gu thẩm mỹ cao, thích vẻ đẹp và ghét xung đột.',
    element: 'Khí',
    date_range: '23/9 - 22/10',
    traits: ['Cân bằng', 'Hài hòa', 'Công bằng', 'Ngoại giao'],
    strengths: ['Khả năng ngoại giao tốt', 'Công bằng và cân nhắc mọi khía cạnh', 'Gu thẩm mỹ tinh tế', 'Thân thiện và hòa đồng'],
    weaknesses: ['Khó quyết định', 'Đôi khi quá phụ thuộc vào người khác', 'Tránh xung đột quá mức', 'Hay do dự']
  },
  'Bọ Cạp': {
    title: 'Bọ Cạp (Scorpio)',
    overview: 'Sâu sắc, quyết tâm và đam mê.',
    description: 'Bọ Cạp là những người sâu sắc, đam mê và đầy quyết tâm. Họ có trực giác mạnh mẽ và thường rất bí ẩn. Người Bọ Cạp thường có ý chí sắt đá, kiên trì theo đuổi mục tiêu và không dễ dàng từ bỏ điều họ muốn.',
    element: 'Nước',
    date_range: '23/10 - 21/11',
    traits: ['Quyết tâm', 'Đam mê', 'Trực giác', 'Sâu sắc'],
    strengths: ['Quyết tâm và kiên trì', 'Trực giác sắc bén', 'Tâm lý sâu sắc', 'Tận tâm và trung thành'],
    weaknesses: ['Đôi khi quá ghen tuông', 'Hay nghi ngờ', 'Thích kiểm soát', 'Khó tin tưởng người khác']
  },
  'Nhân Mã': {
    title: 'Nhân Mã (Sagittarius)',
    overview: 'Phiêu lưu, lạc quan và tự do.',
    description: 'Nhân Mã là những người yêu tự do, thích phiêu lưu và luôn lạc quan. Họ thường có tầm nhìn rộng và quan tâm đến triết lý, tôn giáo. Người Nhân Mã thường thẳng thắn, hài hước và luôn mang đến năng lượng tích cực cho những người xung quanh.',
    element: 'Lửa',
    date_range: '22/11 - 21/12',
    traits: ['Phiêu lưu', 'Lạc quan', 'Tự do', 'Triết lý'],
    strengths: ['Lạc quan và nhiệt tình', 'Yêu tự do và phiêu lưu', 'Thẳng thắn và chân thành', 'Tư duy rộng mở'],
    weaknesses: ['Thiếu kiên nhẫn', 'Đôi khi thiếu tế nhị', 'Hay hứa mà không giữ lời', 'Khó gắn bó lâu dài']
  },
  'Ma Kết': {
    title: 'Ma Kết (Capricorn)',
    overview: 'Kỷ luật, có trách nhiệm và tham vọng.',
    description: 'Ma Kết là những người có kỷ luật, trách nhiệm và đầy tham vọng. Họ luôn hướng đến thành công và sẵn sàng làm việc chăm chỉ để đạt được mục tiêu. Người Ma Kết thường rất thực tế, kiên nhẫn và có khả năng tổ chức tốt.',
    element: 'Đất',
    date_range: '22/12 - 19/1',
    traits: ['Kỷ luật', 'Trách nhiệm', 'Tham vọng', 'Kiên trì'],
    strengths: ['Kỷ luật và có trách nhiệm', 'Kiên trì và chăm chỉ', 'Có tổ chức và thực tế', 'Đáng tin cậy và ổn định'],
    weaknesses: ['Đôi khi quá nghiêm túc', 'Hay chỉ trích', 'Quá cầu toàn', 'Khó thích nghi với thay đổi']
  },
  'Bảo Bình': {
    title: 'Bảo Bình (Aquarius)',
    overview: 'Độc lập, sáng tạo và nhân đạo.',
    description: 'Bảo Bình là những người độc lập, sáng tạo và có tầm nhìn đi trước thời đại. Họ thường có tư duy độc đáo và quan tâm đến lợi ích cộng đồng. Người Bảo Bình thường thân thiện, nhưng đôi khi có vẻ xa cách do thế giới nội tâm phong phú của họ.',
    element: 'Khí',
    date_range: '20/1 - 18/2',
    traits: ['Độc lập', 'Sáng tạo', 'Nhân đạo', 'Tiến bộ'],
    strengths: ['Sáng tạo và độc đáo', 'Tư duy cấp tiến', 'Quan tâm đến nhân loại', 'Thân thiện và hòa đồng'],
    weaknesses: ['Đôi khi quá nổi loạn', 'Có thể xa cách về cảm xúc', 'Khó đoán và khó hiểu', 'Hay bất đồng ý kiến']
  },
  'Song Ngư': {
    title: 'Song Ngư (Pisces)',
    overview: 'Trực giác, nhạy cảm và giàu trí tưởng tượng.',
    description: 'Song Ngư là những người nhạy cảm, giàu trí tưởng tượng và có khả năng đồng cảm cao. Họ thường rất mơ mộng và có thiên hướng nghệ thuật. Người Song Ngư thường rất trực giác, dễ xúc động và luôn sẵn sàng giúp đỡ người khác.',
    element: 'Nước',
    date_range: '19/2 - 20/3',
    traits: ['Trực giác', 'Nhạy cảm', 'Trí tưởng tượng', 'Thấu cảm'],
    strengths: ['Giàu trí tưởng tượng và sáng tạo', 'Nhạy cảm và thấu hiểu', 'Trực giác mạnh mẽ', 'Giàu lòng trắc ẩn'],
    weaknesses: ['Hay mơ mộng quá mức', 'Dễ bị tổn thương', 'Đôi khi trốn tránh thực tế', 'Khó từ chối người khác']
  }
}; 