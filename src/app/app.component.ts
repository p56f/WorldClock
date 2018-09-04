import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private _timeZones: string[];

  private _cookiesInfo: boolean;

  get timeZones() {
    return this._timeZones;
  }

  get cookiesInfo() {
    return this._cookiesInfo;
  }

  constructor(private cookieService: CookieService) {}

  closeCookiesInfo() {
    this._cookiesInfo = false;
    this.cookieService.set('clocks', this._timeZones.join(), 7);
  }

  ngOnInit(): void {
    const clocksCookieExists = this.cookieService.check('clocks');
    this._cookiesInfo = !clocksCookieExists;
    this._timeZones = (clocksCookieExists) ? this.cookieService.get('clocks').split(',') : 
      this._timeZones = ['America/Los_Angeles', 'Atlantic/Reykjavik', 'Europe/Warsaw', 'Europe/Helsinki', 
        'Asia/Calcutta', 'Asia/Tokyo'];
  }
}
