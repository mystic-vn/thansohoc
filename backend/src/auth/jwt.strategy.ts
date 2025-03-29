import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('User') private userModel: Model<any>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // Nên sử dụng biến môi trường trong thực tế
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findById(payload.sub).exec();
    
    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Người dùng không tồn tại hoặc đã bị xóa');
    }
    
    // Không trả về mật khẩu
    const { password, ...result } = user.toObject();
    
    return result;
  }
} 