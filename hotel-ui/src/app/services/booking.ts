import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface BookingRequest {
  guestName: string;
  email: string;
  phone: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  specialRequests?: string;
}

export interface BookingResponse {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
  guests: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API_URL = 'http://localhost:3000/api';
  
  // Mock data for demonstration
  private mockBookings: BookingResponse[] = [
    {
      id: 'booking-001',
      guestName: 'Peter Njoroge',
      email: 'njorogepeter@gmail.com',
      phone: '+25412345678',
      roomNumber: '205',
      checkInDate: new Date().toISOString(),
      checkOutDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      status: 'confirmed',
      totalAmount: 450.00,
      guests: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 'booking-002',
      guestName: 'Mark Otwane',
      email: 'otwane.mark@gmail.com',
      phone: '+25412345678',
      roomNumber: '118',
      checkInDate: new Date().toISOString(),
      checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      status: 'pending',
      totalAmount: 280.00,
      guests: 1,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'booking-003',
      guestName: 'Claude Nyongesa',
      email: 'nyongesaclaude@gmail.com',
      phone: '+254968765422',
      roomNumber: '301',
      checkInDate: new Date(Date.now() - 86400000).toISOString(),
      checkOutDate: new Date().toISOString(),
      status: 'checked-in',
      totalAmount: 890.00,
      guests: 4,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'booking-004',
      guestName: 'Elizabeth Nyanchama',
      email: 'nyanchama.elizabeth@gmail.com',
      phone: '+1-555-0126',
      roomNumber: '412',
      checkInDate: new Date().toISOString(),
      checkOutDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      status: 'confirmed',
      totalAmount: 1250.00,
      guests: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 'booking-005',
      guestName: 'Alex Muhoro',
      email: 'muhoro.alex@gmail.com',
      phone: '+1-555-0127',
      roomNumber: '156',
      checkInDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      checkOutDate: new Date(Date.now() - 86400000).toISOString(),
      status: 'checked-out',
      totalAmount: 350.00,
      guests: 1,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'booking-006',
      guestName: 'Duncan Oyugi',
      email: 'oyugi.duncan@gmail.com',
      phone: '+254698712365',
      roomNumber: '203',
      checkInDate: new Date(Date.now() + 86400000).toISOString(),
      checkOutDate: new Date(Date.now() + 86400000 * 4).toISOString(),
      status: 'cancelled',
      totalAmount: 720.00,
      guests: 3,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('BookingService initialized with API URL:', this.API_URL);
    console.log(' Mock data initialized:', this.mockBookings.length, 'bookings');
  }

  /**
   * Get all bookings with pagination and filters
   */
  getBookings(page: number = 1, limit: number = 10, status?: string): Observable<PaginatedResponse<BookingResponse>> {
    this.loadingSubject.next(true);
    
    console.log(' Simulating HTTP GET /bookings', { page, limit, status });
    
    // Simulate API delay and processing
    return of(this.mockBookings).pipe(
      delay(800), // Simulate network delay
      map(bookings => {
        // Filter by status if provided
        let filteredBookings = status 
          ? bookings.filter(booking => booking.status === status)
          : bookings;
        
        // Calculate pagination
        const total = filteredBookings.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredBookings.slice(startIndex, endIndex);
        
        const response: PaginatedResponse<BookingResponse> = {
          data: paginatedData,
          total: total,
          page: page,
          limit: limit
        };
        
        console.log(' HTTP Response: Bookings loaded', {
          returned: paginatedData.length,
          total: total,
          page: page
        });
        
        this.loadingSubject.next(false);
        return response;
      })
    );
  }

  /**
   * Get booking by ID
   */
  getBookingById(id: string): Observable<BookingResponse> {
    this.loadingSubject.next(true);
    
    console.log(' Simulating HTTP GET /bookings/' + id);
    
    return of(this.mockBookings).pipe(
      delay(500),
      map(bookings => {
        const booking = bookings.find(b => b.id === id);
        if (!booking) {
          throw new Error('Booking not found');
        }
        console.log(' HTTP Response: Booking loaded', booking.id);
        this.loadingSubject.next(false);
        return booking;
      })
    );
  }

  /**
   * Create new booking
   */
  createBooking(booking: BookingRequest): Observable<BookingResponse> {
    this.loadingSubject.next(true);
    
    console.log(' Simulating HTTP POST /bookings', booking);
    
    const newBooking: BookingResponse = {
      id: 'booking-' + Date.now(),
      guestName: booking.guestName,
      email: booking.email,
      phone: booking.phone,
      roomNumber: Math.floor(Math.random() * 400 + 100).toString(),
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      status: 'pending',
      totalAmount: Math.floor(Math.random() * 500 + 200),
      guests: booking.guests,
      createdAt: new Date().toISOString()
    };
    
    return of(newBooking).pipe(
      delay(1000),
      map(response => {
        this.mockBookings.unshift(response);
        console.log(' HTTP Response: Booking created', response.id);
        this.loadingSubject.next(false);
        return response;
      })
    );
  }

  /**
   * Update booking status
   */
  updateBookingStatus(id: string, status: string): Observable<BookingResponse> {
    this.loadingSubject.next(true);
    
    console.log(' Simulating HTTP PUT /bookings/' + id + '/status', { status });
    
    return of(this.mockBookings).pipe(
      delay(600),
      map(bookings => {
        const bookingIndex = bookings.findIndex(b => b.id === id);
        if (bookingIndex === -1) {
          throw new Error('Booking not found');
        }
        
        bookings[bookingIndex] = {
          ...bookings[bookingIndex],
          status: status as any
        };
        
        console.log(' HTTP Response: Booking status updated', id, status);
        this.loadingSubject.next(false);
        return bookings[bookingIndex];
      })
    );
  }

  /**
   * Check-in guest
   */
  checkInGuest(bookingId: string): Observable<BookingResponse> {
    console.log(' Simulating HTTP POST /bookings/' + bookingId + '/checkin');
    return this.updateBookingStatus(bookingId, 'checked-in');
  }

  /**
   * Check-out guest
   */
  checkOutGuest(bookingId: string): Observable<BookingResponse> {
    console.log(' Simulating HTTP POST /bookings/' + bookingId + '/checkout');
    return this.updateBookingStatus(bookingId, 'checked-out');
  }

  /**
   * Cancel booking
   */
  cancelBooking(id: string): Observable<BookingResponse> {
    console.log(' Simulating HTTP DELETE /bookings/' + id);
    return this.updateBookingStatus(id, 'cancelled');
  }

  /**
   * Search bookings by guest name
   */
  searchBookings(query: string): Observable<BookingResponse[]> {
    this.loadingSubject.next(true);
    
    console.log(' Simulating HTTP GET /bookings/search?q=' + query);
    
    return of(this.mockBookings).pipe(
      delay(400),
      map(bookings => {
        const searchResults = bookings.filter(booking =>
          booking.guestName.toLowerCase().includes(query.toLowerCase()) ||
          booking.email.toLowerCase().includes(query.toLowerCase()) ||
          booking.roomNumber.includes(query)
        );
        
        console.log(' HTTP Response: Search completed', searchResults.length, 'results');
        this.loadingSubject.next(false);
        return searchResults;
      })
    );
  }

  /**
   * Get today's check-ins
   */
  getTodaysCheckIns(): Observable<BookingResponse[]> {
    console.log(' Simulating HTTP GET /bookings/todays-checkins');
    
    return of(this.mockBookings).pipe(
      delay(300),
      map(bookings => {
        const today = new Date().toDateString();
        const todaysCheckIns = bookings.filter(booking => {
          const checkInDate = new Date(booking.checkInDate).toDateString();
          return checkInDate === today && (booking.status === 'confirmed' || booking.status === 'checked-in');
        });
        
        console.log(' HTTP Response: Today\'s check-ins loaded', todaysCheckIns.length);
        return todaysCheckIns;
      })
    );
  }

  /**
   * Get today's check-outs
   */
  getTodaysCheckOuts(): Observable<BookingResponse[]> {
    console.log(' Simulating HTTP GET /bookings/todays-checkouts');
    
    return of(this.mockBookings).pipe(
      delay(350),
      map(bookings => {
        const today = new Date().toDateString();
        const todaysCheckOuts = bookings.filter(booking => {
          const checkOutDate = new Date(booking.checkOutDate).toDateString();
          return checkOutDate === today && booking.status === 'checked-in';
        });
        
        console.log(' HTTP Response: Today\'s check-outs loaded', todaysCheckOuts.length);
        return todaysCheckOuts;
      })
    );
  }

  // Error handling helper
  private handleError(error: any): Observable<never> {
    console.error(' BookingService Error:', error);
    throw error;
  }
}
