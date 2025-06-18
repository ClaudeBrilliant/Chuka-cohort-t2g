import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { interval, Subscription } from 'rxjs';

interface HotelStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  pendingCheckIns: number;
  pendingCheckOuts: number;
  revenue: number;
}

interface RecentActivity {
  id: string;
  type: 'checkin' | 'checkout' | 'booking' | 'cancellation';
  guestName: string;
  roomNumber: string;
  timestamp: Date;
  amount?: number;
}

@Component({
  selector: 'app-hotel-dashboard',
  imports: [CommonModule],
  templateUrl: './hotel-dashboard.html',
  styleUrl: './hotel-dashboard.css',
})
export class HotelDashboard implements OnInit, AfterViewInit {
@ViewChild('notificationBell') notificationBell!: ElementRef;

  currentTime = new Date();
  hotelStats: HotelStats | null = null;
  recentActivities: RecentActivity[] = [];
  notifications: string[] = [];
  notificationCount = 0;
  isLoadingStats = false;
  isLoadingActivities = false;

  private notificationSubscription?: Subscription;
  constructor() {
    console.log('[Constructor]: Hotel dashboard component class initialized');
    console.log('[Constructor]: Initialize base properties 1st');
    // this.loadHotelStats();
  }

  ngOnInit(): void {
      console.log('[OnInit] Test data loading');

      this.loadHotelStats();
      this.startRealTimeUpdates();
      
  }

ngAfterViewInit(): void {
    console.log('[AfterViewInit]: DOM Loaded awaiting updates....');

    if(this.notificationBell){
      this.notificationBell.nativeElement.style.transition = 'transform 0.3 ease'
    }
    
}
  private loadHotelStats(): void {
    this.isLoadingStats = true;
    console.log('Loading hotel stats, hang tight ....');

    setTimeout(() => {
      this.hotelStats = {
        totalRooms: 150,
        occupiedRooms: 127,
        availableRooms: 23,
        pendingCheckIns: 8,
        pendingCheckOuts: 12,
        revenue: 542280.2,
      };

      this.isLoadingStats = false;
      console.log("Hotel Stats Loaded");
      
    }, 1500);
          this.isLoadingStats = false;

    console.log('loading stats status', this.isLoadingStats);
    
  }

  getOccupancyPercentage(): number {
    if(!this.hotelStats) return 0;
    return Math.round((this.hotelStats.occupiedRooms/this.hotelStats.totalRooms)*100)
  }

  private generateNotifications(): void{
    const messages = [
      'New booking in room100',
      'Order placed',
      'Room cleaning requested',
      'Guest checked in'
    ]

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    this.notifications.unshift(randomMessage);
    this.notificationCount++;

    if(this.notifications.length>5) {
      this.notifications.pop();
    }

    console.log('New notification', randomMessage);
    
  }

  private startRealTimeUpdates(): void {
    this.notificationSubscription = interval(10000).subscribe(() =>{
      this.generateNotifications();
    })
  }
}
