import { NextResponse } from 'next/server';
import { 
  getAllBasicDataByType, 
  getBasicNumerologyData,
  getCompatibilityData,
  // Thêm các hàm truy vấn mới
  getLifePathData,
  getZodiacData,
  getAllLifePathData,
  getAllZodiacData
} from '@/lib/numerology-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const code = searchParams.get('code');
  const fields = searchParams.get('fields')?.split(',');

  try {
    if (!type) {
      return NextResponse.json({ error: 'Thiếu tham số type' }, { status: 400 });
    }

    // Lấy tất cả dữ liệu theo loại
    if (!code) {
      let data;
      
      // Sử dụng API mới nếu có
      if (type === 'life-path') {
        data = await getAllLifePathData();
      } else if (type === 'zodiac') {
        data = await getAllZodiacData();
      } else {
        // Sử dụng API cũ cho các loại khác
        data = await getAllBasicDataByType(type);
      }
      
      return NextResponse.json(data);
    }

    // Lấy dữ liệu cụ thể với các trường được chỉ định
    let data;
    
    // Sử dụng API mới nếu có
    if (type === 'life-path') {
      data = await getLifePathData(code, fields);
    } else if (type === 'zodiac') {
      data = await getZodiacData(code, fields);
    } else {
      // Sử dụng API cũ cho các loại khác
      data = await getBasicNumerologyData(type, code);
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Không tìm thấy dữ liệu' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu thần số học:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
} 