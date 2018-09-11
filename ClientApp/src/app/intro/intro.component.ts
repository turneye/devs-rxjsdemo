import { mergeAll, map, filter, groupBy, mergeMap, toArray, take, concat, merge, tap, zipAll } from 'rxjs/operators';
import { EverythingService } from './../everything.service';
import { Component, OnInit } from '@angular/core';
import { Observable, of, interval, zip } from 'rxjs';


@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {
  _logs = [];
  logs$: Observable<any> = of(this._logs);

  slowSource = interval(1000).pipe(map(val => 'Slow : ' + val), take(5));
  fasterSource = interval(500).pipe(map(val => 'Fast : ' + val), take(5));

  constructor(public service: EverythingService) { }

  ngOnInit() {
    // JSON DATA
    // this.service.getUsers()
    //   .pipe(
    //     mergeAll(),
    //     filter(u => u.website.endsWith('com')),
    //     tap(u => u.website = 'http://' + u.website),
    //     map(u => u.website)
    // )
    //   .subscribe(data => {
    //     this._logs.push(JSON.stringify(data));
    //   });
  
      // this.slowSource.pipe(zipAll(this.fasterSource)).subscribe(data => {
      //   this._logs.push(JSON.stringify(data));
      // });
  }

}


/*
  standard stuff
      
        filter(val => val.website.endsWith('com')),
        map(val => JSON.stringify({ n: val.name, w: val.website })))

  grouping results
        groupBy(usr => usr.website.substr(usr.website.length - 3, 3)),
        mergeMap(group => group.pipe(map(x => JSON.stringify(x.website)), toArray()))


  //merge
    this.slowSource.pipe(merge(this.fasterSource))
    .subscribe(data => {
      this._logs.push(data);
    });

    //concat
    this.slowSource.pipe(concat(this.fasterSource))
      .subscribe(data => {
        this._logs.push(data);
      });


*/

