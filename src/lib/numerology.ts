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