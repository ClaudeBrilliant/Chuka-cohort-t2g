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
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { BookingStatus } from './interfaces/booking.interface';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  findAll(
    @Query('status') status?: BookingStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (status) {
      return this.bookingService.findByStatus(status);
    }

    if (startDate && endDate) {
      return this.bookingService.findByDateRange(
        new Date(startDate),
        new Date(endDate),
      );
    }

    return this.bookingService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: string) {
    return this.bookingService.findByUser(userId);
  }

  @Get('room/:roomId')
  findByRoom(@Param('roomId', ParseIntPipe) roomId: string) {
    return this.bookingService.findByRoom(roomId);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: BookingStatus) {
    return this.bookingService.findByStatus(status);
  }

  @Get('date-range')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.bookingService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: string) {
    return this.bookingService.cancel(id);
  }

  @Patch(':id/checkin')
  checkIn(@Param('id', ParseIntPipe) id: string) {
    return this.bookingService.checkIn(id);
  }

  @Patch(':id/checkout')
  checkOut(@Param('id', ParseIntPipe) id: string) {
    return this.bookingService.checkOut(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.bookingService.remove(id);
  }
}
