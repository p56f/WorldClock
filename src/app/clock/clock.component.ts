import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { faPencilAlt, faBan, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';

import * as moment from 'moment-timezone';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {

  private _clockCanvas: ElementRef;

  private _index: number;

  private _size: number;

  private _timeZoneId: string;

  private _editedTimeZoneId: string;

  private _now: moment.Moment;

  private _editMode = false;

  private _alert = false;

  @ViewChild('clockCanvas')
  set clockCanvas(clockCanvas: ElementRef) {
    this._clockCanvas = clockCanvas;
  }

  get clockCanvas() {
    return this._clockCanvas;
  }

  @Input()
  set index(index: number) {
    this._index = index;
  }

  get index() {
    return this._index;
  }

  @Input()
  set size(size: number) {
    this._size = size;
  }

  get size() {
    return this._size;
  }

  @Input()
  set timeZoneId(timeZoneId: string) {
    this._timeZoneId = timeZoneId;
  }

  get timeZoneId() {
    return this._timeZoneId;
  }

  set editedTimeZoneId(editedTimeZoneId: string) {
    this._editedTimeZoneId = editedTimeZoneId;
  }

  get editedTimeZoneId() {
    return this._editedTimeZoneId;
  }

  get currentDate() {
    return (this._now) ? this._now.format('DD.MM.YYYY HH:mm:ss') : undefined;
  }

  get editIcon() {
    return faPencilAlt;
  }

  get okIcon() {
    return faCheckCircle;
  }

  get cancelIcon() {
    return faBan;
  }

  get editMode() {
    return this._editMode;
  }

  get alert() {
    return this._alert;
  }

  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    const clockCanvasElem: HTMLCanvasElement  = this._clockCanvas.nativeElement;
    const context = clockCanvasElem.getContext('2d');

    setInterval(() => this.drawClock(clockCanvasElem, context), 1000);
  }

  edit() {
    this._editedTimeZoneId = this._timeZoneId;
    this._editMode = true;
  }

  changeTimeZone() {
    const allTimeZones = moment.tz.names();
    if (allTimeZones.indexOf(this._editedTimeZoneId) > -1) {
      this._timeZoneId = this._editedTimeZoneId;
      this.saveToCookie('clocks', this._timeZoneId); 
    } else {
      this._alert = true;
      setTimeout(() => this.closeAlert(), 5000);
    }
    this._editMode = false;
  }

  cancel() {
    this._editMode = false;
  }

  closeAlert() {
    this._alert = false;
  }

  search(text$: Observable<string>) {
    const allTimeZones = moment.tz.names();
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(txt => txt.length < 2 ? []
        : allTimeZones.filter(v => v.toLowerCase().indexOf(txt.toLowerCase()) > -1).slice(0, 10)));
  }

  private saveToCookie(name: string, tz: string) {
    const clocksCookieExists = this.cookieService.check(name);
    if (clocksCookieExists) {
      const timeZones = this.cookieService.get(name).split(',');
      timeZones[this._index] = tz;
      this.cookieService.set(name, timeZones.join(), 7);
    }
  }

  private drawClock(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    const width = canvas.width;
    const height = canvas.height;
    const radius = 0.9 * (height / 2);
    
    context.clearRect(0, 0, width, height);
    context.translate(width / 2, height / 2);
    
    context.beginPath();
    context.arc(0, 0, radius, 0, 2 * Math.PI);
    context.stroke();
    
    this.drawNumbers(context, radius);
    
    this._now = moment().tz(this._timeZoneId);
    const hours = this._now.hours();
    const minutes = this._now.minutes();
    const seconds = this._now.seconds();
    
    const hoursAngle = (hours % 12) * Math.PI / 6 + minutes * Math.PI / (60 * 6) + seconds * Math.PI / (60 * 60 * 6);
    const minutesAngle = minutes * Math.PI / 30 + seconds * Math.PI / (60 * 30);
    const secondsAngle = seconds * Math.PI / 30;
    
    this.drawHand(context, hoursAngle, radius * 0.6 , radius * 0.05);
    this.drawHand(context, minutesAngle, radius * 0.8, radius * 0.05);
    this.drawHand(context, secondsAngle, radius * 0.8, radius * 0.02);
    
    context.translate(-width / 2, -height / 2);
  }
  
  private drawNumbers(context: CanvasRenderingContext2D, radius: number) {
    context.font = radius * 0.15 + 'px arial';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    
    let ang;
    for (let i = 1; i <= 12; i++) {
      ang = i * Math.PI / 6;
      context.rotate(ang);
      context.translate(0, -radius * 0.85);
      context.rotate(-ang);
      context.fillText(i.toString(), 0, 0);
      context.rotate(ang);
      context.translate(0, radius * 0.85);
      context.rotate(-ang); 
    }
  }
  
  private drawHand(context: CanvasRenderingContext2D, pos: number, lenght: number, width: number) {
    context.beginPath();
    context.lineWidth = width;
    context.lineCap = 'round';
    context.moveTo(0, 0);
    context.rotate(pos);
    context.lineTo(0, -lenght);
    context.stroke();
    context.rotate(-pos);
  }
}
