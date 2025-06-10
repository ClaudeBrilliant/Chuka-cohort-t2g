import { UserRole } from 'generated/prisma';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  check_in_date?: Date;
  check_out_date?: Date;
  room_number?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
