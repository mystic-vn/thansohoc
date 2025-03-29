import { NextResponse } from 'next/server';
import { getLifePathZodiacCombination } from '@/lib/numerology-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lifePathNumber = searchParams.get('lifePathNumber');
  const zodiacSign = searchParams.get('zodiacSign');

  try {
    if (!lifePathNumber || !zodiacSign) {
      return NextResponse.json({ 
        error: 'Thiếu tham số: cần có lifePathNumber và zodiacSign' 
      }, { status: 400 });
    }

    const data = await getLifePathZodiacCombination(lifePathNumber, zodiacSign);
    
    if (!data) {
      return NextResponse.json({ error: 'Không tìm thấy dữ liệu kết hợp' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu kết hợp:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
} 