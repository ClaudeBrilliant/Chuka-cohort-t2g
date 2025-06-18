import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Rooms } from "./components/rooms/rooms";
import { RoomList } from "./components/room-list/room-list";
import { HotelDashboard } from "./hotel-dashboard/hotel-dashboard";
import { BookingManagementComponent } from "./booking-management/booking-management";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Rooms, RoomList, HotelDashboard, BookingManagementComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'hotel-ui';
}
