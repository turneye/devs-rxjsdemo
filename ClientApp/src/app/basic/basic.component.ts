import { Component, OnInit } from '@angular/core';
import { EverythingService, ToDoItem, User } from '../everything.service';

import { Observable, Subject, of } from 'rxjs';
import { filter, reduce, switchMap, tap, take, mergeMap, mergeAll, toArray, map } from 'rxjs/operators';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})
export class BasicComponent implements OnInit {
  items$: Observable<ToDoItem[]>;
  totals$: Observable<Totals>;
  total: Totals = { total: 0, complete: 0};


  searchTerm$ = new Subject<string>();
  users$: Observable<User[]>;

  constructor(public service: EverythingService) {}

  ngOnInit() {
    this.items$ = this.service.getItems();
    this.items$.subscribe(val => this.totals$ = of(val).pipe(mergeAll(), reduce((tot: Totals, itm: ToDoItem) => {
      return {
        total: tot.total += 1,
        complete: tot.complete += (itm.done ? 1 : 0)
      };
    }, { total: 0, complete: 0 })));


    // USERS
    // 1 - basic
    // this.users$ = this.service.getUsers();

    // 2 - just give me the top 3. take
    // this.users$ = this.service.getUsers().pipe(take(3));  // hmmm ..... why doesn't this work??
    // this.users$ = this.service.getUsers().pipe(mergeAll(), take(3), toArray()); // .subscribe(val => console.log('Next: ' + val.name));

    // 3 - searching with debounce, etc
    this.users$ = this.service.searchUsers(this.searchTerm$);
  }

  totalItems() {}
  itemsComplete() {}

  newItem() {
    this.service.addItem('Item', 'Description');
  }

  // calcTotal() {
  //   this.items$
  //     .pipe(
  //       switchMap(data => data as ToDoItem[]),
  //       reduce((data: Totals, item: ToDoItem) => {
  //         data.complete += item.done ? 1 : 0;
  //         data.total += 1;
  //         console.log(data);
  //         return data;
  //       }, { total: 0, complete: 0})
  //     )
  //     .subscribe(data => {
  //       console.log(data);
  //       this.totals = data;
  //     });

  // }

  toggleItem(item: ToDoItem) {
    item.done = !item.done;
    this.service.updateItem(item);
  }
}

export class Totals {
  public total: number;
  public complete: number;
}
