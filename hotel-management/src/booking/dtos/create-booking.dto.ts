import { BookingStatus } from '../interfaces/booking.interface';

export class CreateBookingDto {
  userId: number;
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  totalAmount: number;
  status?: BookingStatus;
  specialRequests?: string;
}
