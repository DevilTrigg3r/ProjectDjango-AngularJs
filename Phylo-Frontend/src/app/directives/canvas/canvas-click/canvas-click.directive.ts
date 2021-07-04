import { Directive, HostListener, ViewChild, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCanvasClick]'
})
export class CanvasClickDirective {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  constructor() { }
  @HostListener('click', ['$event']) onClick(e) {
    console.log('click: ' + e.offsetX + '/' + e.offsetY);
    console.log(this.canvas);
  } 

}
