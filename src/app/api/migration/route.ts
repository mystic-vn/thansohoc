import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { 
  convertToLifePathData, 
  convertToZodiacData, 
  addLifePathData, 
  addZodiacData,
  NumerologyBasicData
} from '@/lib/numerology-db';

export async function POST(request: Request) {
  try {
    // Kiểm tra token xác thực (nên thêm logic bảo mật ở đây)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Ở đây nên có kiểm tra token hợp lệ
    // const token = authHeader.split(' ')[1];
    // validateToken(token);
    
    const { db } = await connectToDatabase();
    
    // Lấy tất cả dữ liệu từ collection cũ
    const oldData = await db.collection('numerology_basic_data').find({}).toArray();
    
    // Tách dữ liệu thành các loại
    const lifePathData = oldData.filter(item => item.type === 'life-path');
    const zodiacData = oldData.filter(item => item.type === 'zodiac');
    
    // Đếm số lượng dữ liệu đã được di chuyển
    let lifePathMigrated = 0;
    let zodiacMigrated = 0;
    
    // Di chuyển dữ liệu số chủ đạo
    for (const data of lifePathData) {
      try {
        // Ép kiểu dữ liệu để phù hợp với hàm chuyển đổi
        const numerologyData = data as unknown as NumerologyBasicData;
        const convertedData = convertToLifePathData(numerologyData);
        await addLifePathData(convertedData);
        lifePathMigrated++;
      } catch (error) {
        console.error('Lỗi khi di chuyển dữ liệu số chủ đạo:', error);
      }
    }
    
    // Di chuyển dữ liệu cung hoàng đạo
    for (const data of zodiacData) {
      try {
        // Ép kiểu dữ liệu để phù hợp với hàm chuyển đổi
        const numerologyData = data as unknown as NumerologyBasicData;
        const convertedData = convertToZodiacData(numerologyData);
        await addZodiacData(convertedData);
        zodiacMigrated++;
      } catch (error) {
        console.error('Lỗi khi di chuyển dữ liệu cung hoàng đạo:', error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Di chuyển dữ liệu thành công',
      stats: {
        total: oldData.length,
        lifePath: {
          total: lifePathData.length,
          migrated: lifePathMigrated
        },
        zodiac: {
          total: zodiacData.length,
          migrated: zodiacMigrated
        }
      }
    });
    
  } catch (error) {
    console.error('Lỗi khi di chuyển dữ liệu:', error);
    return NextResponse.json({ error: 'Lỗi server khi di chuyển dữ liệu' }, { status: 500 });
  }
}

// Thêm endpoint để kiểm tra tiến trình di chuyển
export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();
    
    // Đếm số lượng dữ liệu trong các collection
    const oldDataCount = await db.collection('numerology_basic_data').countDocuments();
    const lifePathCount = await db.collection('life_path_data').countDocuments();
    const zodiacCount = await db.collection('zodiac_data').countDocuments();
    
    return NextResponse.json({
      stats: {
        oldData: oldDataCount,
        lifePath: lifePathCount,
        zodiac: zodiacCount,
        progress: {
          lifePath: oldDataCount > 0 ? (lifePathCount / oldDataCount) * 100 : 0,
          zodiac: oldDataCount > 0 ? (zodiacCount / oldDataCount) * 100 : 0
        }
      }
    });
    
  } catch (error) {
    console.error('Lỗi khi kiểm tra tiến trình di chuyển:', error);
    return NextResponse.json({ error: 'Lỗi server khi kiểm tra tiến trình' }, { status: 500 });
  }
} 