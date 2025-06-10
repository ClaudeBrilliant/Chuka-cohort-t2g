/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiResponse } from 'src/shared/interfaces/api-response/api-response.interface';
import { User } from './interfaces/user.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  CurrentUser,
  CurrentUserData,
} from '../auth/decorators/current-user.decorator';
import { UserRole } from 'generated/prisma';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async create(@Body() data: CreateUserDto): Promise<ApiResponse<User>> {
    try {
      const user = await this.usersService.create(data);
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return {
        sucess: true,
        message: 'User created successfully',
        data: userWithoutPassword as User,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Failed to create user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findAll(
    @Query('active') active?: string,
    @Query('role') role?: UserRole,
  ): Promise<ApiResponse<User[]>> {
    try {
      let users: User[];

      if (role) {
        users = await this.usersService.findByRole(role);
      } else if (active === 'true') {
        users = await this.usersService.findActive();
      } else {
        users = await this.usersService.findAll();
      }

      // Remove passwords from response
      const usersWithoutPasswords = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      });

      return {
        sucess: true,
        message: `Retrieved ${users.length} users`,
        data: usersWithoutPasswords,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Failed to retrieve users',
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }

  @Get('profile')
  async getProfile(
    @CurrentUser() user: CurrentUserData,
  ): Promise<ApiResponse<CurrentUserData>> {
    return {
      sucess: true,
      message: 'Profile retrieved successfully',
      data: user,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<User>> {
    try {
      const user = await this.usersService.findOne(id);
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return {
        sucess: true,
        message: 'User found',
        data: userWithoutPassword as User,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'User not found',
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }

  @Get('email/:email')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findByEmail(@Param('email') email: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.usersService.findByEmail(email);
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return {
        sucess: true,
        message: 'User by email found',
        data: userWithoutPassword as User,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'User with email not found',
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: CurrentUserData,
    @Body() data: UpdateUserDto,
  ): Promise<ApiResponse<User>> {
    try {
      // Users can only update their own profile (excluding role and isActive)
      const { role, isActive, ...allowedData } = data;
      const updatedUser = await this.usersService.update(user.id, allowedData);
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      return {
        sucess: true,
        message: 'Profile updated successfully',
        data: userWithoutPassword as User,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<ApiResponse<User>> {
    try {
      // Staff can't change roles or admin status
      if (currentUser.role === UserRole.STAFF) {
        const { role, ...staffAllowedData } = data;
        data = staffAllowedData;
      }

      const user = await this.usersService.update(id, data);
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return {
        sucess: true,
        message: 'User updated successfully',
        data: userWithoutPassword as User,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Failed to update user',
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }

  @Post(':id/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { currentPassword: string; newPassword: string },
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<ApiResponse<null>> {
    try {
      // Users can only change their own password unless they're admin
      if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
        return {
          sucess: false,
          message: 'You can only change your own password',
        };
      }

      const result = await this.usersService.changePassword(
        id,
        body.currentPassword,
        body.newPassword,
      );
      return {
        sucess: true,
        message: result.message,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Failed to change password',
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
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
        message: 'Failed to deactivate user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Delete(':id/permanent')
  @Roles(UserRole.ADMIN)
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
        message: 'Failed to permanently delete user',
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }
}
