export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';
  created?: string;
  birthDate?: string;
  isDeleted: boolean;
  isEmailVerified: boolean;
  emailVerifyOtp?: string;
  emailVerifyOtpExpires?: Date;
  password?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  otpCode?: string;
  otpExpires?: Date;
} 