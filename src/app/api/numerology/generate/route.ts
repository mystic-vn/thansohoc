import { NextResponse } from 'next/server';
import { generateNumerologyData, promptTemplates } from '@/lib/openai';
import { addNumerologyData, addLifePathZodiacCombination } from '@/lib/numerology-db';

export async function POST(request: Request) {
  try {
    // Đọc body request
    const body = await request.json();
    const { dataType, parameters, saveToDb = false } = body;
    
    console.log("API received dataType:", dataType);
    console.log("API received parameters:", parameters);
    
    // Xác định prompt dựa trên loại dữ liệu
    let prompt = '';
    switch (dataType) {
      case 'life-path':
        prompt = promptTemplates.lifePath(parameters.number);
        break;
      case 'zodiac':
        prompt = promptTemplates.zodiac(parameters.sign);
        break;
      case 'compatibility':
        // Kiểm tra xem có đủ các tham số cần thiết không
        if (!parameters.factor1Type || !parameters.factor2Type || !parameters.factor1 || !parameters.factor2) {
          console.error("Missing compatibility parameters:", parameters);
          return NextResponse.json({ 
            error: 'Thiếu thông tin cần thiết cho phân tích tương hợp',
            details: 'Cần có factor1Type, factor2Type, factor1, factor2'
          }, { status: 400 });
        }
        
        // Tạo tiêu đề chi tiết hơn dựa vào loại yếu tố
        let factor1Label = parameters.factor1Type === 'life-path' ? 'Số chủ đạo' : 
                          parameters.factor1Type === 'zodiac' ? 'Cung hoàng đạo' : 'Số biểu đạt';
        let factor2Label = parameters.factor2Type === 'life-path' ? 'Số chủ đạo' : 
                          parameters.factor2Type === 'zodiac' ? 'Cung hoàng đạo' : 'Số biểu đạt';
        
        prompt = promptTemplates.compatibility(
          `${factor1Label} ${parameters.factor1}`, 
          `${factor2Label} ${parameters.factor2}`
        );
        break;
      case 'life-path-zodiac-combination':
        if (!parameters.lifePathNumber || !parameters.zodiacSign) {
          console.error("Missing combination parameters:", parameters);
          return NextResponse.json({ 
            error: 'Thiếu thông tin cần thiết cho phân tích kết hợp',
            details: 'Cần có lifePathNumber và zodiacSign'
          }, { status: 400 });
        }
        
        prompt = promptTemplates.lifePathZodiacCombination(
          parameters.lifePathNumber, 
          parameters.zodiacSign
        );
        break;
      case 'year-analysis':
        prompt = promptTemplates.yearAnalysis(parameters.lifePathNumber, parameters.year);
        break;
      default:
        return NextResponse.json({ error: 'Loại dữ liệu không hợp lệ' }, { status: 400 });
    }
    
    // Gọi đến ChatGPT để sinh dữ liệu
    const rawResponse = await generateNumerologyData(prompt);
    
    // Xử lý kết quả trả về từ ChatGPT
    let parsedData;
    try {
      // Kiểm tra xem phản hồi có phải là HTML không
      if (rawResponse.trim().startsWith('<!DOCTYPE') || rawResponse.trim().startsWith('<html')) {
        console.error('Phản hồi là HTML, không phải JSON:', rawResponse.substring(0, 100));
        return NextResponse.json({
          error: 'Nhận được HTML thay vì JSON, vui lòng thử lại',
          rawResponse: rawResponse.substring(0, 500),
          tip: 'Có thể có vấn đề với API OpenAI. Vui lòng thử lại sau.'
        }, { status: 500 });
      }
      
      // Tìm JSON trong phản hồi bằng regex (đề phòng ChatGPT thêm văn bản giải thích)
      const jsonRegex = /{[\s\S]*}/;
      const match = rawResponse.match(jsonRegex);
      
      if (match) {
        parsedData = JSON.parse(match[0]);
      } else {
        // Nếu không tìm thấy JSON, thử parse trực tiếp
        try {
          parsedData = JSON.parse(rawResponse);
        } catch (parseError) {
          console.error('Lỗi khi parse JSON:', parseError);
          return NextResponse.json({
            error: 'Không thể phân tích dữ liệu JSON từ phản hồi',
            rawResponse,
            tip: 'Dữ liệu không ở định dạng JSON hợp lệ. Hãy thử lại lần nữa.'
          }, { status: 500 });
        }
      }
      
      // Lưu dữ liệu vào MongoDB nếu cần
      if (saveToDb && parsedData) {
        let collection, data;
        
        switch (dataType) {
          case 'life-path':
            // Lưu vào collection mới life_path_data thay vì collection cũ
            collection = 'life_path_data';
            data = {
              code: parameters.number,
              ...parsedData
            };
            break;
          case 'zodiac':
            // Lưu vào collection mới zodiac_data thay vì collection cũ
            collection = 'zodiac_data';
            data = {
              code: parameters.sign,
              ...parsedData
            };
            break;
          case 'compatibility':
            // Xác định collection dựa vào loại tương hợp
            let compatibilityCollection = '';
            
            if (parameters.factor1Type === 'life-path' && parameters.factor2Type === 'life-path') {
              compatibilityCollection = 'compatibility_life_path_life_path';
            } else if (parameters.factor1Type === 'zodiac' && parameters.factor2Type === 'zodiac') {
              compatibilityCollection = 'compatibility_zodiac_zodiac';
            } else {
              // Fallback cho các loại khác (nếu có)
              compatibilityCollection = 'numerology_compatibility';
            }
            
            data = {
              factor1Type: parameters.factor1Type,
              factor1Code: parameters.factor1,
              factor2Type: parameters.factor2Type,
              factor2Code: parameters.factor2,
              ...parsedData
            };
            
            collection = compatibilityCollection;
            break;
          case 'life-path-zodiac-combination':
            // Sử dụng hàm riêng cho kết hợp số chủ đạo và cung hoàng đạo
            await addLifePathZodiacCombination({
              lifePathNumber: parameters.lifePathNumber,
              zodiacSign: parameters.zodiacSign,
              ...parsedData,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            // Trả về kết quả mà không thêm vào collection
            return NextResponse.json({
              data: parsedData,
              saved: true
            });
          case 'year-analysis':
            collection = 'numerology_time_analysis';
            data = {
              type: 'year',
              code: parameters.lifePathNumber,
              year: parameters.year,
              lifePathNumber: parameters.lifePathNumber,
              personalYear: parsedData.personal_year_number || '',
              ...parsedData
            };
            break;
        }
        
        if (collection && data) {
          // Thêm thời gian tạo/cập nhật vào dữ liệu
          data.createdAt = new Date();
          data.updatedAt = new Date();
          
          await addNumerologyData(collection, data);
        }
      }
      
      return NextResponse.json({
        data: parsedData,
        saved: saveToDb && parsedData ? true : false
      });
    } catch (error: any) {
      console.error('Lỗi khi phân tích dữ liệu:', error);
      console.log('Dữ liệu thô từ ChatGPT:', rawResponse.substring(0, 200) + '...');
      return NextResponse.json({
        error: 'Không thể phân tích dữ liệu từ ChatGPT: ' + (error.message || 'Unknown error'),
        rawResponse: rawResponse.substring(0, 500),
        tip: 'Dữ liệu không ở định dạng JSON hợp lệ. Hãy thử lại lần nữa.'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Lỗi khi tạo dữ liệu:', error);
    return NextResponse.json({ 
      error: 'Lỗi khi tạo dữ liệu: ' + (error.message || 'Unknown error') 
    }, { status: 500 });
  }
} 