import { Module } from '@nestjs/common';
import { RoomTypeService } from './room_type.service';
import { RoomTypeController } from './room_type.controller';

@Module({
  providers: [RoomTypeService],
  controllers: [RoomTypeController]
})
export class RoomTypeModule {}
