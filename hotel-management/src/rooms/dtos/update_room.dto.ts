export class UpdateRoomDto {
  roomNumber?: string;
  floor?: number;
  isAvailable?: boolean;
  isClean?: boolean;
  lastCleaned?: Date;
  roomTypeId?;
}
