import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private _timeZones: string[];

  get timeZones() {
    return this._timeZones;
  }

  ngOnInit(): void {
    this._timeZones = ['America/Los_Angeles', 'Atlantic/Reykjavik', 'Europe/Warsaw', 'Europe/Helsinki', 
      'Asia/Calcutta', 'Asia/Tokyo'];
  }
}
