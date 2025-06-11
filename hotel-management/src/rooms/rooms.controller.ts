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
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dtos/create_room.dto';
import { UpdateRoomDto } from './dtos/update_room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt.guard';
import { PermissionGuard } from '../auth/guards/permission/permission.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/permissions.enum';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.CREATE_ROOM)
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.READ_ALL_ROOMS)
  findAll() {
    return this.roomsService.findAll();
  }

  @Get('available')
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.READ_ROOM)
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
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.READ_ROOM)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.UPDATE_ROOM)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Patch(':id/clean')
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.CLEAN_ROOM)
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
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.DELETE_ROOM)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }
}
