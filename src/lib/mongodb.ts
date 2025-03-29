import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'thansohoc_db';

// Khởi tạo với giá trị null
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

if (!MONGODB_URI) {
  throw new Error('Vui lòng định nghĩa biến môi trường MONGODB_URI');
}

// Kết nối client
const clientPromise = (async () => {
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

  // Tạo kết nối mới
  const client = await clientPromise;
  const db = client.db(MONGODB_DB);

  // Cache kết nối
  cachedDb = db;

  return { client, db };
}

export default clientPromise; 