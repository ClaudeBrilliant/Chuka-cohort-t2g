/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { getPrismaClient } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dtos/create_room.dto';
import { Room } from './interfaces/room.interface';
import { UpdateRoomDto } from './dtos/update_room.dto';

@Injectable()
export class RoomsService {
  private prisma = getPrismaClient();

  /**
   * Create room
   * @param data CreateRoomDto
   * @returns Room
   */
  async create(data: CreateRoomDto): Promise<Room> {
    try {
      const existingRoom = await this.prisma.room.findUnique({
        where: { roomNumber: data.roomNumber },
      });

      if (existingRoom) {
        throw new ConflictException(
          `Room number ${data.roomNumber} already exists`,
        );
      }

      const room = await this.prisma.room.create({
        data: {
          roomNumber: data.roomNumber,
          floor: data.floor,
          isAvailable: data.isAvailable,
          isClean: data.isClean,
          lastCleaned: data.lastCleaned,
          roomTypeId: data.roomTypeId,
        },
      });

      return room;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create room');
    }
  }

  /**
   * Find all rooms
   * @returns Room[]
   */
  async findAll(): Promise<Room[]> {
    try {
      return await this.prisma.room.findMany({
        include: {
          roomType: true,
        },
        orderBy: { roomNumber: 'asc' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve rooms', error);
    }
  }

  /**
   * Find room by ID
   * @param id Room ID
   * @returns Room
   */
  async findOne(id: string): Promise<Room> {
    try {
      const room = await this.prisma.room.findUnique({
        where: { id },
        include: {
          roomType: true,
          bookings: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!room) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }

      return room;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve room');
    }
  }

  /**
   * Find room by room number
   * @param roomNumber Room number
   * @returns Room
   */
  async findByRoomNumber(roomNumber: string): Promise<Room> {
    try {
      const room = await this.prisma.room.findUnique({
        where: { roomNumber },
        include: {
          roomType: true,
          bookings: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!room) {
        throw new NotFoundException(`Room ${roomNumber} not found`);
      }

      return room;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve room');
    }
  }

  /**
   * Update room
   * @param id Room ID
   * @param data UpdateRoomDto
   * @returns Room
   */
  async update(id: string, data: UpdateRoomDto): Promise<Room> {
    try {
      const existingRoom = await this.prisma.room.findUnique({
        where: { id },
      });

      if (!existingRoom) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }

      // Check for room number conflicts if room number is being updated
      if (data.roomNumber && data.roomNumber !== existingRoom.roomNumber) {
        const roomNumberConflict = await this.prisma.room.findUnique({
          where: { roomNumber: data.roomNumber },
        });

        if (roomNumberConflict) {
          throw new ConflictException(
            `Room number ${data.roomNumber} already exists`,
          );
        }
      }

      const updatedRoom = await this.prisma.room.update({
        where: { id },
        data: {
          ...(data.roomNumber && { roomNumber: data.roomNumber }),
          ...(data.floor !== undefined && { floor: data.floor }),
          ...(data.isAvailable !== undefined && {
            isAvailable: data.isAvailable,
          }),
          ...(data.isClean !== undefined && { isClean: data.isClean }),
          ...(data.lastCleaned !== undefined && {
            lastCleaned: data.lastCleaned,
          }),
          ...(data.roomTypeId !== undefined && { roomTypeId: data.roomTypeId }),
        },
        include: {
          roomType: true,
        },
      });

      return updatedRoom;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update room');
    }
  }

  /**
   * Delete room
   * @param id Room ID
   * @returns Success message
   */
  async remove(id: string): Promise<{ message: string }> {
    try {
      const room = await this.prisma.room.findUnique({
        where: { id },
        include: {
          bookings: {
            where: {
              status: {
                in: ['CONFIRMED', 'CHECKED_IN'],
              },
            },
          },
        },
      });

      if (!room) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }

      // Check if room has active bookings
      if (room.bookings.length > 0) {
        throw new ConflictException('Cannot delete room with active bookings');
      }

      await this.prisma.room.delete({
        where: { id },
      });

      return {
        message: `Room ${room.roomNumber} has been deleted successfully`,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete room');
    }
  }

  /**
   * Get available rooms for given date range
   * @param checkIn Check-in date
   * @param checkOut Check-out date
   * @returns Available rooms with room type info
   */
  async findAvailableRooms(checkIn: Date, checkOut: Date) {
    try {
      return await this.prisma.room.findMany({
        where: {
          isAvailable: true,
          isClean: true,
          bookings: {
            none: {
              OR: [
                {
                  AND: [
                    { checkInDate: { lte: checkIn } },
                    { checkOutDate: { gt: checkIn } },
                  ],
                },
                {
                  AND: [
                    { checkInDate: { lt: checkOut } },
                    { checkOutDate: { gte: checkOut } },
                  ],
                },
                {
                  AND: [
                    { checkInDate: { gte: checkIn } },
                    { checkOutDate: { lte: checkOut } },
                  ],
                },
              ],
              status: {
                in: ['CONFIRMED', 'CHECKED_IN'],
              },
            },
          },
        },
        include: {
          roomType: true,
          bookings: {
            where: {
              status: {
                in: ['CONFIRMED', 'CHECKED_IN'],
              },
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { roomNumber: 'asc' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find available rooms',
        error,
      );
    }
  }

  /**
   * Get rooms by floor
   * @param floor Floor number
   * @returns Rooms on specified floor
   */
  async findByFloor(floor: number): Promise<Room[]> {
    try {
      return await this.prisma.room.findMany({
        where: { floor },
        include: {
          roomType: true,
        },
        orderBy: { roomNumber: 'asc' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve rooms by floor',
        error,
      );
    }
  }

  /**
   * Get rooms by room type
   * @param roomTypeId Room type ID
   * @returns Rooms of specified type
   */
  async findByRoomType(roomTypeId: string): Promise<Room[]> {
    try {
      return await this.prisma.room.findMany({
        where: { roomTypeId },
        include: {
          roomType: true,
        },
        orderBy: { roomNumber: 'asc' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve rooms by type',
        error,
      );
    }
  }

  /**
   * Get rooms that need cleaning
   * @returns Rooms that need cleaning
   */
  async findRoomsNeedingCleaning(): Promise<Room[]> {
    try {
      return await this.prisma.room.findMany({
        where: { isClean: false },
        include: {
          roomType: true,
        },
        orderBy: { roomNumber: 'asc' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve rooms needing cleaning',
        error,
      );
    }
  }

  /**
   * Mark room as cleaned
   * @param id Room ID
   * @returns Updated room
   */
  async markAsCleaned(id: string): Promise<Room> {
    try {
      const room = await this.prisma.room.findUnique({
        where: { id },
      });

      if (!room) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }

      return await this.prisma.room.update({
        where: { id },
        data: {
          isClean: true,
          lastCleaned: new Date(),
        },
        include: {
          roomType: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to mark room as cleaned');
    }
  }

  /**
   * Set room availability
   * @param id Room ID
   * @param isAvailable Availability status
   * @returns Updated room
   */
  async setAvailability(id: string, isAvailable: boolean): Promise<Room> {
    try {
      const room = await this.prisma.room.findUnique({
        where: { id },
      });

      if (!room) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }

      return await this.prisma.room.update({
        where: { id },
        data: { isAvailable },
        include: {
          roomType: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update room availability',
      );
    }
  }
}
