import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('User') private userModel: Model<any>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findById(payload.sub).exec();
    
    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Người dùng không tồn tại hoặc đã bị xóa');
    }
    
    // Thêm log để debug
    console.log('🔑 JWT validate user:', {
      id: user._id,
      email: user.email,
      role: user.role
    });
    
    // Không trả về mật khẩu
    const { password, ...result } = user.toObject();
    
    return result;
  }
} 