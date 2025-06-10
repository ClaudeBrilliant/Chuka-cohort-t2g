import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtService } from '../shared/utils/jwt.service';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { RolesGuard } from './roles/roles.guard';
import { OptionalAuthGuard } from './optional-auth/optional-auth.guard';

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [
    AuthService,
    JwtService,
    JwtAuthGuard,
    RolesGuard,
    OptionalAuthGuard,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtService,
    JwtAuthGuard,
    RolesGuard,
    OptionalAuthGuard,
  ],
})
export class AuthModule {}
