/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateUserDto): Promise<User> {
    try {
      const result = await this.databaseService.query(
        `SELECT * FROM sp_create_user($1, $2, $3, $4, $5, $6)`,
        [
          data.name,
          data.email,
          data.phone || null,
          data.checkInDate || null,
          data.checkOutDate || null,
          data.roomNumber || null,
        ],
      );

      if (result.rows.length === 0) {
        throw new InternalServerErrorException('Failed to create user');
      }

      return this.mapRowToUser(result.rows[0]);
    } catch (error: any) {
      if (error instanceof Error && error.message.includes('already exists')) {
        throw new ConflictException(error.message);
      }
      if (
        error instanceof Error &&
        error.message.includes('Check out date must be after check in date')
      ) {
        throw new ConflictException(
          'Check out date must be after check in date',
        );
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_all_users()',
      );
      return result.rows.map((row: any) => this.mapRowToUser(row));
    } catch {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findActive(): Promise<User[]> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_active_users()',
      );
      return result.rows.map((row: any) => this.mapRowToUser(row));
    } catch {
      throw new InternalServerErrorException('Failed to retrieve active users');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_user_by_id($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Guest with id ${id} not found`);
      }

      return this.mapRowToUser(result.rows[0]);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Guest with id ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_user_by_email($1)',
        [email],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Guest with email ${email} not found`);
      }

      return this.mapRowToUser(result.rows[0]);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Guest with email ${email} not found`);
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    try {
      const result = await this.databaseService.query(
        `SELECT * FROM sp_update_user($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          id,
          data.name || null,
          data.email || null,
          data.phone || null,
          data.checkInDate || null,
          data.checkOutDate || null,
          data.roomNumber || null,
          data.isActive !== undefined ? data.isActive : null,
        ],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Guest with id ${id} not found`);
      }

      return this.mapRowToUser(result.rows[0]);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Guest with id ${id} not found`);
      }
      if (
        error instanceof Error &&
        error.message.includes('Another guest with this email exists')
      ) {
        throw new ConflictException('Another guest with this email exists');
      }
      if (
        error instanceof Error &&
        error.message.includes('Check out date must be after check in date')
      ) {
        throw new ConflictException(
          'Check out date must be after check in date',
        );
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_soft_delete_user($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Guest with id ${id} not found`);
      }

      return { message: result.rows[0].message };
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Guest with id ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to checkout guest');
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_hard_delete_user($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Guest with ID ${id} not found`);
      }

      return { message: result.rows[0].message };
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Guest with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

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
}
