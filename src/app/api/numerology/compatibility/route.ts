import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getLifePathZodiacCombination } from '@/lib/numerology-db';

interface CompatibilityData {
  _id: any;
  isPersonalCombination?: boolean;
  combinationType?: string;
  title?: string;
  overview?: string;
  compatibilityScore?: number;
  compatibility_breakdown?: {
    emotional?: number;
    spiritual?: number;
    practical?: number;
    description?: string;
    love?: {
      score?: number;
      description?: string;
    };
    work?: {
      score?: number;
      description?: string;
    };
    communication?: {
      score?: number;
      description?: string;
    };
    [key: string]: any;
  };
  strengths?: string[];
  challenges?: string[];
  advice?: string;
  [key: string]: any;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const factor1Type = searchParams.get('factor1Type');
  const factor1Code = searchParams.get('factor1Code');
  const factor2Type = searchParams.get('factor2Type');
  const factor2Code = searchParams.get('factor2Code');

  try {
    if (!type || !factor1Type || !factor1Code || !factor2Type || !factor2Code) {
      return NextResponse.json({ error: 'Thiếu tham số cần thiết' }, { status: 400 });
    }

    console.log('API compatibility: Nhận request:', {
      type, factor1Type, factor1Code, factor2Type, factor2Code
    });

    // Kiểm tra nếu đây là yêu cầu kết hợp giữa số chủ đạo và cung hoàng đạo của một người
    if (type === 'life-path-zodiac' && 
        ((factor1Type === 'life-path' && factor2Type === 'zodiac') || 
         (factor1Type === 'zodiac' && factor2Type === 'life-path'))) {
      
      // Đảm bảo factor1 là life-path và factor2 là zodiac
      let lifePathNumber = factor1Type === 'life-path' ? factor1Code : factor2Code;
      let zodiacSign = factor1Type === 'zodiac' ? factor1Code : factor2Code;
      
      console.log('API compatibility: Lấy dữ liệu kết hợp giữa số chủ đạo', lifePathNumber, 'và cung hoàng đạo', zodiacSign, 'trong một người');
      
      // Lấy dữ liệu kết hợp từ collection life_path_zodiac_combinations
      const combinationData = await getLifePathZodiacCombination(lifePathNumber, zodiacSign);
      
      if (combinationData) {
        console.log('API compatibility: Đã tìm thấy dữ liệu kết hợp tính cách');

        // Thêm các trường mô tả để làm rõ đây là kết hợp trong một người
        const updatedData = {
          ...combinationData,
          isPersonalCombination: true,
          combinationType: 'personal_traits_combination',
          description: combinationData.description || 'Sự kết hợp của số chủ đạo và cung hoàng đạo trong cùng một người tạo nên tính cách độc đáo.'
        };

        return NextResponse.json({ data: updatedData });
      }
      
      // Tìm kiếm trong các collection khác nếu không có dữ liệu trong collection chính
      const { db } = await connectToDatabase();
      
      // Tìm trong collection life_path_zodiac_combinations với các điều kiện khác
      let combinationResult = await db.collection('life_path_zodiac_combinations').findOne({
        lifePathNumber,
        zodiacSign
      });

      if (combinationResult) {
        // Thêm các trường mô tả để làm rõ đây là kết hợp trong một người
        const updatedData = {
          ...combinationResult,
          isPersonalCombination: true,
          combinationType: 'personal_traits_combination',
          description: combinationResult.description || 'Sự kết hợp của số chủ đạo và cung hoàng đạo trong cùng một người tạo nên tính cách độc đáo.'
        };

        return NextResponse.json({ data: updatedData });
      }
      
      // Nếu vẫn không tìm thấy, thử tìm dữ liệu trong collection numerology_compatibility
      // nhưng cần điều chỉnh để làm rõ đây là sự kết hợp trong một người
      let compatibilityData = await db.collection('numerology_compatibility').findOne({
        type: 'life-path-zodiac',
        $or: [
          {
            factor1Type: 'life-path',
            factor1Code: lifePathNumber,
            factor2Type: 'zodiac',
            factor2Code: zodiacSign
          },
          {
            factor1Type: 'zodiac',
            factor1Code: zodiacSign,
            factor2Type: 'life-path',
            factor2Code: lifePathNumber
          }
        ]
      });
      
      if (compatibilityData) {
        console.log('API compatibility: Tìm thấy dữ liệu trong collection numerology_compatibility, điều chỉnh cho phù hợp');
        
        // Điều chỉnh dữ liệu để phản ánh đây là kết hợp tính cách trong một người
        const personalData: CompatibilityData = {
          ...compatibilityData,
          isPersonalCombination: true,
          combinationType: 'personal_traits_combination',
          title: compatibilityData.title?.replace('Sự tương hợp giữa', 'Sự kết hợp của') || 
                 `Sự kết hợp của Số chủ đạo ${lifePathNumber} và Cung hoàng đạo ${zodiacSign}`,
          overview: compatibilityData.overview?.replace(/tương hợp|mối quan hệ|hai người/gi, 
                   (match: string) => {
                     if (match.toLowerCase() === 'tương hợp') return 'kết hợp';
                     if (match.toLowerCase() === 'mối quan hệ') return 'tính cách';
                     if (match.toLowerCase() === 'hai người') return 'bản thân';
                     return match;
                   }) || 
                   `Sự kết hợp giữa Số chủ đạo ${lifePathNumber} và Cung hoàng đạo ${zodiacSign} trong con người bạn tạo nên một tính cách đặc trưng với nhiều đặc điểm thú vị.`
        };
        
        // Điều chỉnh các mô tả trong compatibility_breakdown nếu có
        if (personalData.compatibility_breakdown) {
          if (personalData.compatibility_breakdown.love && personalData.compatibility_breakdown.love.description) {
            personalData.compatibility_breakdown.love.description = 
              personalData.compatibility_breakdown.love.description.replace(/tương hợp|mối quan hệ|hai người|cả hai/gi, 
              (match: string) => {
                if (match.toLowerCase() === 'tương hợp') return 'kết hợp';
                if (match.toLowerCase() === 'mối quan hệ') return 'biểu hiện tình cảm';
                if (match.toLowerCase() === 'hai người') return 'bản thân';
                if (match.toLowerCase() === 'cả hai') return 'các yếu tố này';
                return match;
              });
          }
          
          if (personalData.compatibility_breakdown.work && personalData.compatibility_breakdown.work.description) {
            personalData.compatibility_breakdown.work.description = 
              personalData.compatibility_breakdown.work.description.replace(/tương hợp|mối quan hệ|hai người|cả hai/gi, 
              (match: string) => {
                if (match.toLowerCase() === 'tương hợp') return 'kết hợp';
                if (match.toLowerCase() === 'mối quan hệ') return 'phong cách làm việc';
                if (match.toLowerCase() === 'hai người') return 'bản thân';
                if (match.toLowerCase() === 'cả hai') return 'các yếu tố này';
                return match;
              });
          }
        }
        
        return NextResponse.json({ data: personalData });
      }
      
      // Nếu không tìm thấy dữ liệu nào, tạo một đối tượng kết quả mặc định
      const defaultData: CompatibilityData = {
        _id: null,
        isPersonalCombination: true,
        combinationType: 'personal_traits_combination',
        title: `Sự kết hợp của Số chủ đạo ${lifePathNumber} và Cung hoàng đạo ${zodiacSign}`,
        overview: `Sự kết hợp giữa Số chủ đạo ${lifePathNumber} và Cung hoàng đạo ${zodiacSign} trong con người bạn tạo nên một tính cách đặc trưng với nhiều đặc điểm thú vị.`,
        compatibilityScore: 7.5,
        compatibility_breakdown: {
          emotional: 7,
          spiritual: 8,
          practical: 7,
          description: `Sự kết hợp này trong tính cách bạn tạo ra một sự cân bằng giữa các khía cạnh cảm xúc, tâm linh và thực tế.`
        },
        strengths: [
          `Khả năng kết hợp trực giác của cung ${zodiacSign} với sự ổn định của Số chủ đạo ${lifePathNumber}`,
          `Sự cân bằng giữa lý trí và cảm xúc`,
          `Khả năng thích nghi với nhiều tình huống khác nhau`
        ],
        challenges: [
          `Đôi khi gặp khó khăn khi cần dung hòa các đặc tính đối lập`,
          `Cần thời gian để tìm ra cách phát huy tối đa tiềm năng của cả hai yếu tố`
        ],
        advice: `Hãy cố gắng nhận thức về cả hai khía cạnh này trong tính cách của bạn và học cách tận dụng chúng một cách hài hòa.`
      };
      
      console.log('API compatibility: Không tìm thấy dữ liệu, trả về kết quả mặc định');
      return NextResponse.json({ data: defaultData });
    }
    
    // Xử lý các loại yêu cầu khác (nếu có)
    console.log('API compatibility: Không phải yêu cầu kết hợp tính cách, xử lý như yêu cầu tương hợp thông thường');
    const { db } = await connectToDatabase();
    
    // Các trường hợp khác sử dụng logic xử lý tương hợp thông thường
    const conditions = [
      {
        factor1Type,
        factor1Code,
        factor2Type,
        factor2Code
      },
      {
        factor1Type: factor2Type,
        factor1Code: factor2Code,
        factor2Type: factor1Type,
        factor2Code: factor1Code
      }
    ];
    
    // Xác định collection dựa trên loại yêu cầu
    let collectionName = '';
    if (type === 'life-path-zodiac') {
      collectionName = 'compatibility_life_path_zodiac';
    } else if (type === 'life-path-life-path') {
      collectionName = 'compatibility_life_path_life_path';
    } else if (type === 'zodiac-zodiac') {
      collectionName = 'compatibility_zodiac_zodiac';
    } else {
      collectionName = 'numerology_compatibility';
    }
    
    let data = await db.collection(collectionName).findOne({ $or: conditions });
    
    if (!data && collectionName !== 'numerology_compatibility') {
      data = await db.collection('numerology_compatibility').findOne({
        type,
        $or: conditions
      });
    }
    
    if (data) {
      return NextResponse.json({ data: { ...data, isPersonalCombination: false } });
    }
    
    return NextResponse.json({ error: 'Không tìm thấy dữ liệu tương hợp' }, { status: 404 });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu tương hợp:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
} 