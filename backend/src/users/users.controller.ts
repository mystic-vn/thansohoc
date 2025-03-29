import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto, ResendOtpDto } from './dto/verify-email.dto';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('withDeleted') withDeleted?: string,
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id') id: string): Promise<void> {
    return this.usersService.softDelete(id);
  }

  @Delete(':id/permanent')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string): Promise<User> {
    return this.usersService.restore(id);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<User> {
    return this.usersService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendOtp(@Body() resendOtpDto: ResendOtpDto): Promise<void> {
    return this.usersService.resendOtp(resendOtpDto);
  }
}
