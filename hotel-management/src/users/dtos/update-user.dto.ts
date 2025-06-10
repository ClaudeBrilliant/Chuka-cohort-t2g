/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  IsBoolean,
  IsEnum,
  MinLength,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from 'generated/prisma';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @IsPhoneNumber(undefined, { message: 'Please provide a valid phone number' })
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: `Role must be one of: ${Object.values(UserRole).join(', ')}`,
  })
  role?: UserRole;

  @IsOptional()
  @IsDateString({}, { message: 'Check-in date must be a valid date' })
  checkInDate?: Date;

  @IsOptional()
  @IsDateString({}, { message: 'Check-out date must be a valid date' })
  checkOutDate?: Date;

  @IsOptional()
  @IsInt({ message: 'Room number must be an integer' })
  roomNumber?: number;

  @IsOptional()
  @IsBoolean({ message: 'Active status must be a boolean' })
  isActive?: boolean;
}
