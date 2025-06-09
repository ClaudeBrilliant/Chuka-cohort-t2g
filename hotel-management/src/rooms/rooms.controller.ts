import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dtos/create_room.dto';
import { UpdateRoomDto } from './dtos/update_room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get('available')
  findAvailableRooms(
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return this.roomsService.findAvailableRooms(checkInDate, checkOutDate);
  }

  @Get('floor/:floor')
  findByFloor(@Param('floor', ParseIntPipe) floor: number) {
    return this.roomsService.findByFloor(floor);
  }

  @Get('type/:roomTypeId')
  findByRoomType(@Param('roomTypeId', ParseIntPipe) roomTypeId: number) {
    return this.roomsService.findByRoomType(roomTypeId);
  }

  @Get('need-cleaning')
  findRoomsNeedingCleaning() {
    return this.roomsService.findRoomsNeedingCleaning();
  }

  @Get('room-number/:roomNumber')
  findByRoomNumber(@Param('roomNumber') roomNumber: string) {
    return this.roomsService.findByRoomNumber(roomNumber);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Patch(':id/clean')
  markAsCleaned(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.markAsCleaned(id);
  }

  @Patch(':id/availability')
  setAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.roomsService.setAvailability(id, isAvailable);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }
}
