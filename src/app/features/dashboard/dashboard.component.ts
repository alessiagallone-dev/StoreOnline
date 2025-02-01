import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScreenSizeService } from 'src/app/screen-size.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  isMobile: boolean = false;
  private _screenSizeSubscription: Subscription;

  constructor(private _screenSizeService: ScreenSizeService) { }
  ngOnInit(): void {
    this._screenSizeSubscription = this._screenSizeService.screenWidth$.subscribe(width => {
      this.isMobile = this._screenSizeService.isMobile();
    });
  }



}
