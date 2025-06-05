import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiResponse } from 'src/shared/interfaces/api-response/api-response.interface';
import { User } from './interfaces/user.interface';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateUserDto): Promise<ApiResponse<User>> {
    try {
      const user = await this.usersService.create(data);
      return {
        sucess: true,
        message: 'Guest registered successfully',
        data: user,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Failed to register guest',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get()
  async findAll(
    @Query('active') active?: string,
  ): Promise<ApiResponse<User[]>> {
    try {
      let users: User[];

      if (active === 'true') {
        users = await this.usersService.findActive();
      } else {
        users = await this.usersService.findAll();
      }

      return {
        sucess: true,
        message: `Retrieved ${users.length} guests`,
        data: users,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Failed to retrieve guests',
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<User>> {
    try {
      const user = await this.usersService.findOne(id);
      return {
        sucess: true,
        message: 'Guest found',
        data: user,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Guest not found',
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.usersService.findByEmail(email);
      return {
        sucess: true,
        message: 'Guest by email found',
        data: user,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Guest with email not found',
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ): Promise<ApiResponse<User>> {
    try {
      const user = await this.usersService.update(id, data);
      return {
        sucess: true,
        message: 'Guest info updated successfully',
        data: user,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Failed to update guest info',
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    try {
      const result = await this.usersService.remove(id);
      return {
        sucess: true,
        message: result.message,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Failed to checkout guest',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Delete(':id/permanent')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    try {
      const result = await this.usersService.delete(id);
      return {
        sucess: true,
        message: result.message,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Failed to hard delete user',
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }
}
