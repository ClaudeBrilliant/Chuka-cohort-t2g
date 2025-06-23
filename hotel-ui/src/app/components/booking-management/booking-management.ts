import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { BookingService, BookingResponse, PaginatedResponse } from '../../services/booking';

@Component({
  selector: 'app-booking-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './booking-management.html',
  styleUrl: './booking-management.css'
})
export class BookingManagement implements OnInit, OnDestroy {
  // Reactive form properties
  bookingForm!: FormGroup;
  showNewBookingForm = false;

  // Component state
  bookings: BookingResponse[] = [];
  todaysCheckIns: BookingResponse[] = [];
  todaysCheckOuts: BookingResponse[] = [];
  
  // Loading states
  isLoading = false;
  isLoadingCheckIns = false;
  isLoadingCheckOuts = false;
  
  // Error handling
  error: string | null = null;
  
  // Filters and search
  searchTerm = '';
  selectedStatus = '';
  currentPage = 1;
  totalBookings = 0;
  
  // Search subject for debounced search
  private searchSubject = new Subject<string>();
  
  // Subscription management
  private subscriptions = new Subscription();
  
  // Status options
  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'checked-in', label: 'Checked In' },
    { value: 'checked-out', label: 'Checked Out' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(private bookingService: BookingService, private fb: FormBuilder) {

    console.log('BookingManagement Constructor: Component instantiated');
    console.log('Constructor: BookingService injected via DI');
  }

  // OnInit - HTTP Client setup and initial data loading
  ngOnInit(): void {
    console.log(' OnInit: Setting up HTTP Client operations');
    
    // Load initial data via HTTP
    this.loadBookings();
    this.loadTodaysActivities();
    
    // Setup debounced search using RxJS operators
    this.setupDebouncedSearch();
    
    console.log('OnInit: All HTTP subscriptions configured');

    this.createBookingForm();
  }

  // OnDestroy - HTTP subscription cleanup
  ngOnDestroy(): void {
    console.log('OnDestroy: Cleaning up HTTP subscriptions');
    
    // Unsubscribe from all HTTP operations
    this.subscriptions.unsubscribe();
    
    // Complete search subject
    this.searchSubject.complete();
    
    console.log('OnDestroy: All HTTP subscriptions cleaned up');
  }


  toggleNewBookingForm(): void {
    this.showNewBookingForm = !this.showNewBookingForm;
    if(this.showNewBookingForm){
      this.bookingForm.reset({guests: 1})
    }
  }
  // HTTP Client data loading methods
  private loadBookings(): void {
    this.isLoading = true;
    this.error = null;
    
    console.log(' HTTP Request: Loading bookings with pagination');
    
    // Create HTTP subscription for bookings
    const bookingsSubscription = this.bookingService.getBookings(this.currentPage, 10, this.selectedStatus)
      .pipe(
        catchError(error => {
          console.error(' HTTP Error:', error.message);
          this.error = error.message;
          return of({ data: [], total: 0, page: 1, limit: 10 } as PaginatedResponse<BookingResponse>);
        })
      )
      .subscribe({
        next: (response) => {
          this.bookings = response.data;
          this.totalBookings = response.total;
          this.isLoading = false;
          console.log('HTTP Success: Bookings loaded', {
            count: response.data.length,
            total: response.total,
            page: response.page
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.error = 'Failed to load bookings';
          console.error(' HTTP Subscription Error:', error);
        }
      });

    this.subscriptions.add(bookingsSubscription);
  }

  private loadTodaysActivities(): void {
    console.log('HTTP Request: Loading today\'s activities');
    
    // Load today's check-ins
    this.isLoadingCheckIns = true;
    const checkInsSubscription = this.bookingService.getTodaysCheckIns()
      .pipe(
        catchError(error => {
          console.error(' HTTP Error (Check-ins):', error.message);
          return of([]);
        })
      )
      .subscribe({
        next: (checkIns) => {
          this.todaysCheckIns = checkIns;
          this.isLoadingCheckIns = false;
          console.log('HTTP Success: Check-ins loaded', checkIns.length);
        }
      });

    // Load today's check-outs
    this.isLoadingCheckOuts = true;
    const checkOutsSubscription = this.bookingService.getTodaysCheckOuts()
      .pipe(
        catchError(error => {
          console.error(' HTTP Error (Check-outs):', error.message);
          return of([]);
        })
      )
      .subscribe({
        next: (checkOuts) => {
          this.todaysCheckOuts = checkOuts;
          this.isLoadingCheckOuts = false;
          console.log('HTTP Success: Check-outs loaded', checkOuts.length);
        }
      });

    this.subscriptions.add(checkInsSubscription);
    this.subscriptions.add(checkOutsSubscription);
  }

  // Debounced search setup using RxJS operators
  private setupDebouncedSearch(): void {
    console.log(' Setting up debounced search with RxJS operators');
    
    const searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged(), // Only emit if value actually changed
        switchMap(query => {
          console.log(' Debounced search triggered:', query);
          
          if (!query.trim()) {
            // If search is empty, load regular bookings
            return this.bookingService.getBookings(1, 10, this.selectedStatus);
          } else {
            // Search bookings
            return this.bookingService.searchBookings(query)
              .pipe(
                // Transform search results to match expected format
                switchMap(results => of({
                  data: results,
                  total: results.length,
                  page: 1,
                  limit: 10
                } as PaginatedResponse<BookingResponse>))
              );
          }
        }),
        catchError(error => {
          console.error(' Search HTTP Error:', error.message);
          this.error = 'Search failed: ' + error.message;
          return of({ data: [], total: 0, page: 1, limit: 10 } as PaginatedResponse<BookingResponse>);
        })
      )
      .subscribe({
        next: (response) => {
          this.bookings = response.data;
          this.totalBookings = response.total;
          this.currentPage = 1; // Reset to first page for search results
          console.log('Debounced search completed:', response.data.length, 'results');
        }
      });

    this.subscriptions.add(searchSubscription);
  }

  // Public methods for template
  onSearchChange(query: string): void {
    console.log(' Search input changed:', query);
    this.searchTerm = query;
    // Trigger debounced search
    this.searchSubject.next(query);
  }

  onStatusFilterChange(): void {
    console.log(' Status filter changed:', this.selectedStatus);
    this.currentPage = 1; // Reset pagination
    this.loadBookings(); // Immediate HTTP request for filter
  }

  onPageChange(page: number): void {
    console.log('Page changed to:', page);
    this.currentPage = page;
    this.loadBookings(); // HTTP request for new page
  }

  checkInGuest(booking: BookingResponse): void {
    console.log(' HTTP Request: Checking in guest', booking.id);
    
    const checkInSubscription = this.bookingService.checkInGuest(booking.id)
      .pipe(
        catchError(error => {
          console.error(' Check-in HTTP Error:', error.message);
          this.error = 'Check-in failed: ' + error.message;
          return of(null);
        })
      )
      .subscribe({
        next: (updatedBooking) => {
          if (updatedBooking) {
            // Update local data
            const index = this.bookings.findIndex(b => b.id === booking.id);
            if (index !== -1) {
              this.bookings[index] = updatedBooking;
            }
            
            // Refresh today's activities
            this.loadTodaysActivities();
            
            console.log('HTTP Success: Guest checked in', updatedBooking.id);
          }
        }
      });

    this.subscriptions.add(checkInSubscription);
  }

  checkOutGuest(booking: BookingResponse): void {
    console.log(' HTTP Request: Checking out guest', booking.id);
    
    const checkOutSubscription = this.bookingService.checkOutGuest(booking.id)
      .pipe(
        catchError(error => {
          console.error(' Check-out HTTP Error:', error.message);
          this.error = 'Check-out failed: ' + error.message;
          return of(null);
        })
      )
      .subscribe({
        next: (updatedBooking) => {
          if (updatedBooking) {
            // Update local data
            const index = this.bookings.findIndex(b => b.id === booking.id);
            if (index !== -1) {
              this.bookings[index] = updatedBooking;
            }
            
            // Refresh today's activities
            this.loadTodaysActivities();
            
            console.log('HTTP Success: Guest checked out', updatedBooking.id);
          }
        }
      });

    this.subscriptions.add(checkOutSubscription);
  }

  cancelBooking(booking: BookingResponse): void {
    console.log(' HTTP Request: Cancelling booking', booking.id);
    
    const cancelSubscription = this.bookingService.cancelBooking(booking.id)
      .pipe(
        catchError(error => {
          console.error(' Cancel HTTP Error:', error.message);
          this.error = 'Cancellation failed: ' + error.message;
          return of(null);
        })
      )
      .subscribe({
        next: (updatedBooking) => {
          if (updatedBooking) {
            // Update local data
            const index = this.bookings.findIndex(b => b.id === booking.id);
            if (index !== -1) {
              this.bookings[index] = updatedBooking;
            }
            
            console.log('HTTP Success: Booking cancelled', updatedBooking.id);
          }
        }
      });

    this.subscriptions.add(cancelSubscription);
  }

  refreshData(): void {
    console.log(' Manual refresh: Triggering all HTTP requests');
    this.error = null;
    this.loadBookings();
    this.loadTodaysActivities();
  }

  // Helper methods
  trackByBookingId(index: number, booking: BookingResponse): string {
    return booking.id;
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'checked-in': 'bg-green-100 text-green-800',
      'checked-out': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  }

  canCheckIn(booking: BookingResponse): boolean {
    return booking.status === 'confirmed';
  }

  canCheckOut(booking: BookingResponse): boolean {
    return booking.status === 'checked-in';
  }

  canCancel(booking: BookingResponse): boolean {
    return booking.status === 'pending' || booking.status === 'confirmed';
  }

  getTotalPages(): number {
    return Math.ceil(this.totalBookings / 10);
  }


  private createBookingForm(): void{
    this.bookingForm = this.fb.group ({
      guestName: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator ]],

      checkIn: ['', [Validators.required, this.futureDateValidator]],
      checkOut: ['', [Validators.required]],
      roomType: ['', [Validators.required]],
      guests: [1, [Validators.required, Validators.min(1), Validators.max(4)]]
    }, {validators: this.dateRangeValidator})
  }

  private phoneValidator(control: AbstractControl) {
    const phone = control.value;

    return phone && phone.length >= 10 ? null : {invalidPhone: true}
  }

  private futureDateValidator(control: AbstractControl) {
    const date = new Date(control.value);
    return date > new Date() ? null : {pastDate: true}
  }

  private dateRangeValidator(form: AbstractControl) {
    const checkIn = form.get('checkIn')?.value;
    const checkOut = form.get('checkOut')?.value;

    return checkIn && checkOut && new Date(checkOut) <= new Date(checkIn) ? {invalidDateRange: true} : null
  }

  getFieldError(fieldName: string): string | null {
    const field = this.bookingForm.get(fieldName);
    if(field?.errors && field.touched) {
      if(field.errors['minlength']) return 'Too short';
      if(field.errors['required']) return 'This field is required';
      if(field.errors['email']) return ' Invalid email format';
      if(field.errors['invalidPhone']) return 'Phone number must be atleast 10 digits';
      if(field.errors['pastDate']) return ' Date must be in the future';
      if(field.errors['min']) return ' Minimum of 1 guest';
      if(field.errors['max']) return ' Max of 4 guests'
    }
    return null;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.bookingForm.controls).forEach(key =>{this.bookingForm.controls[key].markAsTouched()})
  }

  onSubmitNewBooking(): void {
    if(this.bookingForm.valid){
      console.log('New Booking', this.bookingForm.value);

      this.showNewBookingForm = false;
      this.bookingForm.reset({guests:1});
      
    } else {
      this.markFormGroupTouched();
    }
  }
}
