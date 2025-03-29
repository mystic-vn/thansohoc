import Redis from 'ioredis';
import { promisify } from 'util';

// Cấu hình kết nối Redis
// Nếu đang chạy trên Vercel, sử dụng URL từ biến môi trường, nếu không sử dụng localhost
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Thay đổi cấu hình tùy theo môi trường production hoặc development
const connectionConfig = {
  retryStrategy: (times: number) => {
    // Không retry nếu là production (sử dụng database từ xa)
    if (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL) {
      console.warn("⚠️ Redis URL không được cấu hình trong môi trường production. Cache không hoạt động.");
      return null;
    }
    
    // Thử kết nối lại tối đa 3 lần, mỗi lần cách nhau 1 giây
    const retryDelay = Math.min(times * 1000, 3000);
    return times >= 3 ? null : retryDelay;
  }
};

// Khởi tạo Redis client
const redisClientInstance = new Redis(redisUrl, connectionConfig);

// Xử lý sự kiện kết nối
redisClientInstance.on('connect', () => {
  console.log('✅ Kết nối Redis thành công');
});

redisClientInstance.on('error', (err) => {
  console.log(`❌ Lỗi kết nối Redis: ${err.message}`);
  // Nếu không phải môi trường production, không cần cảnh báo
  if (process.env.NODE_ENV !== 'production') return;
  
  console.warn('⚠️ Redis không khả dụng, hệ thống sẽ hoạt động không có cache');
});

// Class Redis Client
class RedisClient {
  private client: Redis;
  private defaultExpiry: number;
  private redisAvailable: boolean;

  constructor(client: Redis, defaultExpiry = 3600) {
    this.client = client;
    this.defaultExpiry = defaultExpiry; // Mặc định là 1 giờ
    this.redisAvailable = true;

    this.client.on('error', () => {
      this.redisAvailable = false;
    });

    this.client.on('connect', () => {
      this.redisAvailable = true;
    });
  }

  /**
   * Lấy dữ liệu từ cache theo key
   * @param key Khóa để lấy dữ liệu
   * @returns Dữ liệu đã cache hoặc null nếu không tìm thấy
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.redisAvailable) return null;

    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ Redis:', error);
      return null;
    }
  }

  /**
   * Lưu dữ liệu vào cache
   * @param key Khóa để lưu dữ liệu
   * @param data Dữ liệu cần lưu (sẽ được chuyển đổi thành JSON)
   * @param expiry Thời gian hết hạn (giây), mặc định sử dụng thời gian đã cấu hình
   * @returns True nếu lưu thành công, false nếu có lỗi
   */
  async set(key: string, data: any, expiry = this.defaultExpiry): Promise<boolean> {
    if (!this.redisAvailable) return false;

    try {
      const stringData = JSON.stringify(data);
      if (expiry) {
        await this.client.set(key, stringData, 'EX', expiry);
      } else {
        await this.client.set(key, stringData);
      }
      return true;
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu vào Redis:', error);
      return false;
    }
  }

  /**
   * Xóa một key khỏi cache
   * @param key Khóa cần xóa
   * @returns True nếu xóa thành công, false nếu có lỗi
   */
  async delete(key: string): Promise<boolean> {
    if (!this.redisAvailable) return false;

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa key từ Redis:', error);
      return false;
    }
  }

  /**
   * Xóa tất cả các key có tiền tố chung
   * @param prefix Tiền tố của các key cần xóa
   * @returns True nếu xóa thành công, false nếu có lỗi
   */
  async deleteByPrefix(prefix: string): Promise<boolean> {
    if (!this.redisAvailable) return false;

    try {
      // Tìm tất cả các key có tiền tố
      const keys = await this.client.keys(`${prefix}*`);
      if (keys.length === 0) return true;

      // Xóa tất cả các key trong một lần gọi
      await this.client.del(...keys);
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa keys theo tiền tố từ Redis:', error);
      return false;
    }
  }

  /**
   * Kiểm tra một key có tồn tại không
   * @param key Khóa cần kiểm tra
   * @returns True nếu key tồn tại, false nếu không tồn tại hoặc có lỗi
   */
  async exists(key: string): Promise<boolean> {
    if (!this.redisAvailable) return false;

    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      console.error('Lỗi khi kiểm tra key từ Redis:', error);
      return false;
    }
  }

  /**
   * Lấy tất cả các key theo pattern
   * @param pattern Pattern để tìm kiếm keys
   * @returns Danh sách các key phù hợp hoặc mảng rỗng nếu có lỗi
   */
  async keys(pattern: string): Promise<string[]> {
    if (!this.redisAvailable) return [];

    try {
      return await this.client.keys(pattern);
    } catch (error) {
      console.error('Lỗi khi lấy keys từ Redis:', error);
      return [];
    }
  }

  /**
   * Xóa tất cả dữ liệu trong Redis
   * @returns True nếu xóa thành công, false nếu có lỗi
   */
  async flushAll(): Promise<boolean> {
    if (!this.redisAvailable) return false;

    try {
      await this.client.flushall();
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa tất cả dữ liệu từ Redis:', error);
      return false;
    }
  }

  /**
   * Lấy thời gian hết hạn còn lại của một key
   * @param key Khóa cần kiểm tra
   * @returns Thời gian hết hạn còn lại (giây), -1 nếu key không tồn tại, -2 nếu key không có thời gian hết hạn
   */
  async ttl(key: string): Promise<number> {
    if (!this.redisAvailable) return -1;

    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error('Lỗi khi lấy ttl từ Redis:', error);
      return -1;
    }
  }

  /**
   * Đặt thời gian hết hạn cho một key
   * @param key Khóa cần đặt thời gian hết hạn
   * @param expiry Thời gian hết hạn (giây)
   * @returns True nếu đặt thành công, false nếu có lỗi
   */
  async expire(key: string, expiry: number): Promise<boolean> {
    if (!this.redisAvailable) return false;

    try {
      const result = await this.client.expire(key, expiry);
      return result === 1;
    } catch (error) {
      console.error('Lỗi khi đặt thời gian hết hạn từ Redis:', error);
      return false;
    }
  }
}

// Tạo instance và export
const redisClient = new RedisClient(redisClientInstance);

export default redisClient; 