import { Component } from "@angular/core";
import { ScreenSizeService } from "./screen-size.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "backoffice-store-online";
  isSidebarOpen = true;

  isMobile: boolean = false;
  private _screenSizeSubscription: Subscription;

  constructor(private _screenSizeService: ScreenSizeService) { }


  ngOnInit() {
    this._screenSizeSubscription = this._screenSizeService.screenWidth$.subscribe(width => {
      this.isMobile = this._screenSizeService.isMobile();
      this.isSidebarOpen = this.isMobile === false;
    });
  }
}
