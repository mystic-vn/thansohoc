import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, Types } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto, ResendOtpDto } from './dto/verify-email.dto';
import * as bcrypt from 'bcrypt';

// Định nghĩa kiểu cho document Mongoose
interface UserDocument extends Omit<Document, 'id'>, User {
  _id: Types.ObjectId;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  // Lấy danh sách người dùng
  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().select('-password -otpCode -otpExpires').exec();
    return users.map(user => {
      const userObj = user.toObject();
      const { _id, ...userData } = userObj;
      
      // Định dạng ngày tạo đơn giản hơn
      let created = '';
      try {
        if (userObj.createdAt) {
          created = new Date(userObj.createdAt).toLocaleDateString('vi-VN');
        } else if (userObj.created) {
          created = typeof userObj.created === 'string' ? userObj.created : '';
        }
      } catch (error) {
        console.error('Lỗi định dạng ngày:', error);
      }
      
      return {
        ...userData,
        id: _id.toString(),
        created,
        name: `${userObj.firstName} ${userObj.lastName}`
      };
    });
  }

  // Tạo người dùng mới
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Kiểm tra nếu email đã tồn tại
    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Tạo OTP
    const otp = this.generateOTP();
    const otpExpiresDate = new Date();
    otpExpiresDate.setMinutes(otpExpiresDate.getMinutes() + 15); // OTP hết hạn sau 15 phút
    
    // Tạo người dùng mới
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      otpCode: otp,
      otpExpires: otpExpiresDate,
      isEmailVerified: false
    });
    
    // Lưu vào database
    const savedUser = await newUser.save();
    
    // Gửi email OTP thực tế
    await this.sendOtpEmail(createUserDto.email, otp, createUserDto.firstName);
    
    // Trả về thông tin người dùng (không bao gồm mật khẩu)
    const userObj = savedUser.toObject();
    const { _id, password, otpCode, otpExpires, ...result } = userObj;
    
    // Định dạng ngày tạo đơn giản hơn
    let created = '';
    try {
      if (userObj.createdAt) {
        created = new Date(userObj.createdAt).toLocaleDateString('vi-VN');
      } else if (userObj.created) {
        created = typeof userObj.created === 'string' ? userObj.created : '';
      }
    } catch (error) {
      console.error('Lỗi định dạng ngày:', error);
    }
    
    return {
      ...result,
      id: _id.toString(),
      created,
      name: `${userObj.firstName} ${userObj.lastName}`
    };
  }

  // Cập nhật thông tin người dùng
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Kiểm tra nếu người dùng tồn tại
    const user = await this.userModel.findById(id).exec();
    if (!user || user.isDeleted) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
    }
    
    // Cập nhật thông tin
    const updateData: any = { ...updateUserDto };
    
    // Nếu có mật khẩu mới, mã hóa mật khẩu
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    // Cập nhật vào database
    await this.userModel.updateOne({ _id: id }, updateData).exec();
    
    // Lấy người dùng đã cập nhật
    const updatedUser = await this.userModel.findById(id).select('-password -otpCode -otpExpires').exec();
    
    if (!updatedUser) {
      throw new NotFoundException(`Không tìm thấy người dùng sau khi cập nhật. ID: ${id}`);
    }
    
    // Trả về thông tin người dùng đã cập nhật
    const userObj = updatedUser.toObject();
    const { _id, ...userData } = userObj;
    
    // Xử lý ngày tháng an toàn
    let created = '';
    try {
      if (userObj.createdAt) {
        created = new Date(userObj.createdAt).toLocaleDateString('vi-VN');
      } else if (userObj.created && typeof userObj.created === 'string') {
        created = userObj.created;
      }
    } catch (error) {
      console.error('Lỗi định dạng ngày:', error);
    }
    
    return {
      ...userData,
      id: _id.toString(),
      created,
      name: `${userObj.firstName} ${userObj.lastName}`
    };
  }

  // Xóa mềm người dùng
  async softDelete(id: string): Promise<void> {
    const user = await this.userModel.findById(id).exec();
    if (!user || user.isDeleted) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
    }
    
    await this.userModel.updateOne(
      { _id: id },
      { 
        isDeleted: true,
        deletedAt: new Date()
      }
    ).exec();
  }

  // Xóa vĩnh viễn người dùng
  async remove(id: string): Promise<void> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
    }
    
    await this.userModel.deleteOne({ _id: id }).exec();
  }

  // Khôi phục người dùng đã xóa mềm
  async restore(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
    }
    
    if (!user.isDeleted) {
      throw new BadRequestException('Người dùng chưa bị xóa');
    }
    
    await this.userModel.updateOne(
      { _id: id },
      { 
        isDeleted: false,
        deletedAt: null
      }
    ).exec();
    
    // Lấy người dùng đã khôi phục
    const restoredUser = await this.userModel.findById(id).select('-password -otpCode -otpExpires').exec();
    
    if (!restoredUser) {
      throw new NotFoundException(`Không tìm thấy người dùng sau khi khôi phục. ID: ${id}`);
    }
    
    // Trả về thông tin người dùng đã khôi phục
    const userObj = restoredUser.toObject();
    const { _id, ...userData } = userObj;
    
    // Xử lý ngày tháng an toàn
    let created = '';
    try {
      if (userObj.createdAt) {
        created = new Date(userObj.createdAt).toLocaleDateString('vi-VN');
      } else if (userObj.created && typeof userObj.created === 'string') {
        created = userObj.created;
      }
    } catch (error) {
      console.error('Lỗi định dạng ngày:', error);
    }
    
    return {
      ...userData,
      id: _id.toString(),
      created,
      name: `${userObj.firstName} ${userObj.lastName}`
    };
  }

  // Lấy người dùng theo ID
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password -otpCode -otpExpires').exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    const userObj = user.toObject();
    const { _id, ...userData } = userObj;
    
    // Định dạng ngày tạo đơn giản hơn
    let created = '';
    try {
      if (userObj.createdAt) {
        created = new Date(userObj.createdAt).toLocaleDateString('vi-VN');
      } else if (userObj.created) {
        created = typeof userObj.created === 'string' ? userObj.created : '';
      }
    } catch (error) {
      console.error('Lỗi định dạng ngày:', error);
    }
    
    return {
      ...userData,
      id: _id.toString(),
      created,
      name: `${userObj.firstName} ${userObj.lastName}`
    };
  }

  // Xác minh email bằng OTP
  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<User> {
    const { email, otp } = verifyEmailDto;
    
    // Tìm người dùng theo email
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng với email này');
    }
    
    // Kiểm tra xem email đã được xác minh chưa
    if (user.isEmailVerified) {
      throw new BadRequestException('Email đã được xác minh trước đó');
    }
    
    const userObj = user.toObject();
    
    // Kiểm tra mã OTP
    if (userObj.otpCode !== otp) {
      throw new BadRequestException('Mã OTP không đúng');
    }
    
    // Kiểm tra thời hạn của OTP
    if (userObj.otpExpires && new Date() > new Date(userObj.otpExpires)) {
      throw new BadRequestException('Mã OTP đã hết hạn');
    }
    
    // Cập nhật trạng thái xác minh email
    await this.userModel.updateOne(
      { email },
      { 
        isEmailVerified: true,
        otpCode: null,
        otpExpires: null
      }
    ).exec();
    
    // Lấy người dùng đã cập nhật
    const verifiedUser = await this.userModel.findOne({ email }).select('-password -otpCode -otpExpires').exec();
    
    if (!verifiedUser) {
      throw new NotFoundException(`Không tìm thấy người dùng sau khi xác minh. Email: ${email}`);
    }
    
    // Trả về thông tin người dùng đã xác minh
    const verifiedObj = verifiedUser.toObject();
    const { _id, ...userData } = verifiedObj;
    
    // Xử lý ngày tháng an toàn
    let created = '';
    try {
      if (verifiedObj.createdAt) {
        created = new Date(verifiedObj.createdAt).toLocaleDateString('vi-VN');
      } else if (verifiedObj.created && typeof verifiedObj.created === 'string') {
        created = verifiedObj.created;
      }
    } catch (error) {
      console.error('Lỗi định dạng ngày:', error);
    }
    
    return {
      ...userData,
      id: _id.toString(),
      created,
      name: `${verifiedObj.firstName} ${verifiedObj.lastName}`
    };
  }

  // Gửi lại mã OTP
  async resendOtp(resendOtpDto: ResendOtpDto): Promise<void> {
    const { email } = resendOtpDto;
    
    // Tìm người dùng theo email
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng với email này');
    }
    
    // Kiểm tra xem email đã được xác minh chưa
    if (user.isEmailVerified) {
      throw new BadRequestException('Email đã được xác minh trước đó');
    }
    
    // Tạo OTP mới
    const otp = this.generateOTP();
    const otpExpiresDate = new Date();
    otpExpiresDate.setMinutes(otpExpiresDate.getMinutes() + 15); // OTP hết hạn sau 15 phút
    
    // Cập nhật OTP mới
    await this.userModel.updateOne(
      { email },
      { 
        otpCode: otp,
        otpExpires: otpExpiresDate
      }
    ).exec();
    
    // Gửi email OTP thực tế
    await this.sendOtpEmail(email, otp, user.firstName);
  }

  // Gửi email OTP
  private async sendOtpEmail(email: string, otp: string, firstName: string): Promise<void> {
    const appName = this.configService.get<string>('APP_NAME') || 'Thần Số Học';
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Mã xác thực tài khoản ${appName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">Xác minh tài khoản của bạn</h2>
            <p>Xin chào ${firstName},</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại ${appName}. Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã OTP dưới đây để xác minh tài khoản:</p>
            <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">${otp}</div>
            <p>Mã OTP này sẽ hết hạn sau 15 phút. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
            <p style="margin-top: 30px;">Trân trọng,</p>
            <p>Đội ngũ ${appName}</p>
          </div>
        `,
      });
      console.log(`Đã gửi OTP đến email: ${email}`);
    } catch (error) {
      console.error('Lỗi khi gửi email OTP:', error);
      // Vẫn lưu lại OTP trong console để phát triển/kiểm thử
      console.log(`OTP for ${email}: ${otp}`);
    }
  }

  // Tạo OTP ngẫu nhiên
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
