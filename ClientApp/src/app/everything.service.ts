import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, interval } from 'rxjs';
import {
  tap,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  filter,
  map,
  delay
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EverythingService {
  private _items: ToDoItem[] = [];
  private itemsAsObservable = of(this._items); // NOTE : Observable.of has just become of in rxjs 6
  private _obsItems: BehaviorSubject<ToDoItem[]> = new BehaviorSubject(
    this._items
  );

  constructor(public http: HttpClient) {}

  private id = 1;

  addItem(item: string, desc: string) {
    this._items.push({ title: item, description: desc, done: false, id: this.id });
    this.id++;
    this._obsItems.next(this._items);
  }
  updateItem(item: ToDoItem) {
    this._items.find(x => x.id === item.id).done = item.done;
    this._obsItems.next(this._items);
  }

  getItems() {
    return this._obsItems;
  }

  getUsers() {
    // force it to take 2 seconds
    return this.http.get<User[]>('https://jsonplaceholder.typicode.com/users') .pipe(delay(1000));
    // .pipe(delay(1000));
    // .pipe(tap(x => console.log(x)));
  }

  searchUsers(search: Observable<string>) {
    return search.pipe(
      switchMap(term =>
        this.getUsers().pipe(
          map(usr => usr.filter(x => x.name.indexOf(term) >= 0))
        )
      )
    );

    // WITH DEBOUNCE, DISTINCT
    // return search.pipe(
    //         debounceTime(500),
    //         distinctUntilChanged(),
    //         tap(val => console.log('searching for value : ' + val)),
    //         switchMap(term => this.getUsers().pipe(map(usr => usr.filter(x => x.name.indexOf(term) >= 0)))));
  }
}

export class User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export class Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export class Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export class Geo {
  lat: number;
  lng: number;
}
export class ToDoItem {
  public title: string;
  public description: string;
  public done: boolean;
  public id: number;
}
