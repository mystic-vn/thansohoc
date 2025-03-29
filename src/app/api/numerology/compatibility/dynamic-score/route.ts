import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import OpenAI from 'openai';
import { connectToDatabase } from '@/lib/mongodb';
import { withCache } from '@/lib/cache-utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Hàm giả lập tính toán điểm tương hợp động dựa trên các yếu tố
function calculateDynamicScore(
  lifePathNumber: string,
  zodiacSign: string,
  monthNumber: number,
  dayNumber: number
): number {
  // Giả lập một số tính toán đơn giản
  const lifePathValue = parseInt(lifePathNumber, 10) || 5;
  const dayFactor = (dayNumber % 9) || 1;
  const monthFactor = (monthNumber % 5) || 1;
  
  // Thêm một yếu tố ngẫu nhiên nhỏ để tạo cảm giác động
  const randomFactor = Math.random() * 0.5;
  
  // Giả lập điểm cơ bản từ 60-85
  let baseScore = 70 + (lifePathValue * 2) - (monthFactor * 3) + (dayFactor * 2);
  
  // Đảm bảo điểm nằm trong khoảng hợp lý
  baseScore = Math.max(65, Math.min(85, baseScore));
  
  // Thêm yếu tố ngẫu nhiên nhỏ
  const finalScore = baseScore + randomFactor;
  
  // Làm tròn đến 1 chữ số thập phân
  return Math.round(finalScore * 10) / 10;
}

export async function POST(req: Request) {
  try {
    // Kiểm tra xác thực
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Bạn cần đăng nhập để sử dụng tính năng này' },
        { status: 401 }
      );
    }

    // Lấy dữ liệu từ request
    const data = await req.json();
    const { lifePathNumber, zodiacSign } = data;

    if (!lifePathNumber || !zodiacSign) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Thiếu thông tin số chủ đạo hoặc cung hoàng đạo' },
        { status: 400 }
      );
    }

    // Tạo prompt cho OpenAI
    const prompt = `Hãy đánh giá mức độ hài hòa trong tính cách của một người có số chủ đạo ${lifePathNumber} và cung hoàng đạo ${zodiacSign}. 
    
    THANG ĐIỂM: Đánh giá mức độ hài hòa trên thang điểm từ 1-100, với các mức như sau:
    - 90-100: Cực kỳ hài hòa, hiếm gặp
    - 80-89: Rất hài hòa
    - 70-79: Khá hài hòa 
    - 60-69: Hài hòa trung bình
    - 50-59: Có sự xung đột và hài hòa cân bằng
    - 40-49: Có nhiều điểm không tương thích
    - 30-39: Khá mâu thuẫn
    - 20-29: Rất mâu thuẫn
    - 1-19: Cực kỳ mâu thuẫn, rất hiếm gặp
    
    QUAN TRỌNG: Hãy phân tích thực sự chính xác và nghiêm túc dựa trên thần số học và chiêm tinh học, cho điểm thật (KHÔNG ĐƯỢC CHO ĐIỂM CAO ĐỀU CHO TẤT CẢ CÁC TỔ HỢP). Mỗi tổ hợp số chủ đạo và cung hoàng đạo có mức độ hài hòa khác nhau, một số tổ hợp có thể rất thấp (30-40 điểm), một số trung bình (50-60 điểm), một số cao (70-80 điểm), và rất hiếm tổ hợp đạt 90+ điểm.
    
    Phân tích dựa trên các yếu tố sau:
    1. Đặc điểm tính cách của số chủ đạo ${lifePathNumber}
    2. Đặc điểm tính cách của cung hoàng đạo ${zodiacSign}
    3. Sự tương tác và ảnh hưởng qua lại giữa hai yếu tố này
    
    Hãy đưa ra:
    1. Điểm hài hòa nội tại (thang điểm từ 1-100, theo thang phân loại ở trên)
    2. Mô tả ngắn về mức độ hài hòa này (khoảng 2-3 câu)
    3. Nhận xét về ưu điểm chính (3 điểm)
    4. Nhận xét về thách thức chính (3 điểm)
    5. Ảnh hưởng của số chủ đạo đối với tính cách (khoảng 1-2 câu)
    6. Ảnh hưởng của cung hoàng đạo đối với tính cách (khoảng 1-2 câu)
    7. Lời khuyên để phát huy tốt nhất sự kết hợp này (3-4 điểm ngắn)
    
    Phản hồi theo định dạng JSON với các trường: score, description, strengths (array), challenges (array), lifePathInfluence, zodiacInfluence, advice (array)`;

    // Gọi API OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `Bạn là chuyên gia về chiêm tinh học và thần số học. 
          
QUAN TRỌNG: Khi đánh giá điểm hài hòa giữa số chủ đạo và cung hoàng đạo:
1. KHÔNG bao giờ cho điểm cao một cách máy móc. Đánh giá thật sự dựa trên sự tương hợp giữa các đặc tính.
2. Phải tạo ra ĐIỂM SỐ ĐA DẠNG trong khoảng 1-100 dựa trên mức độ hài hòa thực sự.
3. Các tổ hợp khác nhau PHẢI có điểm khác biệt đáng kể (tối thiểu 10-15 điểm giữa các tổ hợp).
4. Phân bố điểm theo phân phối bình thường:
   - Khoảng 5% tổ hợp điểm rất thấp (20-35)
   - Khoảng 15% tổ hợp điểm thấp (36-49)
   - Khoảng 30% tổ hợp điểm trung bình (50-64)
   - Khoảng 30% tổ hợp điểm khá (65-79)
   - Khoảng 15% tổ hợp điểm cao (80-89)
   - Khoảng 5% tổ hợp điểm rất cao (90-100)
5. Chỉ những tổ hợp CỰC KỲ hiếm mới đạt điểm >95.
6. Chỉ những tổ hợp CỰC KỲ xung đột mới có điểm <25.
7. LUÔN xem xét các yếu tố xung khắc thực tế giữa số chủ đạo và cung hoàng đạo. Ví dụ:
   - Số 1 (tính độc lập) có thể xung đột với Cự Giải (tính phụ thuộc cảm xúc)
   - Số 9 (vị tha) có thể xung đột với Ma Kết (thực tế, vụ lợi)

Một số ví dụ về điểm số hợp lý:
- Số 1 + Bạch Dương: 86 (rất hài hòa vì cùng tính quyết đoán, lãnh đạo)
- Số 2 + Cự Giải: 92 (cực kỳ hài hòa vì cùng nhạy cảm, quan tâm)
- Số 4 + Xử Nữ: 88 (rất hài hòa vì cùng tỉ mỉ, thực tế)
- Số 5 + Song Ngư: 47 (khá xung đột vì tự do vs nhạy cảm)
- Số 7 + Nhân Mã: 52 (trung bình vì tâm linh vs tự do)
- Số 8 + Ma Kết: 85 (rất tốt vì cùng hướng tới thành công)
- Số 9 + Sư Tử: 42 (khá xung đột vì vị tha vs tự tôn)
- Số 22 + Thiên Bình: 76 (khá hài hòa vì kiến tạo vs cân bằng)
` 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    // Xử lý phản hồi
    const responseContent = completion.choices[0].message.content;
    
    if (!responseContent) {
      return NextResponse.json(
        { error: 'OpenAI Error', message: 'Không nhận được phản hồi từ OpenAI' },
        { status: 500 }
      );
    }

    // Parse JSON response
    const compatibilityData = JSON.parse(responseContent);

    return NextResponse.json({
      success: true,
      data: {
        lifePathNumber,
        zodiacSign,
        ...compatibilityData
      }
    });

  } catch (error: any) {
    console.error('Error in dynamic compatibility score:', error);
    return NextResponse.json(
      { error: 'Server Error', message: error.message || 'Đã xảy ra lỗi khi xử lý yêu cầu' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lifePathNumber = searchParams.get('lifePathNumber');
  const zodiacSign = searchParams.get('zodiacSign');
  const month = parseInt(searchParams.get('month') || '0', 10);
  const day = parseInt(searchParams.get('day') || '0', 10);

  try {
    if (!lifePathNumber || !zodiacSign) {
      return NextResponse.json(
        { error: 'Thiếu tham số cần thiết (lifePathNumber hoặc zodiacSign)' },
        { status: 400 }
      );
    }
    
    // Cấu hình cache
    const cacheParams = {
      lifePathNumber,
      zodiacSign,
      month,
      day
    };
    
    // Sử dụng cache
    const result = await withCache(
      async () => {
        // Thử tìm trong database trước
        const { db } = await connectToDatabase();
        
        console.log('Dynamic Score API: Tìm kiếm điểm động trong database...');
        const data = await db.collection('life_path_zodiac_combinations').findOne({
          lifePathNumber,
          zodiacSign
        });
        
        // Nếu có dữ liệu và có điểm tương hợp, trả về kết quả từ database
        if (data && data.compatibilityScore !== undefined) {
          console.log('Dynamic Score API: Tìm thấy điểm tương hợp trong database:', data.compatibilityScore);
          
          // Thêm một biến thể nhỏ để tạo cảm giác động
          const randomVariation = (Math.random() * 2 - 1) * 0.5;  // -0.5 to +0.5
          let dynamicScore = data.compatibilityScore + randomVariation;
          
          // Đảm bảo điểm nằm trong khoảng hợp lý
          dynamicScore = Math.max(0, Math.min(100, dynamicScore));
          
          return {
            score: Math.round(dynamicScore * 10) / 10,
            source: 'database'
          };
        }
        
        // Nếu không có trong database, tính toán động
        console.log('Dynamic Score API: Không tìm thấy trong database, tính toán động...');
        const calculatedScore = calculateDynamicScore(lifePathNumber, zodiacSign, month, day);
        
        return {
          score: calculatedScore,
          source: 'calculated'
        };
      },
      'dynamic-score-api',
      cacheParams,
      3600 // Cache 1 giờ thay vì 15 phút
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Lỗi khi tính toán điểm tương hợp động:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
} 