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
import { withCache } from '@/lib/cache-utils';

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
      // Khai báo các tham số cho cache
      const cacheParams = { 
        type, 
        action: 'get-all'
      };

      // Sử dụng withCache để cache dữ liệu
      const data = await withCache(
        async () => {
          console.log(`Đang lấy tất cả dữ liệu ${type} từ database...`);
          
          // Sử dụng API mới nếu có
          if (type === 'life-path') {
            return await getAllLifePathData();
          } else if (type === 'zodiac') {
            return await getAllZodiacData();
          } else {
            // Sử dụng API cũ cho các loại khác
            return await getAllBasicDataByType(type);
          }
        },
        'numerology-api',
        cacheParams,
        86400 // Cache 1 ngày thay vì 1 giờ
      );
      
      return NextResponse.json(data);
    }

    // Lấy dữ liệu cụ thể với các trường được chỉ định
    // Khai báo các tham số cho cache
    const cacheParams = { 
      type, 
      code,
      fields: fields ? fields.sort().join(',') : 'all'
    };

    // Sử dụng withCache để cache dữ liệu
    const data = await withCache(
      async () => {
        console.log(`Đang lấy dữ liệu ${type}:${code} từ database...`);
        
        // Sử dụng API mới nếu có
        if (type === 'life-path') {
          return await getLifePathData(code, fields);
        } else if (type === 'zodiac') {
          return await getZodiacData(code, fields);
        } else {
          // Sử dụng API cũ cho các loại khác
          return await getBasicNumerologyData(type, code);
        }
      },
      'numerology-api',
      cacheParams,
      86400 // Cache 1 ngày thay vì 1 giờ
    );
    
    if (!data) {
      return NextResponse.json({ error: 'Không tìm thấy dữ liệu' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu thần số học:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
} 