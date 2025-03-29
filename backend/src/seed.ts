import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcrypt';

async function seed() {
  const uri = 'mongodb://root:Thien1997@84.247.170.61:27017/mystic_thansohoc?authSource=admin';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Đã kết nối tới MongoDB');
    
    const database = client.db('mystic_thansohoc');
    const users = database.collection('users');
    
    // Kiểm tra xem admin đã tồn tại chưa
    const adminExists = await users.findOne({ email: 'admin@thansohoc.com' });
    
    if (adminExists) {
      console.log('Tài khoản admin đã tồn tại, bỏ qua việc tạo mới');
      return;
    }
    
    // Tạo mật khẩu hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);
    
    // Tạo tài khoản admin
    const result = await users.insertOne({
      firstName: 'Admin',
      lastName: 'System',
      email: 'admin@thansohoc.com',
      password: hashedPassword,
      role: 'Admin',
      isEmailVerified: true,
      isDeleted: false,
      birthDate: new Date('1990-01-01'),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Đã tạo tài khoản admin:', result.insertedId);
  } catch (error) {
    console.error('Lỗi khi seeding data:', error);
  } finally {
    await client.close();
    console.log('Đã đóng kết nối MongoDB');
  }
}

// Chạy hàm seed
seed(); 