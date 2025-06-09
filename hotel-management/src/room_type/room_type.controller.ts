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
} from '@nestjs/common';
import { RoomTypeService } from './room_type.service';
import { CreateRoomTypeDto } from './dtos/create-room-type.dto';
import { UpdateRoomTypeDto } from './dtos/update-room-type.dto';

@Controller('room-type')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRoomTypeDto: CreateRoomTypeDto) {
    return this.roomTypeService.create(createRoomTypeDto);
  }

  @Get()
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomTypeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomTypeDto: UpdateRoomTypeDto,
  ) {
    return this.roomTypeService.update(id, updateRoomTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomTypeService.remove(id);
  }
}
