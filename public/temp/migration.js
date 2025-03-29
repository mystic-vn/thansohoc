// Migration script for MongoDB
// Chạy script này trực tiếp thông qua MongoDB Shell

// Bước 1: Tạo các collection mới nếu chưa tồn tại
db.createCollection("life_path_data");
db.createCollection("zodiac_data");

// Bước 2: Lấy tất cả dữ liệu từ collection cũ
const oldData = db.numerology_basic_data.find({}).toArray();

// Bước 3: Chia dữ liệu thành các loại
const lifePathData = oldData.filter(item => item.type === 'life-path');
const zodiacData = oldData.filter(item => item.type === 'zodiac');

// Bước 4: Chuyển đổi và thêm dữ liệu số chủ đạo
let lifePathMigrated = 0;
lifePathData.forEach(data => {
  try {
    // Chuyển đổi từ định dạng cũ sang định dạng mới
    const newData = {
      code: data.code,
      title: data.title,
      overview: data.overview,
      traits: data.traits || [],
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      numberMeaning: data.details?.numberMeaning || "",
      vibration: data.details?.vibration || "",
      personalityTraits: data.details?.personalityTraits || [],
      details: data.details || {},
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    // Kiểm tra xem dữ liệu đã tồn tại chưa
    const exists = db.life_path_data.findOne({ code: data.code });
    
    if (!exists) {
      db.life_path_data.insertOne(newData);
      lifePathMigrated++;
      print(`Đã di chuyển số chủ đạo: ${data.code}`);
    } else {
      print(`Số chủ đạo ${data.code} đã tồn tại`);
    }
  } catch (error) {
    print(`Lỗi khi di chuyển số chủ đạo ${data.code}: ${error.message}`);
  }
});

// Bước 5: Chuyển đổi và thêm dữ liệu cung hoàng đạo
let zodiacMigrated = 0;
zodiacData.forEach(data => {
  try {
    // Chuyển đổi từ định dạng cũ sang định dạng mới
    const newData = {
      code: data.code,
      title: data.title,
      overview: data.overview,
      traits: data.traits || [],
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      element: data.details?.element || "",
      ruling_planet: data.details?.ruling_planet || "",
      date_range: data.details?.date_range || "",
      modality: data.details?.modality || "",
      symbol: data.details?.symbol || "",
      details: data.details || {},
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    // Kiểm tra xem dữ liệu đã tồn tại chưa
    const exists = db.zodiac_data.findOne({ code: data.code });
    
    if (!exists) {
      db.zodiac_data.insertOne(newData);
      zodiacMigrated++;
      print(`Đã di chuyển cung hoàng đạo: ${data.code}`);
    } else {
      print(`Cung hoàng đạo ${data.code} đã tồn tại`);
    }
  } catch (error) {
    print(`Lỗi khi di chuyển cung hoàng đạo ${data.code}: ${error.message}`);
  }
});

// Bước 6: Tạo index cho các collection mới
db.life_path_data.createIndex({ code: 1 }, { unique: true });
db.zodiac_data.createIndex({ code: 1 }, { unique: true });

// Bước 7: In thống kê
print("\n===== KẾT QUẢ DI CHUYỂN DỮ LIỆU =====");
print(`Tổng số dữ liệu cũ: ${oldData.length}`);
print(`Số chủ đạo: ${lifePathData.length} (Đã di chuyển: ${lifePathMigrated})`);
print(`Cung hoàng đạo: ${zodiacData.length} (Đã di chuyển: ${zodiacMigrated})`);
print("======================================="); 