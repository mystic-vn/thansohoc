import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'thansohoc_db';

// Khởi tạo với giá trị null
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Chỉ kiểm tra MONGODB_URI trong môi trường runtime, không phải lúc build
if (typeof window === 'undefined' && !MONGODB_URI && process.env.NODE_ENV !== 'development') {
  console.error('Cảnh báo: Biến môi trường MONGODB_URI chưa được định nghĩa');
}

// Kết nối client
const clientPromise = (async () => {
  // Trong quá trình build, trả về promise giả
  if (!MONGODB_URI) {
    // Trả về client giả để tránh lỗi khi build
    // @ts-ignore - Bỏ qua kiểm tra type để tránh lỗi
    return {} as MongoClient;
  }

  // Nếu đã có kết nối cached, sử dụng lại
  if (cachedClient) {
    return cachedClient;
  }

  // Tạo kết nối mới
  const client = await MongoClient.connect(MONGODB_URI);
  
  // Cache kết nối
  cachedClient = client;
  
  return client;
})();

export async function connectToDatabase() {
  // Nếu đã có kết nối cached, sử dụng lại
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Trong quá trình build, trả về đối tượng giả
  if (!MONGODB_URI) {
    // @ts-ignore - Bỏ qua kiểm tra type để tránh lỗi
    return { client: {}, db: {} };
  }

  // Tạo kết nối mới
  const client = await clientPromise;
  const db = client.db(MONGODB_DB);

  // Cache kết nối
  cachedDb = db;

  return { client, db };
}

export default clientPromise; 