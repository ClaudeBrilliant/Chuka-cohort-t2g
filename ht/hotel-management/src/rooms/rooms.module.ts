import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { JwtService } from 'src/shared/utils/jwt.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
// import { DatabaseService } from 'src/database/connection.service';
import { PermissionService } from 'src/auth/services/permission.service';
import { CloudinaryService } from 'src/shared/utils/cloudinary/cloudinary.service';

@Module({
  providers: [
    RoomsService,
    JwtService,
    ConfigService,
    UsersService,
    PermissionService,
    CloudinaryService,
  ],
  controllers: [RoomsController],
})
export class RoomsModule {}
