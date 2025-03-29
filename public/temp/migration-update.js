// Migration script cập nhật cho MongoDB
// Chạy script này trực tiếp thông qua MongoDB Shell để cập nhật dữ liệu đã được di chuyển

// Bước 1: Lấy tất cả dữ liệu từ collection cũ
const oldData = db.numerology_basic_data.find({}).toArray();

// Bước 2: Chia dữ liệu thành các loại
const lifePathData = oldData.filter(item => item.type === 'life-path');
const zodiacData = oldData.filter(item => item.type === 'zodiac');

// Bước 3: Cập nhật dữ liệu số chủ đạo để đảm bảo đầy đủ các trường
let lifePathUpdated = 0;
lifePathData.forEach(data => {
  try {
    // Truy vấn dữ liệu hiện có trong collection mới
    const existingData = db.life_path_data.findOne({ code: data.code });
    
    // Tạo đối tượng cập nhật với tất cả các trường từ dữ liệu cũ
    const updateData = {
      // Các trường cơ bản
      code: data.code,
      title: data.title,
      overview: data.overview,
      traits: data.traits || [],
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      
      // Chi tiết bổ sung từ trường details
      numberMeaning: data.details?.numberMeaning || "",
      vibration: data.details?.vibration || "",
      personalityTraits: data.details?.personalityTraits || [],
      
      // Các trường bổ sung khác
      symbols: data.symbols || data.details?.symbols || [],
      famous_people: data.famous_people || data.details?.famous_people || [],
      lucky_elements: data.lucky_elements || data.details?.lucky_elements || {},
      compatibility: data.compatibility || data.details?.compatibility || {},
      
      // Thông tin chi tiết
      details: {
        ...(data.details || {}),
        career: data.details?.career || "",
        relationships: data.details?.relationships || "",
        advice: data.details?.advice || "",
        challenges: data.details?.challenges || "",
        opportunities: data.details?.opportunities || ""
      },
      
      // Cập nhật thời gian
      updatedAt: new Date()
    };
    
    if (existingData) {
      // Cập nhật dữ liệu
      db.life_path_data.updateOne(
        { code: data.code },
        { $set: updateData }
      );
      print(`Đã cập nhật số chủ đạo: ${data.code}`);
    } else {
      // Nếu dữ liệu chưa tồn tại, tạo mới
      updateData.createdAt = data.createdAt || new Date();
      db.life_path_data.insertOne(updateData);
      print(`Đã tạo mới số chủ đạo: ${data.code}`);
    }
    
    lifePathUpdated++;
  } catch (error) {
    print(`Lỗi khi cập nhật số chủ đạo ${data.code}: ${error.message}`);
  }
});

// Bước 4: Cập nhật dữ liệu cung hoàng đạo để đảm bảo đầy đủ các trường
let zodiacUpdated = 0;
zodiacData.forEach(data => {
  try {
    // Truy vấn dữ liệu hiện có trong collection mới
    const existingData = db.zodiac_data.findOne({ code: data.code });
    
    // Tạo đối tượng cập nhật với tất cả các trường từ dữ liệu cũ
    const updateData = {
      // Các trường cơ bản
      code: data.code,
      title: data.title,
      overview: data.overview,
      traits: data.traits || [],
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      
      // Các trường đặc thù cho cung hoàng đạo
      element: data.element || data.details?.element || "",
      ruling_planet: data.ruling_planet || data.details?.ruling_planet || "",
      date_range: data.date_range || data.details?.date_range || "",
      modality: data.modality || data.details?.modality || "",
      symbol: data.symbol || data.details?.symbol || "",
      
      // Các trường bổ sung khác
      symbols: data.symbols || data.details?.symbols || [],
      famous_people: data.famous_people || data.details?.famous_people || [],
      compatibility: data.compatibility || data.details?.compatibility || {},
      lucky_elements: data.lucky_elements || data.details?.lucky_elements || {},
      personality_in_different_life_stages: data.personality_in_different_life_stages || data.details?.personality_in_different_life_stages || {},
      
      // Thông tin chi tiết
      details: {
        ...(data.details || {}),
        personality: data.details?.personality || "",
        relationships: data.details?.relationships || "",
        career: data.details?.career || "",
        advice: data.details?.advice || ""
      },
      
      // Cập nhật thời gian
      updatedAt: new Date()
    };
    
    if (existingData) {
      // Cập nhật dữ liệu
      db.zodiac_data.updateOne(
        { code: data.code },
        { $set: updateData }
      );
      print(`Đã cập nhật cung hoàng đạo: ${data.code}`);
    } else {
      // Nếu dữ liệu chưa tồn tại, tạo mới
      updateData.createdAt = data.createdAt || new Date();
      db.zodiac_data.insertOne(updateData);
      print(`Đã tạo mới cung hoàng đạo: ${data.code}`);
    }
    
    zodiacUpdated++;
  } catch (error) {
    print(`Lỗi khi cập nhật cung hoàng đạo ${data.code}: ${error.message}`);
  }
});

// Bước 5: In thống kê
print("\n===== KẾT QUẢ CẬP NHẬT DỮ LIỆU =====");
print(`Tổng số dữ liệu cũ: ${oldData.length}`);
print(`Số chủ đạo: ${lifePathData.length} (Đã cập nhật: ${lifePathUpdated})`);
print(`Cung hoàng đạo: ${zodiacData.length} (Đã cập nhật: ${zodiacUpdated})`);
print("======================================"); 