import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {

  @ViewChild('clockCanvas')
  clockCanvas: ElementRef;

  @Input()
  width: number;

  @Input()
  height: number;

  constructor() { }

  ngOnInit() {
    const clockCanvasElem: HTMLCanvasElement  = this.clockCanvas.nativeElement;
    const context = clockCanvasElem.getContext('2d');

    setInterval(() => this.drawClock(clockCanvasElem, context), 1000);
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
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
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
