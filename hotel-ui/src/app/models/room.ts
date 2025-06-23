export interface Room {
    id: string;
    name:string;
    type:string;
    price:number;
    available:boolean;
    image: string;
    amenities: string[];
    rating: number;
    description:string;
    status?: string;
    number?:string;
    guest?: string;
}
