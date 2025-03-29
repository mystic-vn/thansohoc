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
 * Mô tả về các số chủ đạo
 */
export const lifePathDescriptions: Record<string, {
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
}> = {
  '1': {
    title: 'Người Tiên Phong',
    description: 'Số 1 đại diện cho sự độc lập, sáng tạo, quyết đoán và khả năng lãnh đạo. Những người có số chủ đạo 1 thường có ý chí mạnh mẽ, tham vọng và khả năng tạo ra những con đường mới.',
    strengths: ['Tính độc lập và quyết đoán cao', 'Khả năng lãnh đạo và sáng tạo', 'Tham vọng và ý chí mạnh mẽ', 'Dũng cảm và tự tin'],
    weaknesses: ['Đôi khi quá độc đoán', 'Thiếu kiên nhẫn', 'Có thể tỏ ra cứng đầu', 'Khó chấp nhận ý kiến trái chiều']
  },
  '2': {
    title: 'Người Hòa Giải',
    description: 'Số 2 đại diện cho sự hợp tác, cân bằng, nhạy cảm và kiên nhẫn. Những người có số chủ đạo 2 thường giỏi làm việc nhóm, có khả năng ngoại giao và tạo dựng sự hài hòa trong các mối quan hệ.',
    strengths: ['Nhạy cảm và trực giác tốt', 'Khả năng làm việc nhóm xuất sắc', 'Thiên về hòa giải và cân bằng', 'Kiên nhẫn và chu đáo'],
    weaknesses: ['Dễ bị tổn thương', 'Đôi khi thiếu quyết đoán', 'Có thể phụ thuộc vào người khác', 'Lo lắng quá mức']
  },
  '3': {
    title: 'Người Sáng Tạo',
    description: 'Số 3 đại diện cho sự sáng tạo, biểu đạt, giao tiếp và niềm vui. Những người có số chủ đạo 3 thường có tài năng nghệ thuật, khả năng truyền đạt tuyệt vời và mang đến năng lượng tích cực cho người khác.',
    strengths: ['Sáng tạo và biểu đạt tốt', 'Năng lượng tích cực và vui vẻ', 'Khả năng giao tiếp và truyền cảm hứng', 'Óc tưởng tượng phong phú'],
    weaknesses: ['Đôi khi thiếu tập trung', 'Có thể nông nổi hoặc hời hợt', 'Dễ phân tán năng lượng', 'Ngại đối mặt với khó khăn']
  },
  '4': {
    title: 'Người Xây Dựng',
    description: 'Số 4 đại diện cho sự vững vàng, thực tế, có tổ chức và chăm chỉ. Những người có số chủ đạo 4 thường đáng tin cậy, có phương pháp và tạo dựng nền tảng vững chắc cho mọi việc.',
    strengths: ['Đáng tin cậy và thực tế', 'Có tổ chức và phương pháp', 'Kiên trì và chăm chỉ', 'Trung thực và đáng tin cậy'],
    weaknesses: ['Đôi khi quá cứng nhắc', 'Có thể bảo thủ', 'Thiếu linh hoạt', 'Lo lắng quá mức về an toàn']
  },
  '5': {
    title: 'Người Phiêu Lưu',
    description: 'Số 5 đại diện cho sự tự do, khám phá, thay đổi và phiêu lưu. Những người có số chủ đạo 5 thường thích nghi nhanh với hoàn cảnh mới, yêu thích trải nghiệm và luôn tìm kiếm sự đa dạng trong cuộc sống.',
    strengths: ['Yêu tự do và phiêu lưu', 'Thích nghi nhanh với thay đổi', 'Tò mò và ham học hỏi', 'Năng động và sống hết mình'],
    weaknesses: ['Có thể thiếu kiên định', 'Khó cam kết lâu dài', 'Đôi khi bốc đồng', 'Dễ chán và tìm kiếm kích thích mới']
  },
  '6': {
    title: 'Người Nuôi Dưỡng',
    description: 'Số 6 đại diện cho sự hài hòa, chăm sóc, trách nhiệm và yêu thương. Những người có số chủ đạo 6 thường quan tâm đến gia đình, cộng đồng và luôn sẵn sàng giúp đỡ người khác.',
    strengths: ['Giàu lòng trắc ẩn và trách nhiệm', 'Quan tâm đến gia đình và cộng đồng', 'Yêu thương và chăm sóc người khác', 'Khả năng tạo sự cân bằng và hài hòa'],
    weaknesses: ['Có thể quá lo lắng cho người khác', 'Đôi khi hy sinh bản thân quá mức', 'Xu hướng phán xét', 'Quá hoàn hảo chủ nghĩa']
  },
  '7': {
    title: 'Người Tìm Kiếm Chân Lý',
    description: 'Số 7 đại diện cho sự phân tích, suy ngẫm, trực giác và khoa học. Những người có số chủ đạo 7 thường có tư duy sâu sắc, thích khám phá bí ẩn và tìm kiếm kiến thức sâu rộng.',
    strengths: ['Tư duy phân tích sâu sắc', 'Trực giác mạnh mẽ', 'Ham học hỏi và nghiên cứu', 'Khả năng tập trung cao'],
    weaknesses: ['Có thể quá cô lập bản thân', 'Đôi khi hoài nghi thái quá', 'Khó chia sẻ cảm xúc', 'Có thể tỏ ra lạnh lùng hoặc xa cách']
  },
  '8': {
    title: 'Người Thành Đạt',
    description: 'Số 8 đại diện cho quyền lực, thành công, tham vọng và thịnh vượng. Những người có số chủ đạo 8 thường có khả năng quản lý, lãnh đạo và tạo dựng sự ổn định về tài chính và vật chất.',
    strengths: ['Tài năng quản lý và tổ chức', 'Hướng đến thành công và thịnh vượng', 'Quyết đoán và tự tin', 'Khả năng xây dựng cơ sở vững chắc'],
    weaknesses: ['Có thể quá tập trung vào vật chất', 'Đôi khi quá cạnh tranh', 'Xu hướng kiểm soát', 'Áp lực thành công cao']
  },
  '9': {
    title: 'Người Nhân Đạo',
    description: 'Số 9 đại diện cho tính nhân đạo, lý tưởng, sáng tạo và từ thiện. Những người có số chủ đạo 9 thường có tầm nhìn rộng lớn, giàu lòng trắc ẩn và muốn đóng góp cho xã hội.',
    strengths: ['Tinh thần nhân đạo và vị tha', 'Hiểu biết sâu rộng và khôn ngoan', 'Sáng tạo và truyền cảm hứng', 'Khả năng nhìn nhận toàn cảnh'],
    weaknesses: ['Có thể quá lý tưởng hóa', 'Đôi khi khó buông bỏ', 'Có thể hy sinh bản thân quá mức', 'Xu hướng cầu toàn']
  },
  '11': {
    title: 'Người Giác Ngộ',
    description: 'Số 11 là số chủ đạo đặc biệt, đại diện cho trực giác cao, sự hiểu biết tâm linh và sứ mệnh. Những người có số chủ đạo 11 thường có khả năng nhạy cảm cao, tầm nhìn sâu sắc và khả năng truyền cảm hứng cho người khác.',
    strengths: ['Trực giác cao và nhạy cảm', 'Tầm nhìn tâm linh và siêu hình', 'Khả năng truyền cảm hứng và giác ngộ', 'Suy nghĩ sáng tạo và đột phá'],
    weaknesses: ['Dễ bị căng thẳng thần kinh', 'Mơ mộng và không thực tế', 'Cảm xúc không ổn định', 'Quá nhạy cảm với môi trường']
  },
  '22': {
    title: 'Người Kiến Trúc Vĩ Đại',
    description: 'Số 22 là số chủ đạo đặc biệt, được gọi là "Kiến Trúc Sư Bậc Thầy", đại diện cho khả năng biến ước mơ thành hiện thực. Những người có số chủ đạo 22 có tiềm năng tạo ra những thành tựu lớn, có tầm ảnh hưởng rộng.',
    strengths: ['Năng lực xây dựng những điều vĩ đại', 'Tầm nhìn thực tế và cách mạng', 'Khả năng biến ước mơ thành hiện thực', 'Trí tuệ và sự kiên trì phi thường'],
    weaknesses: ['Áp lực nặng nề từ tiềm năng lớn', 'Có thể bị choáng ngợp bởi sứ mệnh', 'Đôi khi đặt ra tiêu chuẩn quá cao', 'Khó cân bằng công việc và đời sống']
  },
  '33': {
    title: 'Người Thầy Vĩ Đại',
    description: 'Số 33 là số chủ đạo hiếm gặp và đặc biệt nhất, được gọi là "Người Thầy Tinh Thần". Những người có số chủ đạo 33 mang sứ mệnh phụng sự nhân loại với tình yêu vô điều kiện và khả năng chữa lành.',
    strengths: ['Tinh thần phụng sự cao cả', 'Tình yêu vô điều kiện', 'Khả năng chữa lành và chỉ dẫn', 'Sự khôn ngoan và thấu hiểu sâu sắc'],
    weaknesses: ['Có thể quên chăm sóc bản thân', 'Mang trách nhiệm quá nặng nề', 'Đặt kỳ vọng quá cao vào bản thân và người khác', 'Khó từ chối giúp đỡ khi cần']
  }
};

/**
 * Mô tả về các cung hoàng đạo
 */
export const zodiacDescriptions: Record<string, {
  element: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
}> = {
  'Bạch Dương': {
    element: 'Lửa',
    description: 'Bạch Dương là cung đầu tiên trong hoàng đạo, đại diện cho sự khởi đầu mới, năng lượng và nhiệt huyết. Người thuộc cung Bạch Dương thường năng động, nhiệt tình, quyết đoán và dám nghĩ dám làm.',
    strengths: ['Dũng cảm và quyết đoán', 'Nhiệt huyết và năng động', 'Tự tin và độc lập', 'Khả năng lãnh đạo tự nhiên'],
    weaknesses: ['Nóng nảy và thiếu kiên nhẫn', 'Đôi khi ích kỷ và bốc đồng', 'Thiếu suy nghĩ kỹ trước khi hành động', 'Cạnh tranh quá mức']
  },
  'Kim Ngưu': {
    element: 'Đất',
    description: 'Kim Ngưu là cung thứ hai trong hoàng đạo, đại diện cho sự ổn định, kiên định và thực tế. Người thuộc cung Kim Ngưu thường đáng tin cậy, kiên nhẫn và có khiếu thẩm mỹ cao.',
    strengths: ['Kiên định và đáng tin cậy', 'Thực tế và chăm chỉ', 'Nhẫn nại và bền bỉ', 'Khiếu thẩm mỹ và hưởng thụ tốt'],
    weaknesses: ['Cứng đầu và bảo thủ', 'Có thể quá cố chấp', 'Đôi khi lười biếng', 'Xu hướng vật chất quá mức']
  },
  'Song Tử': {
    element: 'Khí',
    description: 'Song Tử là cung thứ ba trong hoàng đạo, đại diện cho sự linh hoạt, giao tiếp và trí tuệ. Người thuộc cung Song Tử thường thông minh, hòa đồng và có khả năng thích nghi cao.',
    strengths: ['Giao tiếp tốt và hoạt ngôn', 'Linh hoạt và thích nghi nhanh', 'Tò mò và ham học hỏi', 'Thông minh và nhanh nhạy'],
    weaknesses: ['Hay thay đổi và thiếu kiên định', 'Đôi khi nông nổi và hời hợt', 'Khó tập trung lâu dài', 'Dễ bị xao nhãng']
  },
  'Cự Giải': {
    element: 'Nước',
    description: 'Cự Giải là cung thứ tư trong hoàng đạo, đại diện cho sự nhạy cảm, trực giác và tình cảm. Người thuộc cung Cự Giải thường chăm sóc, bảo vệ và rất gắn bó với gia đình.',
    strengths: ['Nhạy cảm và giàu tình cảm', 'Trực giác mạnh mẽ', 'Chăm sóc và bảo vệ người thân', 'Kiên trì và can đảm'],
    weaknesses: ['Dễ bị tổn thương và hay lo lắng', 'Tâm trạng thất thường', 'Đôi khi quá bám víu', 'Khó quên những tổn thương']
  },
  'Sư Tử': {
    element: 'Lửa',
    description: 'Sư Tử là cung thứ năm trong hoàng đạo, đại diện cho sự tự tin, sáng tạo và lãnh đạo. Người thuộc cung Sư Tử thường hào phóng, nhiệt tình và có sức cuốn hút mạnh mẽ.',
    strengths: ['Tự tin và quyến rũ', 'Hào phóng và rộng lượng', 'Khả năng lãnh đạo tự nhiên', 'Sáng tạo và đầy nhiệt huyết'],
    weaknesses: ['Kiêu ngạo và ích kỷ', 'Thích được chú ý quá mức', 'Đôi khi độc đoán', 'Khó chấp nhận thất bại']
  },
  'Xử Nữ': {
    element: 'Đất',
    description: 'Xử Nữ là cung thứ sáu trong hoàng đạo, đại diện cho sự cẩn thận, phân tích và hoàn hảo. Người thuộc cung Xử Nữ thường thực tế, chăm chỉ và có óc tổ chức tốt.',
    strengths: ['Cẩn thận và chi tiết', 'Thực tế và đáng tin cậy', 'Thông minh và phân tích tốt', 'Khả năng tổ chức và sắp xếp'],
    weaknesses: ['Hay phê phán và chỉ trích', 'Quá lo lắng và căng thẳng', 'Xu hướng hoàn hảo quá mức', 'Khó thư giãn']
  },
  'Thiên Bình': {
    element: 'Khí',
    description: 'Thiên Bình là cung thứ bảy trong hoàng đạo, đại diện cho sự cân bằng, công bằng và hài hòa. Người thuộc cung Thiên Bình thường nhã nhặn, thân thiện và có khiếu thẩm mỹ cao.',
    strengths: ['Công bằng và cân bằng', 'Nhã nhặn và duyên dáng', 'Khả năng ngoại giao tốt', 'Thẩm mỹ cao và yêu cái đẹp'],
    weaknesses: ['Thiếu quyết đoán', 'Hay do dự', 'Đôi khi quá phụ thuộc', 'Né tránh xung đột']
  },
  'Bọ Cạp': {
    element: 'Nước',
    description: 'Bọ Cạp là cung thứ tám trong hoàng đạo, đại diện cho sự sâu sắc, bí ẩn và đam mê. Người thuộc cung Bọ Cạp thường quyết đoán, kiên định và có trực giác mạnh mẽ.',
    strengths: ['Quyết tâm và có ý chí mạnh mẽ', 'Sâu sắc và trực giác tốt', 'Đam mê và mãnh liệt', 'Trung thành và bảo vệ người thân'],
    weaknesses: ['Hay ghen tuông và chiếm hữu', 'Giữ bí mật và khó gần', 'Xu hướng trả thù', 'Cực đoan trong cảm xúc']
  },
  'Nhân Mã': {
    element: 'Lửa',
    description: 'Nhân Mã là cung thứ chín trong hoàng đạo, đại diện cho sự tự do, phiêu lưu và triết học. Người thuộc cung Nhân Mã thường lạc quan, thẳng thắn và yêu thích khám phá.',
    strengths: ['Lạc quan và nhiệt tình', 'Yêu tự do và phiêu lưu', 'Trung thực và thẳng thắn', 'Hài hước và vui vẻ'],
    weaknesses: ['Thiếu kiên nhẫn và bốc đồng', 'Hay hứa hẹn quá mức', 'Đôi khi thiếu tế nhị', 'Khó cam kết lâu dài']
  },
  'Ma Kết': {
    element: 'Đất',
    description: 'Ma Kết là cung thứ mười trong hoàng đạo, đại diện cho sự kỷ luật, trách nhiệm và thành công. Người thuộc cung Ma Kết thường nghiêm túc, tham vọng và có khả năng tổ chức tốt.',
    strengths: ['Kỷ luật và có trách nhiệm', 'Kiên trì và chăm chỉ', 'Thực tế và đáng tin cậy', 'Tham vọng và hướng đến thành công'],
    weaknesses: ['Quá cứng nhắc và bảo thủ', 'Đôi khi bi quan', 'Hay đè nén cảm xúc', 'Quá tập trung vào công việc']
  },
  'Bảo Bình': {
    element: 'Khí',
    description: 'Bảo Bình là cung thứ mười một trong hoàng đạo, đại diện cho sự độc lập, tiến bộ và đổi mới. Người thuộc cung Bảo Bình thường có tư duy độc đáo, nhân văn và thích tự do.',
    strengths: ['Sáng tạo và độc đáo', 'Tư duy tiến bộ', 'Độc lập và tự do', 'Tinh thần nhân đạo'],
    weaknesses: ['Khó đoán và hay thay đổi', 'Đôi khi lập dị', 'Có thể xa cách về mặt cảm xúc', 'Quá lý tưởng hóa']
  },
  'Song Ngư': {
    element: 'Nước',
    description: 'Song Ngư là cung cuối cùng trong hoàng đạo, đại diện cho sự nhạy cảm, trí tưởng tượng và tâm linh. Người thuộc cung Song Ngư thường mơ mộng, giàu cảm xúc và có trực giác mạnh mẽ.',
    strengths: ['Giàu trí tưởng tượng và sáng tạo', 'Nhạy cảm và đồng cảm', 'Trực giác tốt và linh cảm mạnh', 'Giàu lòng trắc ẩn và vị tha'],
    weaknesses: ['Dễ bị ảnh hưởng và thiếu quyết đoán', 'Hay trốn tránh thực tế', 'Đôi khi quá tin người', 'Dễ bị choáng ngợp bởi cảm xúc']
  }
};

// Hàm tạo ra mô tả về sự kết hợp giữa số chủ đạo và cung hoàng đạo
export function getCompatibility(lifePathNumber: string, zodiacSign: string): string | null {
  // Tạo mô tả cho từng kết hợp cụ thể
  const compatibilityMap: {[key: string]: {[key: string]: string}} = {
    '1': {
      'Bạch Dương': 'Sự kết hợp giữa Số Chủ Đạo 1 và cung Bạch Dương tạo nên một cá tính mạnh mẽ và quyết đoán. Bạn là người tiên phong, dũng cảm và luôn đi đầu trong mọi việc. Bạn có tính độc lập cao, thích làm theo cách của mình và không ngại đối mặt với thử thách. Sự kết hợp này mang đến năng lượng lãnh đạo mạnh mẽ, nhưng cần cẩn thận với tính nóng nảy và thiếu kiên nhẫn.',
      'Kim Ngưu': 'Kết hợp giữa Số Chủ Đạo 1 và cung Kim Ngưu tạo nên sự cân bằng thú vị giữa tính độc lập, sáng tạo với sự kiên định, thực tế. Bạn vừa có khả năng lãnh đạo, vừa có tính bền bỉ và đáng tin cậy. Bạn thường đạt được thành công nhờ sự kết hợp giữa tầm nhìn và khả năng thực hiện. Cần cân bằng giữa quyết đoán và cố chấp.',
      'Song Tử': 'Sự kết hợp giữa Số Chủ Đạo 1 và cung Song Tử tạo nên một cá tính đa tài, năng động và linh hoạt. Bạn có khả năng giao tiếp xuất sắc kết hợp với tư duy độc lập, luôn tìm kiếm những ý tưởng mới và cách tiếp cận sáng tạo. Bạn thích khám phá, học hỏi và chia sẻ kiến thức, đồng thời có khả năng truyền cảm hứng cho người khác.',
      'Cự Giải': 'Kết hợp giữa Số Chủ Đạo 1 và cung Cự Giải tạo nên sự cân bằng thú vị giữa tính độc lập, sáng tạo với sự nhạy cảm, quan tâm. Bạn có thể là người lãnh đạo đầy trực giác, biết cách kết nối với cảm xúc của người khác. Sự kết hợp này giúp bạn vừa quyết đoán trong công việc, vừa tinh tế trong các mối quan hệ.',
      'Sư Tử': 'Sự kết hợp giữa Số Chủ Đạo 1 và cung Sư Tử tạo nên một cá tính lãnh đạo mạnh mẽ, tự tin và đầy sức thu hút. Bạn sinh ra để dẫn dắt và truyền cảm hứng cho người khác. Với đam mê và năng lượng dồi dào, bạn luôn nổi bật và có khả năng tạo dấu ấn riêng. Cần cẩn thận với xu hướng áp đặt và kiêu ngạo.',
      'Xử Nữ': 'Kết hợp giữa Số Chủ Đạo 1 và cung Xử Nữ tạo nên sự cân bằng giữa tính độc lập, sáng tạo với sự cẩn trọng, tỉ mỉ. Bạn là người có tầm nhìn nhưng cũng rất thực tế và chú trọng chi tiết. Sự kết hợp này giúp bạn không chỉ nghĩ ra ý tưởng mà còn biết cách triển khai một cách hiệu quả và hoàn hảo.',
      'Thiên Bình': 'Sự kết hợp giữa Số Chủ Đạo 1 và cung Thiên Bình tạo nên một cá tính vừa độc lập, sáng tạo vừa công bằng, hài hòa. Bạn có khả năng đưa ra quyết định cân bằng, nhìn nhận vấn đề từ nhiều góc độ. Bạn vừa có thể là người lãnh đạo mạnh mẽ, vừa là người hòa giải xuất sắc trong các xung đột.',
      'Bọ Cạp': 'Kết hợp giữa Số Chủ Đạo 1 và cung Bọ Cạp tạo nên một cá tính sâu sắc, quyết đoán và đầy bí ẩn. Bạn có sức mạnh nội tâm to lớn, ý chí kiên cường và khả năng nhìn thấu bản chất vấn đề. Với trực giác sắc bén và tính độc lập cao, bạn thường đạt được mục tiêu bằng sự kiên trì và chiến lược thông minh.',
      'Nhân Mã': 'Sự kết hợp giữa Số Chủ Đạo 1 và cung Nhân Mã tạo nên một cá tính tự do, phiêu lưu và đầy nhiệt huyết. Bạn luôn tìm kiếm những chân trời mới, có tư duy độc lập và tinh thần lạc quan. Với khả năng truyền cảm hứng và tầm nhìn xa, bạn thường là người tiên phong trong những lĩnh vực mới mẻ.',
      'Ma Kết': 'Kết hợp giữa Số Chủ Đạo 1 và cung Ma Kết tạo nên một cá tính đầy tham vọng, quyết đoán và có khả năng tổ chức cao. Bạn có mục tiêu rõ ràng và biết cách đạt được chúng bằng sự kiên trì, kỷ luật. Sự kết hợp này mang đến tiềm năng lãnh đạo xuất sắc, đặc biệt trong môi trường kinh doanh hoặc quản lý.',
      'Bảo Bình': 'Sự kết hợp giữa Số Chủ Đạo 1 và cung Bảo Bình tạo nên một cá tính độc đáo, tiến bộ và đầy sáng tạo. Bạn là người có tư duy đột phá, không ngại đi ngược xu hướng và luôn tìm kiếm những phương pháp mới. Với sự độc lập và tầm nhìn xa, bạn thường là người tiên phong trong các ý tưởng cách mạng.',
      'Song Ngư': 'Kết hợp giữa Số Chủ Đạo 1 và cung Song Ngư tạo nên sự cân bằng thú vị giữa tính độc lập, sáng tạo với sự nhạy cảm, giàu trí tưởng tượng. Bạn có thể là một nghệ sĩ hoặc nhà lãnh đạo đầy cảm hứng, biết cách kết nối với cảm xúc của người khác. Trực giác mạnh mẽ giúp bạn nhìn thấy những cơ hội mà người khác bỏ qua.'
    },
    '2': {
      'Bạch Dương': 'Sự kết hợp giữa Số Chủ Đạo 2 và cung Bạch Dương tạo nên một sự cân bằng thú vị giữa tinh thần hợp tác, nhạy cảm với sự mạnh mẽ, quyết đoán. Bạn vừa có khả năng làm việc nhóm tốt, vừa có tinh thần tiên phong. Bạn biết cách kết nối mọi người nhưng cũng không ngại đứng lên bảo vệ quan điểm của mình khi cần thiết.',
      'Kim Ngưu': 'Kết hợp giữa Số Chủ Đạo 2 và cung Kim Ngưu tạo nên một cá tính ổn định, đáng tin cậy và nhạy cảm. Bạn có khả năng tạo dựng môi trường hài hòa, an toàn cho những người xung quanh. Với sự kiên nhẫn và khả năng lắng nghe, bạn là người bạn và đồng nghiệp tuyệt vời. Bạn đặc biệt giỏi trong việc xây dựng mối quan hệ bền vững.',
      'Song Tử': 'Sự kết hợp giữa Số Chủ Đạo 2 và cung Song Tử tạo nên một cá tính giao tiếp tốt, linh hoạt và nhạy cảm. Bạn có khả năng kết nối với nhiều người khác nhau, hiểu được quan điểm đa chiều và tạo ra sự hài hòa. Với trí tuệ nhanh nhẹn và khả năng thích nghi, bạn thường là người hòa giải xuất sắc trong các xung đột.',
      'Cự Giải': 'Kết hợp giữa Số Chủ Đạo 2 và cung Cự Giải tạo nên một cá tính vô cùng nhạy cảm, quan tâm và nuôi dưỡng. Bạn có trực giác mạnh mẽ, hiểu sâu sắc cảm xúc của người khác và luôn sẵn sàng hỗ trợ. Mối quan hệ gia đình và tình bạn đóng vai trò cực kỳ quan trọng trong cuộc sống của bạn. Bạn có khả năng tạo không gian an toàn cho người khác.',
      'Sư Tử': 'Sự kết hợp giữa Số Chủ Đạo 2 và cung Sư Tử tạo nên một cá tính vừa ấm áp, hợp tác vừa tự tin, nổi bật. Bạn có khả năng kết nối mọi người, tạo nên cộng đồng, đồng thời có sức thu hút và phong cách riêng. Bạn thường là người truyền cảm hứng, biết cách làm cho mọi người cảm thấy được đánh giá cao và quan trọng.',
      'Xử Nữ': 'Kết hợp giữa Số Chủ Đạo 2 và cung Xử Nữ tạo nên một cá tính cẩn thận, quan tâm và đáng tin cậy. Bạn chú ý đến từng chi tiết, luôn muốn giúp đỡ và cải thiện cuộc sống của người khác. Với khả năng phân tích và trực giác tốt, bạn thường nhận ra những nhu cầu của người khác trước khi họ nói ra và tìm cách hỗ trợ một cách thiết thực.',
      'Thiên Bình': 'Sự kết hợp giữa Số Chủ Đạo 2 và cung Thiên Bình tạo nên một cá tính hài hòa, công bằng và giỏi ngoại giao. Bạn có khả năng tự nhiên trong việc tạo ra sự cân bằng, hòa giải xung đột và xây dựng mối quan hệ tốt đẹp. Với cảm giác thẩm mỹ tinh tế và tính cách dễ chịu, bạn thường được mọi người yêu mến và tìm đến khi cần lời khuyên.',
      'Bọ Cạp': 'Kết hợp giữa Số Chủ Đạo 2 và cung Bọ Cạp tạo nên một cá tính sâu sắc, nhạy cảm và có trực giác mạnh mẽ. Bạn có khả năng nhìn thấu tâm hồn người khác, hiểu những động lực sâu xa của họ. Tình cảm của bạn sâu đậm và bền vững, một khi đã cam kết, bạn sẽ hết lòng với mối quan hệ đó. Sự kết hợp này mang đến sức mạnh tinh thần và khả năng hỗ trợ người khác trong những thời điểm khó khăn.',
      'Nhân Mã': 'Sự kết hợp giữa Số Chủ Đạo 2 và cung Nhân Mã tạo nên một cá tính thú vị - vừa hợp tác, nhạy cảm vừa tự do, phiêu lưu. Bạn có khả năng kết nối với nhiều người khác nhau từ các nền văn hóa và quan điểm khác nhau. Bạn mang đến sự lạc quan, vui vẻ trong các mối quan hệ và biết cách cân bằng giữa gắn bó và không gian cá nhân.',
      'Ma Kết': 'Kết hợp giữa Số Chủ Đạo 2 và cung Ma Kết tạo nên một cá tính đáng tin cậy, kiên trì và giỏi xây dựng mối quan hệ bền vững. Bạn coi trọng truyền thống, gia đình và có trách nhiệm cao. Với khả năng lắng nghe và sự kiên nhẫn, bạn thường là trụ cột vững chắc trong các mối quan hệ và tổ chức. Bạn biết cách tạo ra cấu trúc an toàn cho người khác phát triển.',
      'Bảo Bình': 'Sự kết hợp giữa Số Chủ Đạo 2 và cung Bảo Bình tạo nên một cá tính vừa hợp tác, nhạy cảm vừa độc lập, tiến bộ. Bạn có khả năng kết nối mọi người vì những mục tiêu chung, đặc biệt là những lý tưởng nhân văn. Bạn hiểu giá trị của cá nhân và cộng đồng, thường tìm cách cải thiện xã hội thông qua các mối quan hệ và hợp tác.',
      'Song Ngư': 'Kết hợp giữa Số Chủ Đạo 2 và cung Song Ngư tạo nên một cá tính vô cùng nhạy cảm, giàu trí tưởng tượng và đầy lòng trắc ẩn. Bạn có trực giác phi thường, thường hiểu người khác mà không cần nhiều lời. Khả năng đồng cảm của bạn sâu sắc đến mức đôi khi bạn cảm nhận được cảm xúc của người khác như của chính mình. Bạn có khả năng chữa lành và mang đến sự an ủi cho người khác.'
    },
    '3': {
      'Bạch Dương': 'Sự kết hợp giữa Số Chủ Đạo 3 và cung Bạch Dương tạo nên một cá tính năng động, sáng tạo và đầy nhiệt huyết. Bạn có khả năng biểu đạt tuyệt vời, không ngại thể hiện bản thân và luôn bùng nổ với những ý tưởng mới. Với năng lượng dồi dào và sự tự tin, bạn thường truyền cảm hứng cho người khác thông qua lời nói và hành động của mình.',
      'Kim Ngưu': 'Kết hợp giữa Số Chủ Đạo 3 và cung Kim Ngưu tạo nên một cá tính sáng tạo, biểu đạt tốt nhưng cũng rất thực tế và đáng tin cậy. Bạn có khiếu thẩm mỹ cao, thường thể hiện bản thân thông qua nghệ thuật, âm nhạc hoặc các hình thức sáng tạo khác. Bạn biết cách tận hưởng cuộc sống, đánh giá cao vẻ đẹp và có khả năng biến ý tưởng thành hiện thực.',
      'Song Tử': 'Sự kết hợp giữa Số Chủ Đạo 3 và cung Song Tử tạo nên một cá tính vô cùng linh hoạt, giao tiếp xuất sắc và giàu trí tưởng tượng. Bạn có khả năng chơi chữ, hài hước và luôn sẵn sàng chia sẻ ý tưởng. Với trí tuệ nhanh nhẹn và khả năng thích nghi, bạn thường tỏa sáng trong các môi trường xã hội và sáng tạo.',
      'Cự Giải': 'Kết hợp giữa Số Chủ Đạo 3 và cung Cự Giải tạo nên một cá tính giàu cảm xúc, sáng tạo và giỏi kể chuyện. Bạn có khả năng kết nối với người khác thông qua việc chia sẻ cảm xúc và trải nghiệm cá nhân. Trí tưởng tượng phong phú cùng với sự nhạy cảm giúp bạn sáng tác những tác phẩm chạm đến trái tim người khác. Bạn thường có tài năng trong việc nuôi dưỡng và truyền cảm hứng.',
      'Sư Tử': 'Sự kết hợp giữa Số Chủ Đạo 3 và cung Sư Tử tạo nên một cá tính rực rỡ, đầy sáng tạo và khả năng biểu diễn tuyệt vời. Bạn sinh ra để tỏa sáng, với khả năng thu hút mọi người bằng sự quyến rũ và tài năng của mình. Bạn có năng khiếu nghệ thuật mạnh mẽ và khả năng truyền cảm hứng cho người khác. Với sự tự tin và năng lượng tích cực, bạn thường là linh hồn của bữa tiệc.',
      'Xử Nữ': 'Kết hợp giữa Số Chủ Đạo 3 và cung Xử Nữ tạo nên một cá tính vừa sáng tạo, biểu đạt tốt vừa cẩn thận, chú ý đến chi tiết. Bạn có khả năng giao tiếp rõ ràng, chính xác và tinh tế. Với óc phân tích và khả năng sáng tạo, bạn thường tạo ra những tác phẩm hoặc ý tưởng được chau chuốt kỹ lưỡng. Bạn giỏi trong việc truyền đạt thông tin phức tạp một cách dễ hiểu.',
      'Thiên Bình': 'Sự kết hợp giữa Số Chủ Đạo 3 và cung Thiên Bình tạo nên một cá tính hài hòa, giàu sức sáng tạo và có khiếu thẩm mỹ cao. Bạn có khả năng tự nhiên trong việc tạo ra vẻ đẹp và cân bằng trong mọi lĩnh vực. Với khả năng giao tiếp tốt và cảm giác về hài hòa, bạn thường thành công trong nghệ thuật, thiết kế hoặc mọi lĩnh vực đòi hỏi sáng tạo và thẩm mỹ.',
      'Bọ Cạp': 'Kết hợp giữa Số Chủ Đạo 3 và cung Bọ Cạp tạo nên một cá tính sâu sắc, đầy cảm xúc và có khả năng sáng tạo mạnh mẽ. Bạn có khả năng đào sâu vào những vấn đề phức tạp và biến chúng thành những tác phẩm nghệ thuật hoặc câu chuyện đầy sức mạnh. Với trực giác sắc bén và sự nhạy cảm, bạn có thể tạo ra những tác phẩm chạm đến phần sâu thẳm nhất trong tâm hồn người khác.',
      'Nhân Mã': 'Sự kết hợp giữa Số Chủ Đạo 3 và cung Nhân Mã tạo nên một cá tính lạc quan, phiêu lưu và đầy sáng tạo. Bạn có khả năng kể chuyện tuyệt vời, luôn mang đến niềm vui và cảm hứng cho người khác. Với tính cách cởi mở và tình yêu dành cho tự do, bạn thường tạo ra những tác phẩm hoặc ý tưởng mới mẻ, không theo khuôn mẫu và đầy ý nghĩa triết học.',
      'Ma Kết': 'Kết hợp giữa Số Chủ Đạo 3 và cung Ma Kết tạo nên một cá tính vừa sáng tạo, biểu đạt tốt vừa thực tế, có kỷ luật. Bạn có khả năng biến những ý tưởng sáng tạo thành kế hoạch cụ thể và đạt được thành công. Với sự kết hợp giữa trí tưởng tượng và khả năng tổ chức, bạn thường tạo ra những tác phẩm hoặc dự án không chỉ đẹp mà còn có giá trị lâu dài.',
      'Bảo Bình': 'Sự kết hợp giữa Số Chủ Đạo 3 và cung Bảo Bình tạo nên một cá tính độc đáo, sáng tạo và tiến bộ. Bạn có tư duy đột phá, thường đi trước thời đại với những ý tưởng và cách thể hiện mới mẻ. Với khả năng giao tiếp tốt và tư duy độc lập, bạn thường truyền cảm hứng cho người khác thông qua những quan điểm và sáng tạo độc đáo của mình.',
      'Song Ngư': 'Kết hợp giữa Số Chủ Đạo 3 và cung Song Ngư tạo nên một cá tính vô cùng giàu trí tưởng tượng, nhạy cảm và có khả năng sáng tạo phi thường. Bạn có thể là một nghệ sĩ, nhà thơ hoặc nhà văn với khả năng tạo ra những tác phẩm đẹp đẽ, đầy cảm xúc. Với trực giác sâu sắc và khả năng biểu đạt, bạn có thể chạm đến tâm hồn người khác và mang đến cảm giác huyền diệu.'
    },
    // Có thể thêm các số chủ đạo và cung hoàng đạo khác tương tự
  };

  // Kiểm tra xem có mô tả cho kết hợp này không
  if (compatibilityMap[lifePathNumber] && compatibilityMap[lifePathNumber][zodiacSign]) {
    return compatibilityMap[lifePathNumber][zodiacSign];
  }

  // Nếu không có mô tả cụ thể, trả về null để sử dụng mô tả mặc định
  return null;
} 