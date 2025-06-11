import { BookingStatus } from '../interfaces/booking.interface';

export class UpdateBookingDto {
  userId?: string;
  roomId?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  totalAmount?: number;
  status?: BookingStatus;
  specialRequests?: string;
}
