/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  IsEnum,
  MinLength,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from 'generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'doe.john@gmail.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+25412345678',
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @IsPhoneNumber(undefined, { message: 'Please provide a valid phone number' })
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @ApiProperty({
    description: 'User password',
    example: 'paSSw0rd',
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: 'User Role',
    enum: UserRole,
    example: UserRole.GUEST,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: `Role must be one of: ${Object.values(UserRole).join(', ')}`,
  })
  role?: UserRole;

  @ApiProperty({
    description: 'Check-in-date',
    example: '2025-06-18',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Check-in date must be a valid date' })
  checkInDate?: Date;

  @ApiProperty({
    description: 'Check-out date',
    example: '2025-05-20',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Check-out date must be a valid date' })
  checkOutDate?: Date;

  @ApiProperty({
    description: 'Room number',
    example: 101,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Room number must be an integer' })
  roomNumber?: number;
}
