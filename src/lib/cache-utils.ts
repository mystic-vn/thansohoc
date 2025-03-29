import redisClient from './redis';

/**
 * Tạo key cache từ các tham số của API
 * @param prefix Tiền tố cho key cache
 * @param params Các tham số cần đưa vào key
 * @returns Key cache đã được tạo
 */
export function createCacheKey(prefix: string, params: Record<string, any>): string {
  // Loại bỏ các giá trị null/undefined và sắp xếp theo key
  const sortedParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');

  return `${prefix}:${sortedParams}`;
}

/**
 * Tạo một wrapper cho API route để thêm cache
 * @param fetchData Hàm lấy dữ liệu từ database
 * @param cacheKeyPrefix Tiền tố cho key cache
 * @param ttl Thời gian cache hết hạn (giây)
 * @returns Dữ liệu từ cache hoặc từ fetchData nếu cache miss
 */
export async function withCache<T>(
  fetchData: () => Promise<T>,
  cacheKeyPrefix: string,
  params: Record<string, any>,
  ttl: number = 3600
): Promise<T> {
  try {
    // Tạo key cache từ prefix và params
    const cacheKey = createCacheKey(cacheKeyPrefix, params);
    
    // Thử lấy dữ liệu từ cache
    const cachedData = await redisClient.get<T>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit cho ${cacheKey}`);
      return cachedData;
    }
    
    // Nếu không có trong cache, lấy từ database
    console.log(`Cache miss cho ${cacheKey}, đang lấy dữ liệu mới...`);
    const data = await fetchData();
    
    // Lưu kết quả vào cache
    await redisClient.set(cacheKey, data, ttl);
    console.log(`Đã lưu dữ liệu vào cache: ${cacheKey}, thời gian hết hạn: ${ttl}s`);
    
    return data;
  } catch (error) {
    console.error('Lỗi khi thực hiện cache:', error);
    // Nếu có lỗi, vẫn trả về dữ liệu từ nguồn gốc
    return await fetchData();
  }
}

/**
 * Xóa cache theo tiền tố
 * @param prefix Tiền tố của các key cần xóa
 */
export async function invalidateCache(prefix: string): Promise<void> {
  try {
    const result = await redisClient.deleteByPrefix(prefix);
    if (result) {
      console.log(`Đã xóa cache với tiền tố: ${prefix}`);
    }
  } catch (error) {
    console.error(`Lỗi khi xóa cache với tiền tố ${prefix}:`, error);
  }
}

/**
 * Tạo một middleware wrapper cho các API handlers để thêm cache
 * @param handler Handler gốc
 * @param options Tùy chọn cache
 * @returns Handler đã được bọc với logic cache
 */
export function withCacheHandler<Req, Res>(
  handler: (req: Req) => Promise<Res>,
  options: {
    getCacheKey: (req: Req) => string;
    ttl?: number;
    shouldCache?: (req: Req) => boolean;
  }
) {
  const { getCacheKey, ttl = 3600, shouldCache = () => true } = options;
  
  return async (req: Req): Promise<Res> => {
    // Nếu không nên cache, trả về kết quả ngay
    if (!shouldCache(req)) {
      return handler(req);
    }
    
    const cacheKey = getCacheKey(req);
    
    try {
      // Thử lấy từ cache
      const cachedData = await redisClient.get<Res>(cacheKey);
      if (cachedData) {
        console.log(`Cache hit cho ${cacheKey}`);
        return cachedData;
      }
      
      // Không có trong cache, gọi handler
      console.log(`Cache miss cho ${cacheKey}, đang xử lý request...`);
      const result = await handler(req);
      
      // Lưu kết quả vào cache
      await redisClient.set(cacheKey, result, ttl);
      console.log(`Đã lưu kết quả vào cache: ${cacheKey}, thời gian hết hạn: ${ttl}s`);
      
      return result;
    } catch (error) {
      console.error(`Lỗi khi thực hiện cache cho ${cacheKey}:`, error);
      // Nếu có lỗi, vẫn trả về kết quả từ handler
      return handler(req);
    }
  };
}

export default {
  createCacheKey,
  withCache,
  invalidateCache,
  withCacheHandler
}; 