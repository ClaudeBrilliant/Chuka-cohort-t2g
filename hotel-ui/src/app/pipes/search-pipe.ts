import { Pipe, PipeTransform } from '@angular/core';
import { Room } from '../models/room';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(rooms: Room[], search:string): Room [] {
    if(!rooms || !search.trim()) return rooms;

    const term = search.trim().toLowerCase();

    return rooms.filter(room =>
      room.name?.toLocaleLowerCase().includes(term) ||
      room.type?.toLocaleLowerCase().includes(term) ||
      room.description.toLocaleLowerCase().includes(term)
    );
  }

}
