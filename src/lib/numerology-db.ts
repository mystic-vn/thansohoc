import { ObjectId } from 'mongodb';
import { connectToDatabase } from './mongodb';
import clientPromise from './mongodb';

// Interfaces cho các loại dữ liệu riêng biệt
export interface BaseNumerologyData {
  _id?: ObjectId;
  code: string;                   // Mã định danh (ví dụ: '1', '2', 'Bạch Dương')
  title: string;                  // Tên/tiêu đề
  overview: string;               // Mô tả tổng quan
  traits: string[];               // Đặc điểm
  strengths: string[];            // Điểm mạnh
  weaknesses: string[];           // Điểm yếu
  createdAt?: Date;               // Ngày tạo
  updatedAt?: Date;               // Ngày cập nhật
}

export interface LifePathData extends BaseNumerologyData {
  numberMeaning: string;          // Ý nghĩa của số
  vibration: string;              // Rung động số học
  personalityTraits: string[];    // Đặc điểm tính cách
  symbols?: string[];             // Biểu tượng liên quan
  famous_people?: string[];       // Người nổi tiếng có cùng số chủ đạo
  lucky_elements?: {              // Các yếu tố may mắn
    colors?: string[];            // Màu sắc
    numbers?: number[];           // Số
    days?: string[];              // Ngày
    [key: string]: any;
  };
  compatibility?: {               // Thông tin về tương hợp
    best_matches?: string[];      // Số tương hợp tốt nhất
    challenges?: string[];        // Số có thách thức
    [key: string]: any;
  };
  details: {                      // Chi tiết bổ sung
    career: string;               // Sự nghiệp
    relationships: string;        // Các mối quan hệ
    advice: string;               // Lời khuyên
    challenges: string;           // Thách thức
    opportunities: string;        // Cơ hội
    [key: string]: any;           // Các thông tin khác
  };
}

export interface ZodiacData extends BaseNumerologyData {
  element: string;                // Nguyên tố (Lửa, Đất, Không khí, Nước)
  ruling_planet: string;          // Hành tinh cai quản
  date_range: string;             // Phạm vi ngày
  modality: string;               // Tính chất (Cardinal, Fixed, Mutable)
  symbol: string;                 // Biểu tượng
  symbols?: string[];             // Các biểu tượng liên quan
  famous_people?: string[];       // Người nổi tiếng thuộc cung
  compatibility?: {               // Thông tin về tương hợp
    best_matches?: string[];      // Cung tương hợp tốt nhất
    challenges?: string[];        // Cung có thách thức
    [key: string]: any;
  };
  lucky_elements?: {              // Các yếu tố may mắn
    colors?: string[];            // Màu sắc
    numbers?: number[];           // Số
    days?: string[];              // Ngày
    [key: string]: any;
  };
  personality_in_different_life_stages?: {  // Tính cách ở các giai đoạn khác nhau
    [key: string]: string;
  };
  details: {                      // Chi tiết bổ sung
    personality: string;          // Tính cách
    relationships: string;        // Các mối quan hệ
    career: string;               // Sự nghiệp
    advice: string;               // Lời khuyên
    [key: string]: any;           // Các thông tin khác
  };
}

// Interface cũ cho khả năng tương thích ngược
export interface NumerologyBasicData {
  _id?: ObjectId;
  type: 'life-path' | 'zodiac';  // Loại dữ liệu
  code: string;                   // '1', '2', 'Bạch Dương', etc.
  title: string;                  // Tên/tiêu đề
  overview: string;               // Mô tả tổng quan
  traits: string[];               // Đặc điểm
  strengths: string[];            // Điểm mạnh
  weaknesses: string[];           // Điểm yếu
  details: {                      // Chi tiết bổ sung
    career: string;               // Sự nghiệp
    relationships: string;        // Các mối quan hệ
    advice: string;               // Lời khuyên
    [key: string]: any;           // Các thông tin khác
  };
  createdAt?: Date;               // Ngày tạo
  updatedAt?: Date;               // Ngày cập nhật
}

export interface NumerologyCompatibility {
  _id?: ObjectId;
  type: 'life-path-zodiac' | 'life-path-life-path' | 'life-path-year';  // Loại tương hợp
  factor1: {                      // Yếu tố 1
    type: string;                 // 'life-path', 'zodiac', 'year'
    code: string;                 // '1', 'Bạch Dương', '2025'
  };
  factor2: {                      // Yếu tố 2
    type: string;
    code: string;
  };
  compatibilityScore?: number;    // Điểm tương hợp (nếu có)
  overview: string;               // Tổng quan về sự tương hợp
  strengths: string[];            // Điểm mạnh của sự kết hợp
  challenges: string[];           // Thách thức của sự kết hợp
  advice: string;                 // Lời khuyên
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NumerologyTimeAnalysis {
  _id?: ObjectId;
  type: 'universal-year' | 'personal-year' | 'life-path-year';  // Loại phân tích
  code: string;                  // '9', '1', '1-9'
  year?: number;                 // Năm cụ thể (nếu có)
  lifePathNumber?: string;       // Số chủ đạo (nếu có)
  personalYear?: string;         // Số năm cá nhân (nếu có)
  title: string;                 // Tiêu đề phân tích
  overview: string;              // Tổng quan
  opportunities: string[];       // Cơ hội
  challenges: string[];          // Thách thức
  focusAreas: string[];          // Lĩnh vực nên tập trung
  advice: string;                // Lời khuyên
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface cho dữ liệu kết hợp giữa số chủ đạo và cung hoàng đạo trong một người
export interface LifePathZodiacCombination {
  _id?: any;
  lifePathNumber: string;
  zodiacSign: string;
  title: string;
  overview: string;
  compatibilityScore?: number; // Điểm hài hòa giữa hai yếu tố
  description?: string;
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
  strengths?: string[]; // Điểm mạnh khi có sự kết hợp này
  challenges?: string[]; // Thách thức khi có sự kết hợp này
  advice?: string; // Lời khuyên cho người có sự kết hợp này
  isPersonalCombination?: boolean; // Đánh dấu đây là sự kết hợp trong một người
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any; // Cho phép các trường bổ sung
}

// Helper functions
export function calculateUniversalYear(year: number): string {
  const yearSum = year.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  
  let result = yearSum;
  // Giảm xuống còn 1 chữ số
  while (result > 9) {
    result = result.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  
  return result.toString();
}

// COLLECTIONS MỚI
const LIFE_PATH_COLLECTION = 'life_path_data';
const ZODIAC_COLLECTION = 'zodiac_data';
const COMPATIBILITY_COLLECTION = 'numerology_compatibility';
const TIME_ANALYSIS_COLLECTION = 'numerology_time_analysis';

// CRUD operations cho collection mới

// Lấy dữ liệu số chủ đạo
export async function getLifePathData(code: string, fields?: string[]) {
  const { db } = await connectToDatabase();
  const projection: any = {};
  
  if (fields && fields.length > 0) {
    fields.forEach(field => {
      projection[field] = 1;
    });
  }
  
  return await db.collection(LIFE_PATH_COLLECTION).findOne(
    { code },
    fields ? { projection } : {}
  );
}

/**
 * Lấy dữ liệu chi tiết cho một cung hoàng đạo cụ thể
 */
export async function getZodiacData(code: string, fields?: string[]) {
  try {
    const { db } = await connectToDatabase();
    
    // Chọn các trường để trả về
    const projection: Record<string, number> = {};
    
    if (fields && fields.length > 0) {
      fields.forEach(field => {
        projection[field] = 1;
      });
    }
    
    // Thêm các trường quan trọng vào projection để đảm bảo chúng luôn được trả về
    // ngay cả khi không được chỉ định trong fields
    const essentialFields = [
      'title', 'overview', 'traits', 'strengths', 'weaknesses',
      'element', 'ruling_planet', 'date_range', 'modality', 'symbol',
      'famous_people', 'compatibility', 'lucky_elements', 'details', 'code', 'name'
    ];
    
    essentialFields.forEach(field => {
      if (!fields || !fields.includes(field)) {
        projection[field] = 1;
      }
    });
    
    // Tìm kiếm dữ liệu dựa trên cả code và name để đảm bảo tìm được đúng
    let data = await db.collection(ZODIAC_COLLECTION).findOne(
      { code: code },
      { projection: Object.keys(projection).length > 0 ? projection : undefined }
    );
    
    // Nếu không tìm thấy bằng code, thử tìm bằng name
    if (!data) {
      data = await db.collection(ZODIAC_COLLECTION).findOne(
        { name: code },
        { projection: Object.keys(projection).length > 0 ? projection : undefined }
      );
    }
    
    // Log để debug
    console.log(`Tìm kiếm cung hoàng đạo với code/name: ${code}`, data ? 'Đã tìm thấy' : 'Không tìm thấy');
    
    return data;
  } catch (error) {
    console.error('Lỗi khi truy vấn dữ liệu cung hoàng đạo:', error);
    throw error;
  }
}

// Lấy tất cả dữ liệu số chủ đạo
export async function getAllLifePathData() {
  const { db } = await connectToDatabase();
  return await db.collection(LIFE_PATH_COLLECTION).find({}).toArray();
}

// Lấy tất cả dữ liệu cung hoàng đạo
export async function getAllZodiacData() {
  const { db } = await connectToDatabase();
  return await db.collection(ZODIAC_COLLECTION).find({}).toArray();
}

// Thêm dữ liệu số chủ đạo mới
export async function addLifePathData(data: LifePathData) {
  const { db } = await connectToDatabase();
  data.createdAt = new Date();
  data.updatedAt = new Date();
  return await db.collection(LIFE_PATH_COLLECTION).insertOne(data);
}

// Thêm dữ liệu cung hoàng đạo mới
export async function addZodiacData(data: ZodiacData) {
  const { db } = await connectToDatabase();
  data.createdAt = new Date();
  data.updatedAt = new Date();
  return await db.collection(ZODIAC_COLLECTION).insertOne(data);
}

// Cập nhật dữ liệu số chủ đạo
export async function updateLifePathData(code: string, data: Partial<LifePathData>) {
  const { db } = await connectToDatabase();
  data.updatedAt = new Date();
  return await db.collection(LIFE_PATH_COLLECTION).updateOne(
    { code },
    { $set: data }
  );
}

// Cập nhật dữ liệu cung hoàng đạo
export async function updateZodiacData(code: string, data: Partial<ZodiacData>) {
  const { db } = await connectToDatabase();
  data.updatedAt = new Date();
  return await db.collection(ZODIAC_COLLECTION).updateOne(
    { code },
    { $set: data }
  );
}

// Xóa dữ liệu số chủ đạo
export async function deleteLifePathData(code: string) {
  const { db } = await connectToDatabase();
  return await db.collection(LIFE_PATH_COLLECTION).deleteOne({ code });
}

// Xóa dữ liệu cung hoàng đạo
export async function deleteZodiacData(code: string) {
  const { db } = await connectToDatabase();
  return await db.collection(ZODIAC_COLLECTION).deleteOne({ code });
}

// HÀM TƯƠNG THÍCH NGƯỢC để đảm bảo code hiện tại vẫn hoạt động

// Lấy dữ liệu cơ bản (hàm tương thích ngược)
export async function getBasicNumerologyData(type: string, code: string) {
  const { db } = await connectToDatabase();
  
  // Kiểm tra xem dữ liệu có trong collection mới chưa
  if (type === 'life-path') {
    const data = await db.collection(LIFE_PATH_COLLECTION).findOne({ code });
    if (data) {
      // Chuyển đổi từ định dạng mới sang định dạng cũ
      return {
        type: 'life-path',
        code: data.code,
        title: data.title,
        overview: data.overview,
        traits: data.traits,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        details: data.details,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    }
  } else if (type === 'zodiac') {
    const data = await db.collection(ZODIAC_COLLECTION).findOne({ code });
    if (data) {
      // Chuyển đổi từ định dạng mới sang định dạng cũ
      return {
        type: 'zodiac',
        code: data.code,
        title: data.title,
        overview: data.overview,
        traits: data.traits,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        details: {
          ...data.details,
          element: data.element,
          ruling_planet: data.ruling_planet,
          date_range: data.date_range,
          modality: data.modality
        },
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    }
  }
  
  // Nếu không tìm thấy trong collection mới, thử tìm trong collection cũ
  return await db.collection('numerology_basic_data').findOne({ type, code });
}

// Lấy tất cả dữ liệu cơ bản theo loại (hàm tương thích ngược)
export async function getAllBasicDataByType(type: string) {
  const { db } = await connectToDatabase();
  
  if (type === 'life-path') {
    const lifePathData = await getAllLifePathData();
    // Nếu có dữ liệu trong collection mới, chuyển đổi về định dạng cũ
    if (lifePathData && lifePathData.length > 0) {
      return lifePathData.map(data => ({
        type: 'life-path',
        code: data.code,
        title: data.title,
        overview: data.overview,
        traits: data.traits,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        details: data.details,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }));
    }
  } else if (type === 'zodiac') {
    const zodiacData = await getAllZodiacData();
    // Nếu có dữ liệu trong collection mới, chuyển đổi về định dạng cũ
    if (zodiacData && zodiacData.length > 0) {
      return zodiacData.map(data => ({
        type: 'zodiac',
        code: data.code,
        title: data.title,
        overview: data.overview,
        traits: data.traits,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        details: {
          ...data.details,
          element: data.element,
          ruling_planet: data.ruling_planet,
          date_range: data.date_range,
          modality: data.modality
        },
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }));
    }
  }
  
  // Nếu không có dữ liệu trong collection mới, lấy từ collection cũ
  return await db.collection('numerology_basic_data').find({ type }).toArray();
}

// Lấy dữ liệu tương hợp
export async function getCompatibilityData(
  type: string,
  factor1Type: string,
  factor1Code: string,
  factor2Type: string,
  factor2Code: string
) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Xác định collection dựa vào loại yếu tố
    let collection = '';
    
    if (factor1Type === 'life-path' && factor2Type === 'life-path') {
      collection = 'compatibility_life_path_life_path';
    } else if ((factor1Type === 'life-path' && factor2Type === 'zodiac') || 
               (factor1Type === 'zodiac' && factor2Type === 'life-path')) {
      collection = 'compatibility_life_path_zodiac';
    } else if (factor1Type === 'zodiac' && factor2Type === 'zodiac') {
      collection = 'compatibility_zodiac_zodiac';
    } else {
      // Fallback cho các loại khác (nếu có)
      collection = 'numerology_compatibility';
    }
    
    // Kiểm tra trường hợp đặc biệt khi factor1 và factor2 có thể đổi chỗ cho nhau (chỉ áp dụng cho loại giống nhau)
    let data = null;
    
    // Tìm kiếm với thứ tự gốc
    data = await db.collection(collection).findOne({
      factor1Type,
      factor1Code,
      factor2Type,
      factor2Code
    });
    
    // Nếu không tìm thấy, thử tìm với thứ tự ngược lại (đối với cùng loại factor)
    if (!data && ((factor1Type === factor2Type) || 
                 (collection === 'compatibility_life_path_zodiac'))) {
      data = await db.collection(collection).findOne({
        factor1Type: factor2Type,
        factor1Code: factor2Code,
        factor2Type: factor1Type,
        factor2Code: factor1Code
      });
    }
    
    // Nếu vẫn không tìm thấy, thử tìm trong collection cũ
    if (!data && collection !== 'numerology_compatibility') {
      data = await db.collection('numerology_compatibility').findOne({
        type,
        factor1Type,
        factor1Code,
        factor2Type,
        factor2Code
      });
      
      // Thử tìm với thứ tự ngược lại trong collection cũ
      if (!data && ((factor1Type === factor2Type) || 
                   (factor1Type === 'life-path' && factor2Type === 'zodiac') || 
                   (factor1Type === 'zodiac' && factor2Type === 'life-path'))) {
        data = await db.collection('numerology_compatibility').findOne({
          type,
          factor1Type: factor2Type,
          factor1Code: factor2Code,
          factor2Type: factor1Type,
          factor2Code: factor1Code
        });
      }
    }
    
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu tương hợp:', error);
    throw error;
  }
}

// Lấy dữ liệu phân tích thời gian
export async function getTimeAnalysis(type: string, code: string) {
  const { db } = await connectToDatabase();
  return await db.collection(TIME_ANALYSIS_COLLECTION).findOne({ type, code });
}

// Lấy phân tích cho số chủ đạo và năm
export async function getLifePathYearAnalysis(lifePathNumber: string, year: number) {
  const { db } = await connectToDatabase();
  const universalYear = calculateUniversalYear(year);
  
  return await db.collection(TIME_ANALYSIS_COLLECTION).findOne({
    type: 'life-path-year',
    code: `${lifePathNumber}-${universalYear}`
  });
}

// Thêm dữ liệu vào collection
export async function addNumerologyData(collection: string, data: any) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Đảm bảo collection tồn tại, nếu không thì tạo mới
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some((col: { name: string }) => col.name === collection);
    
    if (!collectionExists) {
      console.log(`Collection ${collection} không tồn tại. Đang tạo mới...`);
      await db.createCollection(collection);
      
      // Tạo các chỉ mục cần thiết dựa trên loại collection
      if (collection === 'life_path_data' || collection === 'zodiac_data') {
        await db.collection(collection).createIndex({ code: 1 }, { unique: true });
      } else if (collection === 'numerology_compatibility') {
        await db.collection(collection).createIndex(
          { 
            type: 1, 
            factor1Type: 1, 
            factor1Code: 1,
            factor2Type: 1, 
            factor2Code: 1 
          }, 
          { unique: true }
        );
      } else if (collection === 'numerology_time_analysis') {
        await db.collection(collection).createIndex(
          { type: 1, code: 1, year: 1 }, 
          { unique: true }
        );
      }
    }

    // Xử lý thêm dữ liệu tùy theo collection
    if (collection === 'life_path_data' || collection === 'zodiac_data') {
      // Kiểm tra xem đã có dữ liệu với code này chưa
      const existingData = await db.collection(collection).findOne({ code: data.code });
      
      if (existingData) {
        // Nếu đã có, cập nhật dữ liệu
        data.updatedAt = new Date();
        const result = await db.collection(collection).updateOne(
          { code: data.code },
          { $set: data }
        );
        return { updated: true, result };
      } else {
        // Nếu chưa có, thêm mới
        data.createdAt = new Date();
        data.updatedAt = new Date();
        const result = await db.collection(collection).insertOne(data);
        return { inserted: true, result };
      }
    } else if (collection.startsWith('compatibility_')) {
      // Xử lý cho các collection tương hợp mới
      const existingData = await db.collection(collection).findOne({
        factor1Type: data.factor1Type,
        factor1Code: data.factor1Code,
        factor2Type: data.factor2Type,
        factor2Code: data.factor2Code
      });
      
      if (existingData) {
        // Nếu đã có, cập nhật dữ liệu
        data.updatedAt = new Date();
        const result = await db.collection(collection).updateOne(
          {
            factor1Type: data.factor1Type,
            factor1Code: data.factor1Code,
            factor2Type: data.factor2Type,
            factor2Code: data.factor2Code
          },
          { $set: data }
        );
        return { updated: true, result };
      } else {
        // Nếu chưa có, thêm mới
        data.createdAt = new Date();
        data.updatedAt = new Date();
        const result = await db.collection(collection).insertOne(data);
        return { inserted: true, result };
      }
    } else if (collection === 'numerology_compatibility') {
      // Kiểm tra xem đã có dữ liệu tương hợp này chưa
      const existingData = await db.collection(collection).findOne({
        type: data.type,
        factor1Type: data.factor1Type,
        factor1Code: data.factor1Code,
        factor2Type: data.factor2Type,
        factor2Code: data.factor2Code
      });
      
      if (existingData) {
        // Nếu đã có, cập nhật dữ liệu
        data.updatedAt = new Date();
        const result = await db.collection(collection).updateOne(
          {
            type: data.type,
            factor1Type: data.factor1Type,
            factor1Code: data.factor1Code,
            factor2Type: data.factor2Type,
            factor2Code: data.factor2Code
          },
          { $set: data }
        );
        return { updated: true, result };
      } else {
        // Nếu chưa có, thêm mới
        data.createdAt = new Date();
        data.updatedAt = new Date();
        const result = await db.collection(collection).insertOne(data);
        return { inserted: true, result };
      }
    } else if (collection === 'numerology_time_analysis') {
      // Kiểm tra xem đã có phân tích thời gian này chưa
      const existingData = await db.collection(collection).findOne({
        type: data.type,
        code: data.code,
        year: data.year
      });
      
      if (existingData) {
        // Nếu đã có, cập nhật dữ liệu
        data.updatedAt = new Date();
        const result = await db.collection(collection).updateOne(
          {
            type: data.type,
            code: data.code,
            year: data.year
          },
          { $set: data }
        );
        return { updated: true, result };
      } else {
        // Nếu chưa có, thêm mới
        data.createdAt = new Date();
        data.updatedAt = new Date();
        const result = await db.collection(collection).insertOne(data);
        return { inserted: true, result };
      }
    } else {
      // Collection khác, thêm dữ liệu bình thường
      data.createdAt = new Date();
      data.updatedAt = new Date();
      const result = await db.collection(collection).insertOne(data);
      return { inserted: true, result };
    }
  } catch (error) {
    console.error(`Lỗi khi thêm dữ liệu vào collection ${collection}:`, error);
    throw error;
  }
}

// Hàm hỗ trợ chuyển đổi từ dữ liệu cũ sang mới
export function convertToLifePathData(oldData: NumerologyBasicData): LifePathData {
  const { type, ...rest } = oldData;
  return {
    ...rest,
    numberMeaning: oldData.details?.numberMeaning || '',
    vibration: oldData.details?.vibration || '',
    personalityTraits: oldData.details?.personalityTraits || [],
    symbols: oldData.details?.symbols || [],
    famous_people: oldData.details?.famous_people || [],
    lucky_elements: oldData.details?.lucky_elements || {},
    compatibility: oldData.details?.compatibility || {}
  } as LifePathData;
}

export function convertToZodiacData(oldData: any): ZodiacData {
  return {
    code: oldData.code,
    title: oldData.title,
    overview: oldData.overview,
    traits: oldData.traits || [],
    strengths: oldData.strengths || [],
    weaknesses: oldData.weaknesses || [],
    element: oldData.element || oldData.details?.element || "",
    ruling_planet: oldData.ruling_planet || oldData.details?.ruling_planet || "",
    date_range: oldData.date_range || oldData.details?.date_range || "",
    modality: oldData.modality || oldData.details?.modality || "",
    symbol: oldData.symbol || oldData.details?.symbol || "",
    symbols: oldData.symbols || [],
    famous_people: oldData.famous_people || [],
    compatibility: oldData.compatibility || {},
    lucky_elements: oldData.lucky_elements || {},
    personality_in_different_life_stages: oldData.personality_in_different_life_stages || {},
    details: {
      ...(oldData.details || {}),
      personality: oldData.details?.personality || "",
      relationships: oldData.details?.relationships || "",
      career: oldData.details?.career || "",
      advice: oldData.details?.advice || ""
    },
    createdAt: oldData.createdAt || new Date(),
    updatedAt: new Date()
  } as ZodiacData;
}

// Cập nhật dữ liệu (hàm tương thích ngược)
export async function updateNumerologyData(collection: string, query: any, data: any) {
  const { db } = await connectToDatabase();
  data.updatedAt = new Date();
  
  // Chuyển đổi dữ liệu cũ sang định dạng mới nếu cần
  if (collection === 'numerology_basic_data' && query.type) {
    if (query.type === 'life-path' && query.code) {
      return await updateLifePathData(query.code, convertToLifePathData({ ...query, ...data }));
    } else if (query.type === 'zodiac' && query.code) {
      return await updateZodiacData(query.code, convertToZodiacData({ ...query, ...data }));
    }
  }
  
  // Nếu không phải dữ liệu cần chuyển đổi, cập nhật vào collection được chỉ định
  return await db.collection(collection).updateOne(query, { $set: data });
}

// Xóa dữ liệu (hàm tương thích ngược)
export async function deleteNumerologyData(collection: string, query: any) {
  const { db } = await connectToDatabase();
  
  // Xóa dữ liệu từ collection mới nếu cần
  if (collection === 'numerology_basic_data' && query.type) {
    if (query.type === 'life-path' && query.code) {
      return await deleteLifePathData(query.code);
    } else if (query.type === 'zodiac' && query.code) {
      return await deleteZodiacData(query.code);
    }
  }
  
  // Nếu không phải dữ liệu cần chuyển đổi, xóa từ collection được chỉ định
  return await db.collection(collection).deleteOne(query);
}

// Lấy tất cả dữ liệu từ một collection (cho trang admin)
export async function getAllFromCollection(collection: string) {
  const { db } = await connectToDatabase();
  
  // Xử lý đặc biệt cho collection cũ
  if (collection === 'numerology_basic_data') {
    // Lấy dữ liệu từ cả collection cũ và mới
    const oldData = await db.collection(collection).find({}).toArray();
    const lifePathData = await getAllLifePathData();
    const zodiacData = await getAllZodiacData();
    
    // Chuyển đổi dữ liệu mới sang định dạng cũ
    const convertedLifePathData = lifePathData.map(data => ({
      type: 'life-path',
      ...data,
      details: {
        ...data.details
      }
    }));
    
    const convertedZodiacData = zodiacData.map(data => ({
      type: 'zodiac',
      ...data,
      details: {
        ...data.details,
        element: data.element,
        ruling_planet: data.ruling_planet,
        date_range: data.date_range,
        modality: data.modality
      }
    }));
    
    // Lọc ra dữ liệu cũ không có trong dữ liệu mới
    const oldLifePathData = oldData.filter(old => 
      old.type === 'life-path' && !lifePathData.some(newData => newData.code === old.code)
    );
    
    const oldZodiacData = oldData.filter(old => 
      old.type === 'zodiac' && !zodiacData.some(newData => newData.code === old.code)
    );
    
    // Kết hợp tất cả dữ liệu
    return [...convertedLifePathData, ...convertedZodiacData, ...oldLifePathData, ...oldZodiacData];
  }
  
  // Đối với các collection khác, lấy dữ liệu như bình thường
  return await db.collection(collection).find({}).toArray();
}

// Lấy dữ liệu kết hợp số chủ đạo và cung hoàng đạo
export async function getLifePathZodiacCombination(lifePathNumber: string, zodiacSign: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const data = await db.collection('life_path_zodiac_combinations').findOne({
      lifePathNumber,
      zodiacSign
    });

    return data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu kết hợp số chủ đạo và cung hoàng đạo:', error);
    throw error;
  }
}

// Thêm/cập nhật dữ liệu kết hợp số chủ đạo và cung hoàng đạo
export async function addLifePathZodiacCombination(data: LifePathZodiacCombination) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Kiểm tra collection tồn tại chưa
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some((col: { name: string }) => col.name === 'life_path_zodiac_combinations');

    if (!collectionExists) {
      console.log('Tạo collection mới: life_path_zodiac_combinations');
      await db.createCollection('life_path_zodiac_combinations');
      await db.collection('life_path_zodiac_combinations').createIndex(
        { lifePathNumber: 1, zodiacSign: 1 },
        { unique: true }
      );
    }

    // Kiểm tra dữ liệu đã tồn tại chưa
    const existingData = await db.collection('life_path_zodiac_combinations').findOne({
      lifePathNumber: data.lifePathNumber,
      zodiacSign: data.zodiacSign
    });

    if (existingData) {
      // Nếu đã có, cập nhật
      data.updatedAt = new Date();
      const result = await db.collection('life_path_zodiac_combinations').updateOne(
        { lifePathNumber: data.lifePathNumber, zodiacSign: data.zodiacSign },
        { $set: data }
      );
      return { updated: true, result };
    } else {
      // Nếu chưa có, thêm mới
      data.createdAt = new Date();
      data.updatedAt = new Date();
      const result = await db.collection('life_path_zodiac_combinations').insertOne(data);
      return { inserted: true, result };
    }
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu kết hợp số chủ đạo và cung hoàng đạo:', error);
    throw error;
  }
} 