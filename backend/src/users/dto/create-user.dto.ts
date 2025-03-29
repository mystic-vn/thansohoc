export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate?: string;
  role?: 'Admin' | 'User' = 'User';
} 