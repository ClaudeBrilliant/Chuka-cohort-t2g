export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  isAvailable: boolean;
  isClean: boolean;
  lastCleaned: Date | null;
  roomTypeId: string;
  createdAt: Date;
  updatedAt: Date;
}
