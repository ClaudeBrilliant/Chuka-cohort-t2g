export interface Room {
  id: number;
  roomNumber: string;
  floor: number;
  isAvailable: boolean;
  isClean: boolean;
  lastCleaned: Date | null;
  roomTypeId: number;
  createdAt: Date;
  updatedAt: Date;
}
