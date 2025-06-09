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

      const user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          checkInDate: data.checkInDate,
          checkOutDate: data.checkOutDate,
          roomNumber: data.roomNumber,
          isActive: true,
        },
      });

      console.log(`Created new guest ${user.name} (ID: ${user.id})`);
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

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`Guest with id ${id} not found`);
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
        throw new NotFoundException(`Guest with email ${email} not found`);
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
        throw new NotFoundException(`Guest with id ${id} not found`);
      }

      // Check for email conflicts if email is being updated
      if (data.email && data.email !== existingUser.email) {
        const emailConflict = await this.prisma.user.findUnique({
          where: { email: data.email },
        });

        if (emailConflict) {
          throw new ConflictException('Another guest with this email exists');
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

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.email && { email: data.email }),
          ...(data.phone !== undefined && { phone: data.phone }),
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

  async remove(id: number): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id, isActive: true },
      });

      if (!user) {
        throw new NotFoundException(`Guest with id ${id} not found`);
      }

      await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      });

      return { message: `Guest ${user.name} has checked out successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to checkout guest');
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`Guest with ID ${id} not found`);
      }

      await this.prisma.user.delete({
        where: { id },
      });

      return { message: `Guest ${user.name} has been permanently deleted` };
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
      check_in_date: user.checkInDate,
      check_out_date: user.checkOutDate,
      room_number: user.roomNumber,
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
