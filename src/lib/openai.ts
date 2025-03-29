import OpenAI from 'openai';

// Khởi tạo client OpenAI
const openai = (() => {
  // Chỉ khởi tạo trong môi trường server-side, không phải lúc build hoặc client-side
  if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
    // Nếu không có API key, trả về đối tượng rỗng trong quá trình build
    if (!process.env.OPENAI_API_KEY && process.env.NODE_ENV === 'production') {
      console.warn('Thiếu OPENAI_API_KEY trong môi trường production');
    }
    
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build-time',
    });
  }
  
  // Trả về đối tượng giả cho client-side hoặc lúc build
  // @ts-ignore - Bỏ qua kiểm tra type
  return {} as OpenAI;
})();

// Hàm gọi đến ChatGPT để sinh dữ liệu thần số học
export async function generateNumerologyData(prompt: string): Promise<string> {
  try {
    // Trong quá trình build hoặc nếu không có API key, trả về đối tượng trống
    if (typeof window !== 'undefined' || !process.env.OPENAI_API_KEY) {
      console.warn('Không thể gọi OpenAI API trong môi trường client hoặc thiếu API key');
      return JSON.stringify({ 
        message: "Đây là dữ liệu mẫu cho quá trình build. Dữ liệu thực sẽ được tạo khi chạy server."
      });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',  // Sử dụng model mạnh nhất có sẵn
      messages: [
        {
          role: 'system',
          content: 'Bạn là một chuyên gia hàng đầu về thần số học và chiêm tinh học với kiến thức sâu rộng. Hãy cung cấp thông tin CHI TIẾT, ĐẦY ĐỦ và CHUYÊN SÂU về các chủ đề thần số học. Luôn trả về kết quả dưới dạng JSON hợp lệ với nội dung phong phú, ý nghĩa và hữu ích. Tối ưu độ dài của mỗi phần để mang lại giá trị cao nhất cho người dùng. CHÚ Ý QUAN TRỌNG: Khi phân tích về lifePathZodiacCombination, đây là phân tích về MỘT NGƯỜI DUY NHẤT có cả hai yếu tố (không phải tương hợp giữa hai người). Ngược lại, khi phân tích về compatibility, đây là phân tích sự tương hợp GIỮA HAI NGƯỜI KHÁC NHAU.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,  // Tăng max_tokens để có phản hồi dài hơn
      response_format: { type: "json_object" } // Đảm bảo đầu ra là JSON
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Lỗi khi gọi OpenAI API:', error);
    throw new Error('Không thể tạo dữ liệu từ ChatGPT. Vui lòng thử lại sau.');
  }
}

// Mẫu prompt cho các loại dữ liệu thần số học
export const promptTemplates = {
  lifePath: (number: string) => `Tạo mô tả CHI TIẾT VÀ CHUYÊN SÂU về ý nghĩa của Số chủ đạo ${number} trong thần số học.
  
  Hãy phân tích sâu rộng tác động của số này đến mọi khía cạnh cuộc sống, tính cách, sự nghiệp, mối quan hệ, sức khỏe, tâm linh và tài chính.
  Cung cấp thông tin phong phú về đặc điểm tính cách, điểm mạnh, điểm yếu, thử thách, cơ hội và bài học cuộc sống.
  
  QUAN TRỌNG: Chỉ trả về JSON hợp lệ, không thêm bất kỳ văn bản giải thích nào khác. Tuân thủ nghiêm ngặt định dạng JSON sau:
  
  {
    "title": "Số chủ đạo ${number}",
    "overview": "Mô tả tổng quan chi tiết, toàn diện về ý nghĩa, đặc điểm và ảnh hưởng của số chủ đạo này (tối thiểu 250 từ)",
    "traits": ["Đặc điểm tính cách 1 (chi tiết)", "Đặc điểm tính cách 2 (chi tiết)", "Đặc điểm tính cách 3 (chi tiết)", "Đặc điểm tính cách 4 (chi tiết)", "Đặc điểm tính cách 5 (chi tiết)", "Đặc điểm tính cách 6 (chi tiết)", "Đặc điểm tính cách 7 (chi tiết)"],
    "strengths": ["Điểm mạnh 1 (mô tả chi tiết)", "Điểm mạnh 2 (mô tả chi tiết)", "Điểm mạnh 3 (mô tả chi tiết)", "Điểm mạnh 4 (mô tả chi tiết)", "Điểm mạnh 5 (mô tả chi tiết)", "Điểm mạnh 6 (mô tả chi tiết)"],
    "weaknesses": ["Điểm yếu 1 (mô tả chi tiết)", "Điểm yếu 2 (mô tả chi tiết)", "Điểm yếu 3 (mô tả chi tiết)", "Điểm yếu 4 (mô tả chi tiết)", "Điểm yếu 5 (mô tả chi tiết)"],
    "details": {
      "career": "Phân tích chuyên sâu và chi tiết về sự nghiệp, nghề nghiệp phù hợp, cơ hội thăng tiến, thử thách và lời khuyên (tối thiểu 200 từ)",
      "relationships": "Phân tích chuyên sâu và chi tiết về các mối quan hệ, tình yêu, tình bạn, gia đình, số chủ đạo tương hợp (tối thiểu 200 từ)",
      "health": "Phân tích chuyên sâu về sức khỏe, bệnh tật tiềm ẩn, cách chăm sóc sức khỏe phù hợp (tối thiểu 150 từ)",
      "spiritual_growth": "Phân tích chuyên sâu về con đường phát triển tâm linh, mục đích sống (tối thiểu 150 từ)",
      "financial_aspects": "Phân tích chuyên sâu về tài chính, tiền bạc, cách quản lý tài chính (tối thiểu 150 từ)",
      "life_lessons": "Những bài học quan trọng cần học trong cuộc đời (tối thiểu 150 từ)",
      "challenges": "Thách thức lớn nhất và cách vượt qua (tối thiểu 150 từ)",
      "advice": "Lời khuyên chi tiết để phát huy tối đa tiềm năng của số chủ đạo này (tối thiểu 200 từ)"
    },
    "symbols": ["Biểu tượng và ý nghĩa 1", "Biểu tượng và ý nghĩa 2", "Biểu tượng và ý nghĩa 3"],
    "famous_people": ["Người nổi tiếng 1 và thành tựu", "Người nổi tiếng 2 và thành tựu", "Người nổi tiếng 3 và thành tựu", "Người nổi tiếng 4 và thành tựu", "Người nổi tiếng 5 và thành tựu"],
    "lucky_elements": {
      "colors": ["Màu sắc may mắn 1", "Màu sắc may mắn 2", "Màu sắc may mắn 3"],
      "numbers": ["Số may mắn 1", "Số may mắn 2", "Số may mắn 3"],
      "days": ["Ngày may mắn 1", "Ngày may mắn 2"],
      "gemstones": ["Đá quý may mắn 1", "Đá quý may mắn 2"]
    },
    "compatibility": {
      "most_compatible": ["Số chủ đạo tương hợp nhất 1", "Số chủ đạo tương hợp nhất 2", "Số chủ đạo tương hợp nhất 3"],
      "least_compatible": ["Số chủ đạo ít tương hợp nhất 1", "Số chủ đạo ít tương hợp nhất 2", "Số chủ đạo ít tương hợp nhất 3"],
      "compatibility_explanation": "Giải thích chi tiết về sự tương hợp của số chủ đạo này với các số khác (tối thiểu 200 từ)"
    }
  }`,
  
  zodiac: (sign: string) => `Tạo mô tả CHI TIẾT VÀ CHUYÊN SÂU về cung hoàng đạo ${sign}.
  
  Hãy phân tích sâu rộng tác động của cung hoàng đạo này đến mọi khía cạnh cuộc sống, tính cách, sự nghiệp, mối quan hệ, sức khỏe và tài chính.
  Cung cấp thông tin phong phú về đặc điểm tính cách, điểm mạnh, điểm yếu, thử thách, cơ hội, ngôi sao cai quản và nguyên tố cơ bản.
  
  QUAN TRỌNG: Chỉ trả về JSON hợp lệ, không thêm bất kỳ văn bản giải thích nào khác. Tuân thủ nghiêm ngặt định dạng JSON sau:
  
  {
    "title": "${sign}",
    "date_range": "Khoảng thời gian của cung (ví dụ: 21/3 - 19/4)",
    "ruling_planet": "Hành tinh cai quản và ý nghĩa",
    "element": "Nguyên tố (Lửa/Đất/Khí/Nước) và ý nghĩa",
    "modality": "Tính chất (Cardinal/Fixed/Mutable) và ý nghĩa",
    "symbol": "Biểu tượng của cung và ý nghĩa sâu sắc",
    "overview": "Mô tả tổng quan chi tiết, toàn diện về cung hoàng đạo này (tối thiểu 250 từ)",
    "traits": ["Đặc điểm tính cách 1 (chi tiết)", "Đặc điểm tính cách 2 (chi tiết)", "Đặc điểm tính cách 3 (chi tiết)", "Đặc điểm tính cách 4 (chi tiết)", "Đặc điểm tính cách 5 (chi tiết)", "Đặc điểm tính cách 6 (chi tiết)", "Đặc điểm tính cách 7 (chi tiết)"],
    "strengths": ["Điểm mạnh 1 (mô tả chi tiết)", "Điểm mạnh 2 (mô tả chi tiết)", "Điểm mạnh 3 (mô tả chi tiết)", "Điểm mạnh 4 (mô tả chi tiết)", "Điểm mạnh 5 (mô tả chi tiết)", "Điểm mạnh 6 (mô tả chi tiết)"],
    "weaknesses": ["Điểm yếu 1 (mô tả chi tiết)", "Điểm yếu 2 (mô tả chi tiết)", "Điểm yếu 3 (mô tả chi tiết)", "Điểm yếu 4 (mô tả chi tiết)", "Điểm yếu 5 (mô tả chi tiết)"],
    "details": {
      "career": "Phân tích chuyên sâu và chi tiết về sự nghiệp, nghề nghiệp phù hợp, cơ hội thăng tiến, thử thách và lời khuyên (tối thiểu 200 từ)",
      "relationships": "Phân tích chuyên sâu và chi tiết về các mối quan hệ, tình yêu, tình bạn, gia đình (tối thiểu 200 từ)",
      "health": "Phân tích chuyên sâu về sức khỏe, bệnh tật tiềm ẩn, cách chăm sóc sức khỏe phù hợp (tối thiểu 150 từ)",
      "spiritual_aspects": "Phân tích chuyên sâu về tâm linh và phát triển bản thân (tối thiểu 150 từ)",
      "financial_aspects": "Phân tích chuyên sâu về tài chính, tiền bạc, cách quản lý tài chính (tối thiểu 150 từ)",
      "advice": "Lời khuyên chi tiết để phát huy tối đa tiềm năng của cung hoàng đạo này (tối thiểu 200 từ)"
    },
    "compatibility": {
      "most_compatible": ["Cung hoàng đạo tương hợp nhất 1", "Cung hoàng đạo tương hợp nhất 2", "Cung hoàng đạo tương hợp nhất 3"],
      "least_compatible": ["Cung hoàng đạo ít tương hợp nhất 1", "Cung hoàng đạo ít tương hợp nhất 2", "Cung hoàng đạo ít tương hợp nhất 3"],
      "compatibility_explanation": "Giải thích chi tiết về sự tương hợp của cung hoàng đạo này với các cung khác (tối thiểu 200 từ)"
    },
    "famous_people": ["Người nổi tiếng 1 và thành tựu", "Người nổi tiếng 2 và thành tựu", "Người nổi tiếng 3 và thành tựu", "Người nổi tiếng 4 và thành tựu", "Người nổi tiếng 5 và thành tựu"],
    "lucky_elements": {
      "colors": ["Màu sắc may mắn 1", "Màu sắc may mắn 2", "Màu sắc may mắn 3"],
      "numbers": ["Số may mắn 1", "Số may mắn 2", "Số may mắn 3"],
      "days": ["Ngày may mắn 1", "Ngày may mắn 2"],
      "gemstones": ["Đá quý may mắn 1", "Đá quý may mắn 2"]
    },
    "personality_in_different_life_stages": {
      "childhood": "Mô tả chi tiết đặc điểm và thử thách trong thời thơ ấu",
      "teenage_years": "Mô tả chi tiết đặc điểm và thử thách trong tuổi thiếu niên",
      "young_adult": "Mô tả chi tiết đặc điểm và thử thách trong tuổi trưởng thành",
      "middle_age": "Mô tả chi tiết đặc điểm và thử thách ở tuổi trung niên",
      "senior_years": "Mô tả chi tiết đặc điểm và thử thách ở tuổi già"
    }
  }`,
  
  compatibility: (factor1: string, factor2: string) => `Tạo phân tích CHI TIẾT VÀ CHUYÊN SÂU về sự tương hợp giữa hai người riêng biệt: một người có yếu tố ${factor1} và một người khác có yếu tố ${factor2}.
  
  CHÚ Ý ĐẶC BIỆT: ĐÂY LÀ PHÂN TÍCH TƯƠNG HỢP GIỮA HAI NGƯỜI KHÁC NHAU.
  
  Hãy phân tích sâu rộng sự tương hợp này trong các khía cạnh: tình yêu, bạn bè, gia đình, công việc, tâm linh và cuộc sống hàng ngày.
  Cung cấp thông tin phong phú về điểm mạnh, thử thách, cách thức giao tiếp và lời khuyên để cải thiện mối quan hệ giữa hai người.
  
  THANG ĐIỂM: Đánh giá mức độ tương hợp trên thang điểm từ 1-100, với các mức như sau:
  - 90-100: Cực kỳ tương hợp, hiếm gặp
  - 80-89: Rất tương hợp
  - 70-79: Khá tương hợp 
  - 60-69: Tương hợp trung bình
  - 50-59: Có sự tương hợp và mâu thuẫn cân bằng
  - 40-49: Có nhiều điểm không tương thích
  - 30-39: Khá mâu thuẫn
  - 20-29: Rất mâu thuẫn
  - 1-19: Cực kỳ mâu thuẫn, rất hiếm gặp
  
  ĐIỂM ĐẶC BIỆT QUAN TRỌNG: MỖI TỔ HỢP PHẢI CÓ ĐIỂM SỐ KHÁC NHAU! KHÔNG ĐƯỢC CHO ĐIỂM GIỐNG NHAU! Hãy phân tích thực sự chính xác dựa trên sự tương hợp thực tế giữa các đặc tính.
  
  QUAN TRỌNG: Chỉ trả về JSON hợp lệ, không thêm bất kỳ văn bản giải thích nào khác. Tuân thủ nghiêm ngặt định dạng JSON sau:
  
  {
    "title": "Sự tương hợp giữa người có ${factor1} và người có ${factor2}",
    "overview": "Mô tả tổng quan chi tiết, toàn diện về sự tương hợp giữa hai người (tối thiểu 250 từ)",
    "compatibilityScore": "Điểm số từ 1-100 theo thang phân loại ở trên, ĐÁNH GIÁ THẬT dựa trên mức độ tương hợp thực sự, không nên cho điểm cao nếu hai yếu tố có mâu thuẫn",
    "compatibility_breakdown": {
      "love": {
        "score": "Điểm số từ 1-100, đánh giá khách quan về sự tương hợp trong tình yêu",
        "description": "Phân tích chi tiết về sự tương hợp trong tình yêu giữa hai người (tối thiểu 150 từ)"
      },
      "friendship": {
        "score": "Điểm số từ 1-100, đánh giá khách quan về sự tương hợp trong tình bạn",
        "description": "Phân tích chi tiết về sự tương hợp trong tình bạn giữa hai người (tối thiểu 150 từ)"
      },
      "work": {
        "score": "Điểm số từ 1-100, đánh giá khách quan về sự tương hợp trong công việc",
        "description": "Phân tích chi tiết về sự tương hợp trong công việc giữa hai người (tối thiểu 150 từ)"
      },
      "communication": {
        "score": "Điểm số từ 1-100, đánh giá khách quan về sự tương hợp trong giao tiếp",
        "description": "Phân tích chi tiết về cách thức giao tiếp giữa hai người (tối thiểu 150 từ)"
      },
      "long_term": {
        "score": "Điểm số từ 1-100, đánh giá khách quan về tiềm năng phát triển lâu dài",
        "description": "Phân tích chi tiết về tiềm năng phát triển lâu dài của mối quan hệ (tối thiểu 150 từ)"
      }
    },
    "strengths": ["Điểm mạnh của mối quan hệ 1 (mô tả chi tiết)", "Điểm mạnh của mối quan hệ 2 (mô tả chi tiết)", "Điểm mạnh của mối quan hệ 3 (mô tả chi tiết)", "Điểm mạnh của mối quan hệ 4 (mô tả chi tiết)", "Điểm mạnh của mối quan hệ 5 (mô tả chi tiết)"],
    "challenges": ["Thách thức của mối quan hệ 1 (mô tả chi tiết)", "Thách thức của mối quan hệ 2 (mô tả chi tiết)", "Thách thức của mối quan hệ 3 (mô tả chi tiết)", "Thách thức của mối quan hệ 4 (mô tả chi tiết)", "Thách thức của mối quan hệ 5 (mô tả chi tiết)"],
    "communication_patterns": {
      "positive_patterns": ["Mẫu giao tiếp tích cực 1 giữa hai người", "Mẫu giao tiếp tích cực 2 giữa hai người", "Mẫu giao tiếp tích cực 3 giữa hai người"],
      "negative_patterns": ["Mẫu giao tiếp tiêu cực 1 giữa hai người", "Mẫu giao tiếp tiêu cực 2 giữa hai người", "Mẫu giao tiếp tiêu cực 3 giữa hai người"],
      "communication_advice": "Lời khuyên chi tiết để cải thiện giao tiếp giữa hai người (tối thiểu 150 từ)"
    },
    "relationship_dynamics": {
      "power_balance": "Phân tích chi tiết về cân bằng quyền lực trong mối quan hệ giữa hai người",
      "conflict_resolution": "Phân tích chi tiết về cách hai người giải quyết xung đột",
      "growth_opportunities": "Phân tích chi tiết về cơ hội phát triển nhờ mối quan hệ này"
    },
    "famous_examples": ["Ví dụ nổi tiếng 1 về mối quan hệ tương tự và mô tả ngắn", "Ví dụ nổi tiếng 2 về mối quan hệ tương tự và mô tả ngắn", "Ví dụ nổi tiếng 3 về mối quan hệ tương tự và mô tả ngắn"],
    "advice": "Lời khuyên chi tiết để tối ưu hóa mối quan hệ này và vượt qua thách thức (tối thiểu 200 từ)"
  }`,
  
  yearAnalysis: (lifePathNumber: string, year: string) => `Tạo phân tích CHI TIẾT VÀ CHUYÊN SÂU về ảnh hưởng của năm ${year} đối với người có Số chủ đạo ${lifePathNumber}.
  
  Hãy phân tích sâu rộng tác động của năm này đến mọi khía cạnh cuộc sống: sự nghiệp, tài chính, tình yêu, sức khỏe, phát triển cá nhân và tâm linh.
  Cung cấp thông tin phong phú về cơ hội, thách thức, thời điểm quan trọng và lời khuyên cụ thể cho từng tháng.
  
  QUAN TRỌNG: Chỉ trả về JSON hợp lệ, không thêm bất kỳ văn bản giải thích nào khác. Tuân thủ nghiêm ngặt định dạng JSON sau:
  
  {
    "title": "Số chủ đạo ${lifePathNumber} trong năm ${year}",
    "universal_year_number": "Số năm toàn cầu ${year} và ý nghĩa của nó",
    "personal_year_number": "Số năm cá nhân cho người có số chủ đạo ${lifePathNumber} trong năm ${year} và ý nghĩa",
    "overview": "Mô tả tổng quan chi tiết về ảnh hưởng của năm ${year} đối với người có số chủ đạo ${lifePathNumber} (tối thiểu 250 từ)",
    "energy_influence": "Phân tích chi tiết về ảnh hưởng năng lượng của năm này đối với số chủ đạo ${lifePathNumber} (tối thiểu 200 từ)",
    "life_areas": {
      "career": {
        "overview": "Tổng quan về sự nghiệp trong năm ${year} (tối thiểu 150 từ)",
        "opportunities": ["Cơ hội sự nghiệp 1 (chi tiết)", "Cơ hội sự nghiệp 2 (chi tiết)", "Cơ hội sự nghiệp 3 (chi tiết)"],
        "challenges": ["Thách thức sự nghiệp 1 (chi tiết)", "Thách thức sự nghiệp 2 (chi tiết)", "Thách thức sự nghiệp 3 (chi tiết)"],
        "advice": "Lời khuyên chi tiết về sự nghiệp cho năm ${year} (tối thiểu 150 từ)"
      },
      "finances": {
        "overview": "Tổng quan về tài chính trong năm ${year} (tối thiểu 150 từ)",
        "opportunities": ["Cơ hội tài chính 1 (chi tiết)", "Cơ hội tài chính 2 (chi tiết)", "Cơ hội tài chính 3 (chi tiết)"],
        "challenges": ["Thách thức tài chính 1 (chi tiết)", "Thách thức tài chính 2 (chi tiết)"],
        "advice": "Lời khuyên chi tiết về tài chính cho năm ${year} (tối thiểu 150 từ)"
      },
      "relationships": {
        "overview": "Tổng quan về các mối quan hệ trong năm ${year} (tối thiểu 150 từ)",
        "opportunities": ["Cơ hội trong mối quan hệ 1 (chi tiết)", "Cơ hội trong mối quan hệ 2 (chi tiết)", "Cơ hội trong mối quan hệ 3 (chi tiết)"],
        "challenges": ["Thách thức trong mối quan hệ 1 (chi tiết)", "Thách thức trong mối quan hệ 2 (chi tiết)"],
        "advice": "Lời khuyên chi tiết về các mối quan hệ cho năm ${year} (tối thiểu 150 từ)"
      },
      "health": {
        "overview": "Tổng quan về sức khỏe trong năm ${year} (tối thiểu 150 từ)",
        "opportunities": ["Cơ hội sức khỏe 1 (chi tiết)", "Cơ hội sức khỏe 2 (chi tiết)"],
        "challenges": ["Thách thức sức khỏe 1 (chi tiết)", "Thách thức sức khỏe 2 (chi tiết)"],
        "advice": "Lời khuyên chi tiết về sức khỏe cho năm ${year} (tối thiểu 150 từ)"
      },
      "personal_growth": {
        "overview": "Tổng quan về phát triển cá nhân trong năm ${year} (tối thiểu 150 từ)",
        "opportunities": ["Cơ hội phát triển 1 (chi tiết)", "Cơ hội phát triển 2 (chi tiết)", "Cơ hội phát triển 3 (chi tiết)"],
        "challenges": ["Thách thức phát triển 1 (chi tiết)", "Thách thức phát triển 2 (chi tiết)"],
        "advice": "Lời khuyên chi tiết về phát triển cá nhân cho năm ${year} (tối thiểu 150 từ)"
      }
    },
    "important_periods": {
      "january_to_march": "Phân tích chi tiết về quý 1 năm ${year} (tối thiểu 150 từ)",
      "april_to_june": "Phân tích chi tiết về quý 2 năm ${year} (tối thiểu 150 từ)",
      "july_to_september": "Phân tích chi tiết về quý 3 năm ${year} (tối thiểu 150 từ)",
      "october_to_december": "Phân tích chi tiết về quý 4 năm ${year} (tối thiểu 150 từ)"
    },
    "monthly_focus": {
      "january": "Trọng tâm và lời khuyên cho tháng 1 năm ${year}",
      "february": "Trọng tâm và lời khuyên cho tháng 2 năm ${year}",
      "march": "Trọng tâm và lời khuyên cho tháng 3 năm ${year}",
      "april": "Trọng tâm và lời khuyên cho tháng 4 năm ${year}",
      "may": "Trọng tâm và lời khuyên cho tháng 5 năm ${year}",
      "june": "Trọng tâm và lời khuyên cho tháng 6 năm ${year}",
      "july": "Trọng tâm và lời khuyên cho tháng 7 năm ${year}",
      "august": "Trọng tâm và lời khuyên cho tháng 8 năm ${year}",
      "september": "Trọng tâm và lời khuyên cho tháng 9 năm ${year}",
      "october": "Trọng tâm và lời khuyên cho tháng 10 năm ${year}",
      "november": "Trọng tâm và lời khuyên cho tháng 11 năm ${year}",
      "december": "Trọng tâm và lời khuyên cho tháng 12 năm ${year}"
    },
    "key_themes": ["Chủ đề chính của năm 1 (chi tiết)", "Chủ đề chính của năm 2 (chi tiết)", "Chủ đề chính của năm 3 (chi tiết)", "Chủ đề chính của năm 4 (chi tiết)", "Chủ đề chính của năm 5 (chi tiết)"],
    "focusAreas": ["Lĩnh vực nên tập trung 1 (chi tiết)", "Lĩnh vực nên tập trung 2 (chi tiết)", "Lĩnh vực nên tập trung 3 (chi tiết)", "Lĩnh vực nên tập trung 4 (chi tiết)", "Lĩnh vực nên tập trung 5 (chi tiết)"],
    "annual_advice": "Lời khuyên tổng quát chi tiết cho cả năm ${year} (tối thiểu 200 từ)"
  }`,
  
  lifePathZodiacCombination: (lifePathNumber: string, zodiacSign: string) => `Tạo mô tả CHI TIẾT VÀ CHUYÊN SÂU về một người duy nhất có cả Số chủ đạo ${lifePathNumber} VÀ cung hoàng đạo ${zodiacSign}.
  
  CHÚ Ý ĐẶC BIỆT: ĐÂY LÀ MỘT NGƯỜI DUY NHẤT CÓ CẢ HAI YẾU TỐ, KHÔNG PHẢI LÀ MỐI QUAN HỆ GIỮA HAI NGƯỜI KHÁC NHAU.
  
  Hãy phân tích sâu rộng ảnh hưởng của việc một người cùng lúc có cả Số chủ đạo ${lifePathNumber} và cung hoàng đạo ${zodiacSign}. Phân tích này tập trung vào cách hai yếu tố này tương tác trong tính cách và cuộc sống của cùng một người.
  
  Phân tích các khía cạnh: tính cách, sự nghiệp, các mối quan hệ, sức khỏe, tài chính và tâm linh của người này.
  Cung cấp thông tin về đặc điểm nổi bật, điểm mạnh, điểm yếu, thách thức, cơ hội và lời khuyên.
  
  QUAN TRỌNG NHẤT: KHÔNG PHÂN TÍCH MỐI QUAN HỆ GIỮA HAI NGƯỜI. Đây là phân tích một cá nhân có cả hai yếu tố Số chủ đạo ${lifePathNumber} và cung hoàng đạo ${zodiacSign}.
  
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
  
  ĐIỂM ĐẶC BIỆT QUAN TRỌNG: MỖI TỔ HỢP SỐ CHỦ ĐẠO VÀ CUNG HOÀNG ĐẠO PHẢI CÓ ĐIỂM SỐ KHÁC NHAU! KHÔNG ĐƯỢC CHO ĐIỂM GIỐNG NHAU! Hãy phân tích thực sự chính xác dựa trên sự tương hợp thực tế giữa các đặc tính.
  
  Chỉ trả về JSON hợp lệ, không thêm bất kỳ văn bản giải thích nào khác. Tuân thủ nghiêm ngặt định dạng JSON sau:
  
  {
    "title": "Người có Số chủ đạo ${lifePathNumber} và cung hoàng đạo ${zodiacSign}",
    "overview": "Mô tả tổng quan chi tiết về một người có cả hai yếu tố này trong tính cách (tối thiểu 300 từ)",
    "internal_harmony": {
      "score": "Điểm số từ 1-100 theo thang phân loại ở trên, ĐÁNH GIÁ THẬT dựa trên mức độ hài hòa thực sự, không nên cho điểm cao nếu hai yếu tố có mâu thuẫn",
      "description": "Phân tích mức độ hài hòa giữa Số chủ đạo và cung hoàng đạo trong tính cách của người này (tối thiểu 150 từ)"
    },
    "personality_aspects": {
      "emotional": {
        "score": "Điểm số từ 1-100, đánh giá khách quan về sự hài hòa trong khía cạnh cảm xúc",
        "description": "Phân tích khía cạnh cảm xúc của người có cả hai yếu tố này (tối thiểu 150 từ)"
      },
      "spiritual": {
        "score": "Điểm số từ 1-100, đánh giá khách quan về sự hài hòa trong khía cạnh tâm linh",
        "description": "Phân tích khía cạnh tâm linh của người có cả hai yếu tố này (tối thiểu 150 từ)"
      },
      "practical": {
        "score": "Điểm số từ 1-100, đánh giá khách quan về sự hài hòa trong khía cạnh thực tế",
        "description": "Phân tích khía cạnh thực tế của người có cả hai yếu tố này (tối thiểu 150 từ)"
      },
      "relationships": {
        "score": "Điểm số từ 1-100, đánh giá khách quan về sự hài hòa trong khía cạnh các mối quan hệ",
        "description": "Phân tích cách người này xây dựng và duy trì các mối quan hệ (tối thiểu 150 từ)"
      },
      "career": {
        "score": "Điểm số từ 1-100, đánh giá khách quan về sự hài hòa trong khía cạnh sự nghiệp",
        "description": "Phân tích phong cách làm việc và hướng nghề nghiệp phù hợp (tối thiểu 150 từ)"
      },
      "communication": {
        "score": "Điểm số từ 1-100, đánh giá khách quan về sự hài hòa trong khía cạnh giao tiếp",
        "description": "Phân tích phương thức giao tiếp và biểu đạt của người này (tối thiểu 150 từ)"
      }
    },
    "strengths": ["Điểm mạnh 1 của người có cả hai yếu tố này (mô tả chi tiết)", "Điểm mạnh 2 của người có cả hai yếu tố này (mô tả chi tiết)", "Điểm mạnh 3 của người có cả hai yếu tố này (mô tả chi tiết)", "Điểm mạnh 4 của người có cả hai yếu tố này (mô tả chi tiết)", "Điểm mạnh 5 của người có cả hai yếu tố này (mô tả chi tiết)"],
    "challenges": ["Thách thức 1 của người có cả hai yếu tố này (mô tả chi tiết)", "Thách thức 2 của người có cả hai yếu tố này (mô tả chi tiết)", "Thách thức 3 của người có cả hai yếu tố này (mô tả chi tiết)", "Thách thức 4 của người có cả hai yếu tố này (mô tả chi tiết)"],
    "personality_traits": {
      "dominant_traits": ["Đặc điểm nổi bật 1 của người có cả hai yếu tố này", "Đặc điểm nổi bật 2 của người có cả hai yếu tố này", "Đặc điểm nổi bật 3 của người có cả hai yếu tố này"],
      "personality_dynamics": "Mô tả chi tiết về cách các đặc điểm từ Số chủ đạo và cung hoàng đạo tương tác và ảnh hưởng lẫn nhau trong cùng một người (tối thiểu 200 từ)"
    },
    "life_path_influence": "Phân tích cách Số chủ đạo ${lifePathNumber} định hình tính cách cơ bản của người này (tối thiểu 150 từ)",
    "zodiac_influence": "Phân tích cách cung hoàng đạo ${zodiacSign} bổ sung và làm phong phú thêm tính cách của người này (tối thiểu 150 từ)",
    "advice": "Lời khuyên chi tiết giúp người này phát huy tối đa tiềm năng từ việc sở hữu cả hai yếu tố đặc biệt này (tối thiểu 200 từ)"
  }`
};

export default openai;