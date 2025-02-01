import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  private screenWidthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(window.innerWidth);
  screenWidth$ = this.screenWidthSubject.asObservable();

  constructor() {
    window.addEventListener('resize', () => {
      this.screenWidthSubject.next(window.innerWidth);
    });
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}