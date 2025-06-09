import { BookingStatus } from '../interfaces/booking.interface';

export class UpdateBookingDto {
  userId?: number;
  roomId?: number;
  checkInDate?: Date;
  checkOutDate?: Date;
  totalAmount?: number;
  status?: BookingStatus;
  specialRequests?: string;
}
