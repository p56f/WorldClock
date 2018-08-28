import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private _currentTime: string;

  get currentTime() {
    return this._currentTime;
  }

  ngOnInit(): void {
    setInterval(() => {this._currentTime = new Date().toLocaleTimeString()}, 1000);
  }
}
