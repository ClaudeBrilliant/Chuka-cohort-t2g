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
import { CreateRoomTypeDto } from './dtos/create-room-type.dto';
import { UpdateRoomTypeDto } from './dtos/update-room-type.dto';
import { RoomType } from './interfaces/room-type.interface';

@Injectable()
export class RoomTypeService {
  private prisma = getPrismaClient();

  /**
   * Create a new room type
   * @param data CreateRoomTypeDto
   * @returns RoomType
   */
  async create(data: CreateRoomTypeDto): Promise<RoomType> {
    try {
      const existingRoomType = await this.prisma.roomType.findUnique({
        where: { name: data.name },
      });

      if (existingRoomType) {
        throw new ConflictException(`Room type '${data.name}' already exists`);
      }

      const roomType = await this.prisma.roomType.create({
        data: {
          name: data.name,
          description: data.description,
          basePrice: data.basePrice,
          maxCapacity: data.maxCapacity,
          amenities: data.amenities,
        },
      });

      return this.mapPrismaRoomTypeToInterface(roomType);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create room type');
    }
  }

  /**
   * Find all room types
   * @returns RoomType[]
   */
  async findAll(): Promise<RoomType[]> {
    try {
      const roomTypes = await this.prisma.roomType.findMany({
        include: {
          rooms: {
            select: {
              id: true,
              roomNumber: true,
              isAvailable: true,
              isClean: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      return roomTypes.map((roomType) =>
        this.mapPrismaRoomTypeToInterface(roomType),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve room types',
        error,
      );
    }
  }

  /**
   * Find room type by ID
   * @param id Room type ID
   * @returns RoomType
   */
  async findOne(id: number): Promise<RoomType> {
    try {
      const roomType = await this.prisma.roomType.findUnique({
        where: { id },
        include: {
          rooms: {
            select: {
              id: true,
              roomNumber: true,
              floor: true,
              isAvailable: true,
              isClean: true,
              lastCleaned: true,
            },
          },
        },
      });

      if (!roomType) {
        throw new NotFoundException(`Room type with ID ${id} not found`);
      }

      return this.mapPrismaRoomTypeToInterface(roomType);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve room type');
    }
  }

  /**
   * Find room type by name
   * @param name Room type name
   * @returns RoomType
   */
  async findByName(name: string): Promise<RoomType> {
    try {
      const roomType = await this.prisma.roomType.findUnique({
        where: { name },
        include: {
          rooms: {
            select: {
              id: true,
              roomNumber: true,
              floor: true,
              isAvailable: true,
              isClean: true,
            },
          },
        },
      });

      if (!roomType) {
        throw new NotFoundException(`Room type '${name}' not found`);
      }

      return this.mapPrismaRoomTypeToInterface(roomType);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve room type');
    }
  }

  /**
   * Update room type
   * @param id Room type ID
   * @param data UpdateRoomTypeDto
   * @returns RoomType
   */
  async update(id: number, data: UpdateRoomTypeDto): Promise<RoomType> {
    try {
      const existingRoomType = await this.prisma.roomType.findUnique({
        where: { id },
      });

      if (!existingRoomType) {
        throw new NotFoundException(`Room type with ID ${id} not found`);
      }

      // Check for name conflicts if name is being updated
      if (data.name && data.name !== existingRoomType.name) {
        const nameConflict = await this.prisma.roomType.findUnique({
          where: { name: data.name },
        });

        if (nameConflict) {
          throw new ConflictException(
            `Room type '${data.name}' already exists`,
          );
        }
      }

      const updatedRoomType = await this.prisma.roomType.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
          ...(data.maxCapacity !== undefined && {
            maxCapacity: data.maxCapacity,
          }),
          ...(data.amenities !== undefined && { amenities: data.amenities }),
        },
      });

      return this.mapPrismaRoomTypeToInterface(updatedRoomType);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update room type');
    }
  }

  /**
   * Delete room type
   * @param id Room type ID
   * @returns Success message
   */
  async remove(id: number): Promise<{ message: string }> {
    try {
      const roomType = await this.prisma.roomType.findUnique({
        where: { id },
        include: {
          rooms: true,
        },
      });

      if (!roomType) {
        throw new NotFoundException(`Room type with ID ${id} not found`);
      }

      // Check if room type has associated rooms
      if (roomType.rooms.length > 0) {
        throw new ConflictException(
          `Cannot delete room type '${roomType.name}' because it has ${roomType.rooms.length} associated room(s)`,
        );
      }

      await this.prisma.roomType.delete({
        where: { id },
      });

      return {
        message: `Room type '${roomType.name}' has been deleted successfully`,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete room type');
    }
  }

  /**
   * Get room types with available rooms count
   * @returns Room types with availability statistics
   */
  async findWithAvailability() {
    try {
      const roomTypes = await this.prisma.roomType.findMany({
        include: {
          rooms: {
            select: {
              id: true,
              isAvailable: true,
              isClean: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      return roomTypes.map((roomType) => ({
        ...this.mapPrismaRoomTypeToInterface(roomType),
        roomStats: {
          totalRooms: roomType.rooms.length,
          availableRooms: roomType.rooms.filter(
            (room) => room.isAvailable && room.isClean,
          ).length,
          unavailableRooms: roomType.rooms.filter((room) => !room.isAvailable)
            .length,
          dirtyRooms: roomType.rooms.filter((room) => !room.isClean).length,
        },
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve room types with availability',
        error,
      );
    }
  }

  /**
   * Find room types by price range
   * @param minPrice Minimum price
   * @param maxPrice Maximum price
   * @returns Room types within price range
   */
  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<RoomType[]> {
    try {
      const roomTypes = await this.prisma.roomType.findMany({
        where: {
          basePrice: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
        orderBy: { basePrice: 'asc' },
      });

      return roomTypes.map((roomType) =>
        this.mapPrismaRoomTypeToInterface(roomType),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve room types by price range',
        error,
      );
    }
  }

  /**
   * Find room types by capacity
   * @param minCapacity Minimum capacity
   * @returns Room types with at least the specified capacity
   */
  async findByCapacity(minCapacity: number): Promise<RoomType[]> {
    try {
      const roomTypes = await this.prisma.roomType.findMany({
        where: {
          maxCapacity: {
            gte: minCapacity,
          },
        },
        orderBy: { maxCapacity: 'asc' },
      });

      return roomTypes.map((roomType) =>
        this.mapPrismaRoomTypeToInterface(roomType),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve room types by capacity',
        error,
      );
    }
  }

  /**
   * Map Prisma RoomType to interface
   * @param roomType Prisma RoomType object
   * @returns RoomType interface
   */
  private mapPrismaRoomTypeToInterface(roomType: any): RoomType {
    return {
      id: roomType.id,
      name: roomType.name,
      description: roomType.description,
      basePrice: Number(roomType.basePrice),
      maxCapacity: roomType.maxCapacity,
      amenities: roomType.amenities,
      createdAt: roomType.createdAt,
      updatedAt: roomType.updatedAt,
    };
  }
}
