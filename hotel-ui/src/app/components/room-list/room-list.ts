import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { Room } from '../../models/room';
import { Booking } from '../../models/booking';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-list.html',
  styleUrl: './room-list.css',
  animations: [
    // 1. Room Availability Animation (State-based)
    trigger('roomAvailability', [
      state('available', style({
        backgroundColor: '#f0fdf4',
        borderColor: '#22c55e',
        transform: 'scale(1)'
      })),
      state('booked', style({
        backgroundColor: '#fef2f2',
        borderColor: '#ef4444',
        transform: 'scale(0.98)'
      })),
      transition('available <=> booked', [
        animate('300ms ease-in-out')
      ])
    ]),

    // 2. Room Booking Process Animation (Multi-step)
    trigger('bookingProcess', [
      state('selecting', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      state('booking', style({
        transform: 'translateY(-10px)',
        opacity: 0.8,
        backgroundColor: '#fef3c7'
      })),
      state('confirmed', style({
        transform: 'scale(1.05)',
        backgroundColor: '#d1fae5',
        boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)'
      })),
      transition('selecting => booking', animate('200ms ease-out')),
      transition('booking => confirmed', animate('400ms ease-in')),
      transition('confirmed => selecting', animate('300ms ease-out'))
    ]),

    // 3. Room Cards Entrance Animation (List animation)
    trigger('roomsEnter', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ 
              opacity: 1, 
              transform: 'translateY(0)' 
            }))
          ])
        ], { optional: true })
      ])
    ]),

    // 4. Price Change Animation (Hotel pricing updates)
    trigger('priceUpdate', [
      transition(':increment', [
        style({ color: '#ef4444', transform: 'scale(1.1)' }),
        animate('600ms ease-out', style({ color: '*', transform: 'scale(1)' }))
      ]),
      transition(':decrement', [
        style({ color: '#22c55e', transform: 'scale(1.1)' }),
        animate('600ms ease-out', style({ color: '*', transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class RoomList{
  showAvailableOnly = false;
  selectedView = 'grid';
  sortBy = 'name';
  
  rooms: Room[] = [
    {
      id: '1',
      name: 'Ocean Breeze Suite',
      type: 'Suite',
      price: 450,
      available: true,
      image: 'https://via.placeholder.com/400x300',
      amenities: ['Ocean View', 'Balcony', 'Mini Bar', 'WiFi', 'Room Service'],
      rating: 4.9,
      description: 'Luxurious suite with panoramic ocean views'
    },
    {
      id: '2',
      name: 'Garden Villa',
      type: 'Villa',
      price: 320,
      available: false,
      image: 'https://via.placeholder.com/400x300',
      amenities: ['Garden View', 'Private Patio', 'Kitchenette', 'WiFi'],
      rating: 4.7,
      description: 'Peaceful villa surrounded by gardens'
    },
    {
      id: '3',
      name: 'City Center Standard',
      type: 'Standard',
      price: 180,
      available: true,
      image: 'https://via.placeholder.com/400x300',
      amenities: ['City View', 'WiFi', 'TV', 'Air Conditioning'],
      rating: 4.3,
      description: 'Modern room in the heart of the city'
    },
    {
      id: '4',
      name: 'Penthouse Royal',
      type: 'Penthouse',
      price: 800,
      available: true,
      image: 'https://via.placeholder.com/400x300',
      amenities: ['360° View', 'Private Elevator', 'Butler Service', 'Jacuzzi', 'Wine Cellar'],
      rating: 5.0,
      description: 'Ultimate luxury penthouse experience'
    }
  ];

  bookings: Booking[] = [
    {
      id: '1',
      guestName: 'John Doe',
      roomId: '2',
      checkIn: '2025-06-20',
      checkOut: '2025-06-25',
      guests: 2,
      status: 'confirmed',
      totalAmount: 1600
    },
    {
      id: '2',
      guestName: 'Jane Smith',
      roomId: '1',
      checkIn: '2025-06-18',
      checkOut: '2025-06-22',
      guests: 1,
      status: 'pending',
      totalAmount: 1800
    }
  ];

  viewOptions = [
    { value: 'grid', label: 'Grid View' },
    { value: 'list', label: 'List View' },
    { value: 'table', label: 'Table View' }
  ];

  sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
    { value: 'type', label: 'Type' }
  ];

  // Animation state properties
  roomAnimationStates: { [key: string]: string } = {};
  bookingStates: { [key: string]: 'selecting' | 'booking' | 'confirmed' } = {};
  
  constructor() {
    // Initialize animation states
    this.rooms.forEach(room => {
      this.roomAnimationStates[room.id] = room.available ? 'available' : 'booked';
      this.bookingStates[room.id] = 'selecting';
    });
  }

  getFilteredRooms(): Room[] {
    let filtered = this.rooms;
    
    if (this.showAvailableOnly) {
      filtered = filtered.filter(room => room.available);
    }
    
    // Sort rooms
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });
    
    return filtered;
  }

  getRoomStatusBadgeClasses(available: boolean): string {
    return available 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }

  getPriceRangeClass(price: number): string {
    if (price < 200) return 'text-green-600 bg-green-50';
    if (price < 400) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  }
   trackByRoomId(index: number, room: any): any {
    return room.id;
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    
    if (hasHalfStar) {
      stars.push('half');
    }
    
    while (stars.length < 5) {
      stars.push('empty');
    }
    
    return stars;
  }

  getBookingForRoom(roomId: string): Booking | undefined {
    return this.bookings.find(booking => booking.roomId === roomId);
  }

  // Animation Demo Methods
  toggleRoomAvailability(roomId: string): void {
    const room = this.rooms.find(r => r.id === roomId);
    if (room) {
      room.available = !room.available;
      this.roomAnimationStates[roomId] = room.available ? 'available' : 'booked';
      console.log('🎬 Room availability animation triggered');
    }
  }

  simulateBooking(roomId: string): void {
    console.log('🎬 Booking process animation started');
    
    // Step 1: Booking state
    this.bookingStates[roomId] = 'booking';
    
    // Step 2: Confirmed state after delay
    setTimeout(() => {
      this.bookingStates[roomId] = 'confirmed';
      
      // Step 3: Reset after showing confirmation
      setTimeout(() => {
        this.bookingStates[roomId] = 'selecting';
        this.toggleRoomAvailability(roomId); // Make it unavailable
      }, 2000);
    }, 1000);
  }

  updateRoomPrice(roomId: string, increase: boolean): void {
    const room = this.rooms.find(r => r.id === roomId);
    if (room && room.price) {
      const oldPrice = room.price;
      room.price = increase ? room.price + 50 : Math.max(100, room.price - 50);
      console.log('🎬 Price animation:', oldPrice, '->', room.price);
    }
  }

  // Animation event handlers
  onAnimationDone(event: any, roomId: number): void {
    console.log('🎬 Animation completed:', event.triggerName, 'for room', roomId);
  }
}