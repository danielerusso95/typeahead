import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, EMPTY, map, switchMap, tap } from 'rxjs';
import { arrayName } from './mockName';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  filteredOptions:any = [];
  myControl:FormControl= new FormControl('');

  myArray = arrayName;

  constructor(private http:HttpClient){

  }

  ngOnInit(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      switchMap((value) => {
        if(value.length>4)
          return this._filter(value)
        else return [];
      }),
      tap(val=>console.log(val))
    );
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.http.get<any>('https://comuni-ita.herokuapp.com/api/comuni/'+filterValue).pipe(
      map((res: string[]) => {
        if (res) {
          return res;
        } else {
          return [];
        }
      }),
      catchError(err => {
          // report error to user
          console.log(err);
          // Important: stop observable from emitting anything
          return EMPTY;
      })
    );
  }

  value(){

  }
}
