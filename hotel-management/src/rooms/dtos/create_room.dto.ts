export class CreateRoomDto {
  roomNumber: string;
  floor: number;
  isAvailable: boolean;
  isClean: boolean;
  lastCleaned?: Date;
  roomTypeId;
}
