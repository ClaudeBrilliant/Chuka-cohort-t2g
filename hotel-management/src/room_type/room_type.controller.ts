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
  ParseFloatPipe,
  UseGuards,
} from '@nestjs/common';
import { RoomTypeService } from './room_type.service';
import { CreateRoomTypeDto } from './dtos/create-room-type.dto';
import { UpdateRoomTypeDto } from './dtos/update-room-type.dto';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt.guard';
import { PermissionGuard } from '../auth/guards/permission/permission.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/permissions.enum';

@Controller('room-type')
@UseGuards(JwtAuthGuard)
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.CREATE_ROOM_TYPE)
  create(@Body() createRoomTypeDto: CreateRoomTypeDto) {
    return this.roomTypeService.create(createRoomTypeDto);
  }

  @Get()
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.READ_ALL_ROOM_TYPES)
  findAll() {
    return this.roomTypeService.findAll();
  }

  @Get('availability')
  findWithAvailability() {
    return this.roomTypeService.findWithAvailability();
  }

  @Get('price-range')
  findByPriceRange(
    @Query('minPrice', ParseFloatPipe) minPrice: number,
    @Query('maxPrice', ParseFloatPipe) maxPrice: number,
  ) {
    return this.roomTypeService.findByPriceRange(minPrice, maxPrice);
  }

  @Get('capacity/:minCapacity')
  findByCapacity(@Param('minCapacity', ParseIntPipe) minCapacity: number) {
    return this.roomTypeService.findByCapacity(minCapacity);
  }

  @Get('name/:name')
  findByName(@Param('name') name: string) {
    return this.roomTypeService.findByName(name);
  }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.READ_ROOM_TYPE)
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.roomTypeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.UPDATE_ROOM_TYPE)
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateRoomTypeDto: UpdateRoomTypeDto,
  ) {
    return this.roomTypeService.update(id, updateRoomTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.DELETE_ROOM_TYPE)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.roomTypeService.remove(id);
  }
}
