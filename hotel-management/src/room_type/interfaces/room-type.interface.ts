export interface RoomType {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  maxCapacity: number;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}
