import { UserRole } from 'generated/prisma';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  check_in_date?: Date;
  check_out_date?: Date;
  room_number?: number;
  profileImage?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  check_in_date?: Date;
  check_out_date?: Date;
  room_number?: number;
  profileImage?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
