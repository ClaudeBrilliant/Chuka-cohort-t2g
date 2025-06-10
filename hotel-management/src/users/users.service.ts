/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { DatabaseService } from '../database/connection.service';
import { getPrismaClient } from 'src/prisma/prisma.service';
import { UserRole } from 'generated/prisma';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  private prisma = getPrismaClient();

  async create(data: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictException(
          `User with email ${data.email} already exists`,
        );
      }

      // Hash password if provided

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      const user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: data.role || UserRole.GUEST,
          isActive: true,
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.checkInDate !== undefined && {
            checkInDate: data.checkInDate,
          }),
          ...(data.checkOutDate !== undefined && {
            checkOutDate: data.checkOutDate,
          }),
          ...(data.roomNumber !== undefined && { roomNumber: data.roomNumber }),
        },
      });

      console.log(`Created new user ${user.name} (ID: ${user.id})`);
      return this.mapPrismaUserToInterface(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create user: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: { id: 'asc' },
      });
      return users.map((user) => this.mapPrismaUserToInterface(user));
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users', error);
    }
  }

  async findActive(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany({
        where: { isActive: true },
        orderBy: { id: 'asc' },
      });
      return users.map((user) => this.mapPrismaUserToInterface(user));
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve active users',
        error,
      );
    }
  }

  async findByRole(role: UserRole): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany({
        where: { role, isActive: true },
        orderBy: { id: 'asc' },
      });
      return users.map((user) => this.mapPrismaUserToInterface(user));
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve users with role ${role}`,
        error,
      );
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return this.mapPrismaUserToInterface(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return this.mapPrismaUserToInterface(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      // Check for email conflicts if email is being updated
      if (data.email && data.email !== existingUser.email) {
        const emailConflict = await this.prisma.user.findUnique({
          where: { email: data.email },
        });

        if (emailConflict) {
          throw new ConflictException('Another user with this email exists');
        }
      }

      // Validate check dates
      if (data.checkInDate && data.checkOutDate) {
        if (data.checkInDate >= data.checkOutDate) {
          throw new ConflictException(
            'Check out date must be after check in date',
          );
        }
      }

      // Hash password if provided
      let hashedPassword: string | undefined;
      if (data.password) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(data.password, saltRounds);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.email && { email: data.email }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(hashedPassword && { password: hashedPassword }),
          ...(data.role && { role: data.role }),
          ...(data.checkInDate !== undefined && {
            checkInDate: data.checkInDate,
          }),
          ...(data.checkOutDate !== undefined && {
            checkOutDate: data.checkOutDate,
          }),
          ...(data.roomNumber !== undefined && { roomNumber: data.roomNumber }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });

      return this.mapPrismaUserToInterface(updatedUser);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isCurrentPasswordValid) {
        throw new ConflictException('Current password is incorrect');
      }

      // Hash new password
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      await this.prisma.user.update({
        where: { id },
        data: { password: hashedNewPassword },
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to change password');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id, isActive: true },
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      });

      return { message: `User ${user.name} has been deactivated successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to deactivate user');
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.prisma.user.delete({
        where: { id },
      });

      return { message: `User ${user.name} has been permanently deleted` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  // Keep the existing mapRowToUser for SQL stored procedures compatibility
  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      password: row.password,
      role: row.role,
      check_in_date: row.check_in_date,
      check_out_date: row.check_out_date,
      room_number: row.room_number,
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  // New method to map Prisma User to interface
  private mapPrismaUserToInterface(user: any): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: user.role,
      check_in_date: user.checkInDate,
      check_out_date: user.checkOutDate,
      room_number: user.roomNumber,
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
