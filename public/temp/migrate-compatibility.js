// Migration script cho dữ liệu tương hợp
// Chạy script này trực tiếp thông qua MongoDB Shell

// Bước 1: Lấy tất cả dữ liệu tương hợp từ collection cũ
const compatibilityData = db.numerology_compatibility.find({}).toArray();

// Bước 2: Khởi tạo các collection mới nếu chưa có
const collections = db.getCollectionNames();

const requiredCollections = [
  'compatibility_life_path_life_path',
  'compatibility_life_path_zodiac',
  'compatibility_zodiac_zodiac'
];

requiredCollections.forEach(collectionName => {
  if (!collections.includes(collectionName)) {
    print(`Tạo collection mới: ${collectionName}`);
    db.createCollection(collectionName);
  }
});

// Bước 3: Tạo chỉ mục cho các collection mới
requiredCollections.forEach(collectionName => {
  db[collectionName].createIndex(
    { 
      factor1Type: 1, 
      factor1Code: 1,
      factor2Type: 1, 
      factor2Code: 1 
    }, 
    { unique: true }
  );
});

// Bước 4: Phân loại và di chuyển dữ liệu
let lifePathLifePathCount = 0;
let lifePathZodiacCount = 0;
let zodiacZodiacCount = 0;
let skippedCount = 0;

compatibilityData.forEach(data => {
  try {
    // Loại bỏ _id cũ
    delete data._id;
    
    // Đảm bảo có các trường cần thiết
    if (!data.factor1Type || !data.factor1Code || !data.factor2Type || !data.factor2Code) {
      print(`Bỏ qua dữ liệu không hợp lệ: ${JSON.stringify(data)}`);
      skippedCount++;
      return;
    }
    
    // Cập nhật thời gian
    data.migratedAt = new Date();
    if (!data.createdAt) data.createdAt = new Date();
    data.updatedAt = new Date();
    
    // Phân loại dữ liệu theo loại yếu tố
    let targetCollection = '';
    
    if (data.factor1Type === 'life-path' && data.factor2Type === 'life-path') {
      targetCollection = 'compatibility_life_path_life_path';
      lifePathLifePathCount++;
    } else if ((data.factor1Type === 'life-path' && data.factor2Type === 'zodiac') || 
               (data.factor1Type === 'zodiac' && data.factor2Type === 'life-path')) {
      targetCollection = 'compatibility_life_path_zodiac';
      lifePathZodiacCount++;
    } else if (data.factor1Type === 'zodiac' && data.factor2Type === 'zodiac') {
      targetCollection = 'compatibility_zodiac_zodiac';
      zodiacZodiacCount++;
    } else {
      print(`Loại tương hợp không xác định: ${data.factor1Type} vs ${data.factor2Type}`);
      skippedCount++;
      return;
    }
    
    // Kiểm tra xem dữ liệu đã tồn tại chưa
    const existingData = db[targetCollection].findOne({
      factor1Type: data.factor1Type,
      factor1Code: data.factor1Code,
      factor2Type: data.factor2Type,
      factor2Code: data.factor2Code
    });
    
    if (existingData) {
      // Cập nhật dữ liệu hiện có
      db[targetCollection].updateOne(
        {
          factor1Type: data.factor1Type,
          factor1Code: data.factor1Code,
          factor2Type: data.factor2Type,
          factor2Code: data.factor2Code
        },
        { $set: data }
      );
      print(`Cập nhật dữ liệu trong ${targetCollection} cho ${data.factor1Type} ${data.factor1Code} và ${data.factor2Type} ${data.factor2Code}`);
    } else {
      // Thêm dữ liệu mới
      db[targetCollection].insertOne(data);
      print(`Thêm dữ liệu vào ${targetCollection} cho ${data.factor1Type} ${data.factor1Code} và ${data.factor2Type} ${data.factor2Code}`);
    }
  } catch (error) {
    print(`Lỗi khi xử lý dữ liệu: ${error.message}`);
    skippedCount++;
  }
});

// Bước 5: In thống kê
print("\n===== KẾT QUẢ DI CHUYỂN DỮ LIỆU TƯƠNG HỢP =====");
print(`Tổng số dữ liệu tương hợp: ${compatibilityData.length}`);
print(`- Tương hợp số chủ đạo với số chủ đạo: ${lifePathLifePathCount}`);
print(`- Tương hợp số chủ đạo với cung hoàng đạo: ${lifePathZodiacCount}`);
print(`- Tương hợp cung hoàng đạo với cung hoàng đạo: ${zodiacZodiacCount}`);
print(`- Bỏ qua: ${skippedCount}`);
print("============================================="); 