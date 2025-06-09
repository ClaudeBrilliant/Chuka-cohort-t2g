export interface Booking {
  id: number;
  userId: number;
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  totalAmount: number;
  status: BookingStatus;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  room?: {
    id: number;
    roomNumber: string;
    floor: number;
    roomType: {
      id: number;
      name: string;
      basePrice: number;
    };
  };
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
}
