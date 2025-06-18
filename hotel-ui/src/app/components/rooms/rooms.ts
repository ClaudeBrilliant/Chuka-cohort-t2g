import { Component } from '@angular/core';
import { Room } from '../../models/room';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rooms',
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css'
})
export class Rooms {
  hotelName = 'The Grand';
  currentDate = new Date();
  isHotelOpen = true;
  guestCount = 0;
  searchTerm = '';
  selectedRoomType = '';
  
  rooms: Room[] = [
    {
      id: '1',
      name: 'Beach Front View',
      type: 'En Suite',
      price: 25000,
      available: true,
      image: 'https://thumbs.dreamstime.com/b/beach-front-holiday-view-africa-use-as-background-image-beach-front-holiday-view-africa-155608942.jpg',
      amenities: ['WiFi', 'Air Conditioning', 'Mini Bar', 'Ocean View'],
      rating: 4.5,
      description: 'Clean Self contained room with a view of the expansive ocean'
    },
    {
      id: '2',
      name: 'Presidential Suite',
      type: 'Master En Suite',
      price: 45000,
      available: true,
      image: 'image.jpeg',
      amenities: ['WiFi', 'Air Conditioning', 'Mini Bar', 'Ocean View', 'Room Service', 'Personal Pool'],
      rating: 4.5,
      description: 'Clean Self contained luxurious room with a view of the expansive ocean'
    },
    {
      id: '3',
      name: 'Standard Room',
      type: 'Suite',
      price: 20000,
      available: true,
      image: 'image.jpeg',
      amenities: ['WiFi', 'Air Conditioning', 'Mini Bar'],
      rating: 4.5,
      description: 'Clean Self contained standard room with a view of the expansive ocean'
    }
  ];

  roomTypes = ['All', 'En Suite', 'Master En Suite', 'Suite'];


  toggleHotelStatus():void {
    this.isHotelOpen = !this.isHotelOpen;
  }

  toggleStatus(): void{
    if(this.rooms.length <= 0) {
      this.isHotelOpen=false;
    }
  }
   onBookRoom(roomId: string): void {
    const room = this.rooms.find(r => r.id === roomId);
    if (room) {
      alert(`Booking room: ${room.name}`);
      room.available = false;
    }
  }

  onGuestCountChange(count: number): void {
    this.guestCount = count;
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    console.log('Searching for:', term);
  }

  onRoomTypeChange(type: string): void {
    this.selectedRoomType = type;
  }


  getRoomStatusClass(available: boolean): string {
    return available ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  }

  getFilteredRooms(): Room[] {
    let filtered = this.rooms;
    
    if (this.selectedRoomType && this.selectedRoomType !== 'All') {
      filtered = filtered.filter(room => room.type === this.selectedRoomType);
    }
    
    if (this.searchTerm) {
      filtered = filtered.filter(room => 
        room.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }


}
