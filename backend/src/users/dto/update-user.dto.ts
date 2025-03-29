export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  birthDate?: string;
  role?: 'Admin' | 'User';
  status?: 'Active' | 'Inactive';
  isDeleted?: boolean;
} 