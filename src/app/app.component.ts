import { Component } from "@angular/core";
import { ScreenSizeService } from "./screen-size.service";
import { Subscription } from "rxjs";
import { ProductService } from "./core/services/product.service";
import { Store } from "./models/product.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "backoffice-store-online";
  isSidebarOpen = true;
  store: Store;

  isMobile: boolean = false;
  nomeImpiegato: string;

  private _screenSizeSubscription: Subscription;

  constructor(
    private _screenSizeService: ScreenSizeService,
    private _productService: ProductService) { }


  async ngOnInit() {
    this._screenSizeSubscription = this._screenSizeService.screenWidth$.subscribe(width => {
      this.isMobile = this._screenSizeService.isMobile();
      this.isSidebarOpen = this.isMobile === false;
    });

    this._productService.idStore$.subscribe(async idStore => {
      this.store = await this._productService.getMyStore(idStore).toPromise();
    });
  }

  public selectEmployee(nomeImpiegato: string) {
    this.nomeImpiegato = nomeImpiegato;
  }
}
