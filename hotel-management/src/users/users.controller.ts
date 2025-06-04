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

  /**
   * Register a new hotel guest
   * POST /users
   * Body { "name", "email", phone}
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateUserDto): ApiResponse<User> {
    try {
      const user = this.usersService.create(data);
      return {
        sucess: true,
        message: 'Guest registered succesfully',
        data: user,
      };
    } catch (error) {
      return {
        sucess: false,
        message: ' Failed to register guest',
        error: error instanceof Error ? error.message : ' Unknown error',
      };
    }
  }

  /**
   * Get all hotel guests
   * GET /users?active=true
   */
  @Get()
  findAll(@Query('active') active?: string): ApiResponse<User[]> {
    try {
      let users: User[];

      if (active === ' active') {
        users = this.usersService.findActive();
      } else {
        users = this.usersService.findAll();
      }

      return {
        sucess: true,
        message: `Retrived ${users.length} guests`,
        data: users,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Failed to retreive guests',
        error: error instanceof Error ? error.message : ' Unknown Error',
      };
    }
  }

  /**
   * Get user by id
   * GET /users/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): ApiResponse<User> {
    try {
      const user = this.usersService.findOne(id);
      return {
        sucess: true,
        message: ' Guest found',
        data: user,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Guest Not found',
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }

  /**
   * Find guest by email
   * GET /users/email/:email
   */
  @Get('email/:email')
  findByEmail(@Param('email') email: string): ApiResponse<User> {
    try {
      const user = this.usersService.findByEmail(email);
      return {
        sucess: true,
        message: 'Guest By email found',
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

  /**
   * Update guest profile
   * PATCH users/:id
   */
  @Patch(':id/:post')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ): ApiResponse<User> {
    try {
      const user = this.usersService.update(id, data);
      return {
        sucess: true,
        message: 'Guest info updated succesfully',
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

  /**
   * Checkout a user (soft delete)
   * DELETE /user/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): ApiResponse<null> {
    try {
      const result = this.usersService.remove(id);
      return {
        sucess: true,
        message: result.message,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Failed to checkout guest',
        error: error instanceof Error ? error.message : ' Unknown error',
      };
    }
  }

  /**
   * Permanently delete a guests (hard delete)
   * DELETE /users/:id/permanent
   */
  @Delete(':id/permanent')
  delete(@Param('id', ParseIntPipe) id: number): ApiResponse<null> {
    try {
      const result = this.usersService.delete(id);

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
