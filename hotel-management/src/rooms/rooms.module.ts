import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { JwtService } from 'src/shared/utils/jwt.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { DatabaseService } from 'src/database/connection.service';
import { PermissionService } from 'src/auth/services/permission.service';

@Module({
  providers: [
    RoomsService,
    JwtService,
    ConfigService,
    UsersService,
    DatabaseService,
    PermissionService,
  ],
  controllers: [RoomsController],
})
export class RoomsModule {}
