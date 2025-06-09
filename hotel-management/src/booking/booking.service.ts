/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { getPrismaClient } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { Booking, BookingStatus } from './interfaces/booking.interface';

@Injectable()
export class BookingService {
  private prisma = getPrismaClient();

  /**
   * Create a new booking
   * @param data CreateBookingDto
   * @returns Booking
   */
  async create(data: CreateBookingDto): Promise<Booking> {
    try {
      // Validate dates
      if (data.checkInDate >= data.checkOutDate) {
        throw new BadRequestException(
          'Check-out date must be after check-in date',
        );
      }

      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${data.userId} not found`);
      }

      // Check if room exists and is available
      const room = await this.prisma.room.findUnique({
        where: { id: data.roomId },
        include: { roomType: true },
      });

      if (!room) {
        throw new NotFoundException(`Room with ID ${data.roomId} not found`);
      }

      if (!room.isAvailable) {
        throw new ConflictException('Room is not available for booking');
      }

      // Check for booking conflicts
      const conflictingBookings = await this.prisma.booking.findMany({
        where: {
          roomId: data.roomId,
          status: {
            in: ['CONFIRMED', 'CHECKED_IN'],
          },
          OR: [
            {
              AND: [
                { checkInDate: { lte: data.checkInDate } },
                { checkOutDate: { gt: data.checkInDate } },
              ],
            },
            {
              AND: [
                { checkInDate: { lt: data.checkOutDate } },
                { checkOutDate: { gte: data.checkOutDate } },
              ],
            },
            {
              AND: [
                { checkInDate: { gte: data.checkInDate } },
                { checkOutDate: { lte: data.checkOutDate } },
              ],
            },
          ],
        },
      });

      if (conflictingBookings.length > 0) {
        throw new ConflictException(
          'Room is already booked for the selected dates',
        );
      }

      // Calculate total amount if not provided
      let totalAmount = data.totalAmount;
      if (!totalAmount) {
        const nights = Math.ceil(
          (data.checkOutDate.getTime() - data.checkInDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        totalAmount = Number(room.roomType.basePrice) * nights;
      }

      const booking = await this.prisma.booking.create({
        data: {
          userId: data.userId,
          roomId: data.roomId,
          checkInDate: data.checkInDate,
          checkOutDate: data.checkOutDate,
          totalAmount,
          status: data.status || BookingStatus.PENDING,
          specialRequests: data.specialRequests,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          room: {
            include: {
              roomType: {
                select: {
                  id: true,
                  name: true,
                  basePrice: true,
                },
              },
            },
          },
        },
      });

      return this.mapPrismaBookingToInterface(booking);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create booking');
    }
  }

  /**
   * Find all bookings
   * @returns Booking[]
   */
  async findAll(): Promise<Booking[]> {
    try {
      const bookings = await this.prisma.booking.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          room: {
            include: {
              roomType: {
                select: {
                  id: true,
                  name: true,
                  basePrice: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return bookings.map((booking) =>
        this.mapPrismaBookingToInterface(booking),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve bookings',
        error,
      );
    }
  }

  /**
   * Find booking by ID
   * @param id Booking ID
   * @returns Booking
   */
  async findOne(id: number): Promise<Booking> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          room: {
            include: {
              roomType: {
                select: {
                  id: true,
                  name: true,
                  basePrice: true,
                  description: true,
                },
              },
            },
          },
        },
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      return this.mapPrismaBookingToInterface(booking);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve booking');
    }
  }

  /**
   * Find bookings by user ID
   * @param userId User ID
   * @returns Booking[]
   */
  async findByUser(userId: number): Promise<Booking[]> {
    try {
      const bookings = await this.prisma.booking.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          room: {
            include: {
              roomType: {
                select: {
                  id: true,
                  name: true,
                  basePrice: true,
                },
              },
            },
          },
        },
        orderBy: { checkInDate: 'desc' },
      });

      return bookings.map((booking) =>
        this.mapPrismaBookingToInterface(booking),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve user bookings',
        error,
      );
    }
  }

  /**
   * Find bookings by room ID
   * @param roomId Room ID
   * @returns Booking[]
   */
  async findByRoom(roomId: number): Promise<Booking[]> {
    try {
      const bookings = await this.prisma.booking.findMany({
        where: { roomId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          room: {
            include: {
              roomType: {
                select: {
                  id: true,
                  name: true,
                  basePrice: true,
                },
              },
            },
          },
        },
        orderBy: { checkInDate: 'desc' },
      });

      return bookings.map((booking) =>
        this.mapPrismaBookingToInterface(booking),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve room bookings',
        error,
      );
    }
  }

  /**
   * Find bookings by status
   * @param status Booking status
   * @returns Booking[]
   */
  async findByStatus(status: BookingStatus): Promise<Booking[]> {
    try {
      const bookings = await this.prisma.booking.findMany({
        where: { status },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          room: {
            include: {
              roomType: {
                select: {
                  id: true,
                  name: true,
                  basePrice: true,
                },
              },
            },
          },
        },
        orderBy: { checkInDate: 'asc' },
      });

      return bookings.map((booking) =>
        this.mapPrismaBookingToInterface(booking),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve bookings by status',
        error,
      );
    }
  }

  /**
   * Find bookings by date range
   * @param startDate Start date
   * @param endDate End date
   * @returns Booking[]
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    try {
      const bookings = await this.prisma.booking.findMany({
        where: {
          OR: [
            {
              AND: [
                { checkInDate: { gte: startDate } },
                { checkInDate: { lte: endDate } },
              ],
            },
            {
              AND: [
                { checkOutDate: { gte: startDate } },
                { checkOutDate: { lte: endDate } },
              ],
            },
            {
              AND: [
                { checkInDate: { lte: startDate } },
                { checkOutDate: { gte: endDate } },
              ],
            },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          room: {
            include: {
              roomType: {
                select: {
                  id: true,
                  name: true,
                  basePrice: true,
                },
              },
            },
          },
        },
        orderBy: { checkInDate: 'asc' },
      });

      return bookings.map((booking) =>
        this.mapPrismaBookingToInterface(booking),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve bookings by date range',
        error,
      );
    }
  }

  /**
   * Update booking
   * @param id Booking ID
   * @param data UpdateBookingDto
   * @returns Booking
   */
  async update(id: number, data: UpdateBookingDto): Promise<Booking> {
    try {
      const existingBooking = await this.prisma.booking.findUnique({
        where: { id },
      });

      if (!existingBooking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      // Validate dates if being updated
      if (data.checkInDate && data.checkOutDate) {
        if (data.checkInDate >= data.checkOutDate) {
          throw new BadRequestException(
            'Check-out date must be after check-in date',
          );
        }
      }

      // Check for room conflicts if dates or room are being changed
      if (data.checkInDate || data.checkOutDate || data.roomId) {
        const checkInDate = data.checkInDate || existingBooking.checkInDate;
        const checkOutDate = data.checkOutDate || existingBooking.checkOutDate;
        const roomId = data.roomId || existingBooking.roomId;

        const conflictingBookings = await this.prisma.booking.findMany({
          where: {
            id: { not: id }, // Exclude current booking
            roomId,
            status: {
              in: ['CONFIRMED', 'CHECKED_IN'],
            },
            OR: [
              {
                AND: [
                  { checkInDate: { lte: checkInDate } },
                  { checkOutDate: { gt: checkInDate } },
                ],
              },
              {
                AND: [
                  { checkInDate: { lt: checkOutDate } },
                  { checkOutDate: { gte: checkOutDate } },
                ],
              },
              {
                AND: [
                  { checkInDate: { gte: checkInDate } },
                  { checkOutDate: { lte: checkOutDate } },
                ],
              },
            ],
          },
        });

        if (conflictingBookings.length > 0) {
          throw new ConflictException(
            'Room is already booked for the selected dates',
          );
        }
      }

      const updatedBooking = await this.prisma.booking.update({
        where: { id },
        data: {
          ...(data.userId && { userId: data.userId }),
          ...(data.roomId && { roomId: data.roomId }),
          ...(data.checkInDate && { checkInDate: data.checkInDate }),
          ...(data.checkOutDate && { checkOutDate: data.checkOutDate }),
          ...(data.totalAmount !== undefined && {
            totalAmount: data.totalAmount,
          }),
          ...(data.status && { status: data.status }),
          ...(data.specialRequests !== undefined && {
            specialRequests: data.specialRequests,
          }),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          room: {
            include: {
              roomType: {
                select: {
                  id: true,
                  name: true,
                  basePrice: true,
                },
              },
            },
          },
        },
      });

      return this.mapPrismaBookingToInterface(updatedBooking);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update booking');
    }
  }

  /**
   * Cancel booking
   * @param id Booking ID
   * @returns Booking
   */
  async cancel(id: number): Promise<Booking> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id },
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      if (booking.status === BookingStatus.CANCELLED) {
        throw new ConflictException('Booking is already cancelled');
      }

      if (booking.status === BookingStatus.CHECKED_OUT) {
        throw new ConflictException('Cannot cancel a completed booking');
      }

      const cancelledBooking = await this.prisma.booking.update({
        where: { id },
        data: { status: BookingStatus.CANCELLED },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          room: {
            include: {
              roomType: {
                select: {
                  id: true,
                  name: true,
                  basePrice: true,
                },
              },
            },
          },
        },
      });

      return this.mapPrismaBookingToInterface(cancelledBooking);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to cancel booking');
    }
  }

  /**
   * Check in booking
   * @param id Booking ID
   * @returns Booking
   */
  async checkIn(id: number): Promise<Booking> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id },
        include: { room: true },
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      if (booking.status !== BookingStatus.CONFIRMED) {
        throw new ConflictException(
          'Only confirmed bookings can be checked in',
        );
      }

      // Update booking status and room cleanliness
      const [updatedBooking] = await Promise.all([
        this.prisma.booking.update({
          where: { id },
          data: { status: BookingStatus.CHECKED_IN },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            room: {
              include: {
                roomType: {
                  select: {
                    id: true,
                    name: true,
                    basePrice: true,
                  },
                },
              },
            },
          },
        }),
        this.prisma.room.update({
          where: { id: booking.roomId },
          data: { isAvailable: false },
        }),
      ]);

      return this.mapPrismaBookingToInterface(updatedBooking);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to check in booking');
    }
  }

  /**
   * Check out booking
   * @param id Booking ID
   * @returns Booking
   */
  async checkOut(id: number): Promise<Booking> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id },
        include: { room: true },
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      if (booking.status !== BookingStatus.CHECKED_IN) {
        throw new ConflictException(
          'Only checked-in bookings can be checked out',
        );
      }

      // Update booking status and room status
      const [updatedBooking] = await Promise.all([
        this.prisma.booking.update({
          where: { id },
          data: { status: BookingStatus.CHECKED_OUT },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            room: {
              include: {
                roomType: {
                  select: {
                    id: true,
                    name: true,
                    basePrice: true,
                  },
                },
              },
            },
          },
        }),
        this.prisma.room.update({
          where: { id: booking.roomId },
          data: {
            isAvailable: true,
            isClean: false, // Room needs cleaning after checkout
          },
        }),
      ]);

      return this.mapPrismaBookingToInterface(updatedBooking);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to check out booking');
    }
  }

  /**
   * Delete booking
   * @param id Booking ID
   * @returns Success message
   */
  async remove(id: number): Promise<{ message: string }> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id },
        include: {
          user: { select: { name: true } },
          room: { select: { roomNumber: true } },
        },
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      await this.prisma.booking.delete({
        where: { id },
      });

      return {
        message: `Booking for ${booking.user.name} in room ${booking.room.roomNumber} has been deleted`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete booking');
    }
  }

  /**
   * Map Prisma Booking to interface
   * @param booking Prisma Booking object
   * @returns Booking interface
   */
  private mapPrismaBookingToInterface(booking: any): Booking {
    return {
      id: booking.id,
      userId: booking.userId,
      roomId: booking.roomId,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      totalAmount: Number(booking.totalAmount),
      status: booking.status,
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      user: booking.user
        ? {
            id: booking.user.id,
            name: booking.user.name,
            email: booking.user.email,
          }
        : undefined,
      room: booking.room
        ? {
            id: booking.room.id,
            roomNumber: booking.room.roomNumber,
            floor: booking.room.floor,
            roomType: {
              id: booking.room.roomType.id,
              name: booking.room.roomType.name,
              basePrice: Number(booking.room.roomType.basePrice),
            },
          }
        : undefined,
    };
  }
}
