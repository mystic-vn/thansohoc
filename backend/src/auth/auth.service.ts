import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<any>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email, isDeleted: false }).exec();
    
    if (!user) {
      return null;
    }
    
    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    // Không trả về mật khẩu
    const { password: _, ...result } = user.toObject();
    return result;
  }

  async login(user: any) {
    const payload = { 
      sub: user._id, 
      email: user.email,
      role: user.role
    };
    
    return {
      ...user,
      token: this.jwtService.sign(payload),
    };
  }
} 