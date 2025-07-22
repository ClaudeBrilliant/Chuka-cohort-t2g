import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomTypeModule } from './room_type/room_type.module';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryService } from './shared/utils/cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import { MailerService } from './shared/utils/mailer/mailer.service';

@Module({
  imports: [
    UsersModule,
    RoomsModule,
    RoomTypeModule,
    BookingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService, ConfigService, MailerService],
})
export class AppModule {}
