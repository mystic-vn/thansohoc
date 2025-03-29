import { NextResponse } from 'next/server';
import { getTimeAnalysis, getLifePathYearAnalysis } from '@/lib/numerology-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const code = searchParams.get('code');
  const lifePathNumber = searchParams.get('lifePathNumber');
  const year = searchParams.get('year');

  try {
    // Trường hợp phân tích số chủ đạo và năm
    if (type === 'life-path-year' && lifePathNumber && year) {
      const data = await getLifePathYearAnalysis(lifePathNumber, parseInt(year));
      
      if (!data) {
        return NextResponse.json({ error: 'Không tìm thấy phân tích cho số chủ đạo và năm này' }, { status: 404 });
      }
      
      return NextResponse.json({ data });
    }
    
    // Trường hợp phân tích thời gian thông thường
    if (!type || !code) {
      return NextResponse.json({ error: 'Thiếu tham số: cần có type và code' }, { status: 400 });
    }

    const data = await getTimeAnalysis(type, code);
    
    if (!data) {
      return NextResponse.json({ error: 'Không tìm thấy dữ liệu phân tích thời gian' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu phân tích thời gian:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
} 