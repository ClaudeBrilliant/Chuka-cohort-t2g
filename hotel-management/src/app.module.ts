import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomTypeModule } from './room_type/room_type.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [UsersModule, RoomsModule, RoomTypeModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
