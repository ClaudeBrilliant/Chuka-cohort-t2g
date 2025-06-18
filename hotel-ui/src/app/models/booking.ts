export interface Booking {
    id:string;
    guestName: string;
    roomId:string;
    checkIn:string;
    checkOut: string;
    guests: number;
    status: 'confirmed' | 'pending' | 'cancelled';
    totalAmount: number;
}
