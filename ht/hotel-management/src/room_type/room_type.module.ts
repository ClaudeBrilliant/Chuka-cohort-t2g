import { Module } from '@nestjs/common';
import { RoomTypeService } from './room_type.service';
import { RoomTypeController } from './room_type.controller';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/shared/utils/jwt.service';
import { UsersService } from 'src/users/users.service';
import { PermissionService } from 'src/auth/services/permission.service';
import { DatabaseService } from 'src/database/connection.service';
import { CloudinaryService } from 'src/shared/utils/cloudinary/cloudinary.service';

@Module({
  providers: [
    RoomTypeService,
    JwtService,
    ConfigService,
    UsersService,
    PermissionService,
    DatabaseService,
    CloudinaryService,
  ],
  controllers: [RoomTypeController],
})
export class RoomTypeModule {}
