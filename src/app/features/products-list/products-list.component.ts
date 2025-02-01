import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { Product, ViewType } from 'src/app/models/product.model';
import { MatDialog, PageEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DialogData, ModalComponent } from 'src/app/shared/modal/modal.component';
import { ScreenSizeService } from 'src/app/screen-size.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  @Input() hasTitle = true;
  @Input() pageSize = 8;
  @Input() typeView = ViewType.Panel;
  isLoading = false;
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  totalProducts = 0;
  currentPage = 0;
  pageSizeOptions = [8, 16, 32];
  displayedColumns: string[] = ['category', 'title', 'description', 'price', 'azioni'];

  isMobile: boolean = false;
  private _screenSizeSubscription: Subscription;

  prodottoToDelete: any;

  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService,
    private _dialog: MatDialog,
    private _screenSizeService: ScreenSizeService
  ) { }

  ngOnInit() {

    this._screenSizeSubscription = this._screenSizeService.screenWidth$.subscribe(width => {
      this.isMobile = this._screenSizeService.isMobile();
    });

    const viewTypeParam = this.route.snapshot.paramMap.get("viewType");
    if (viewTypeParam) {
      this.typeView = viewTypeParam === '1' ? ViewType.Grid : ViewType.Panel;

    }
    this.loadProducts();
  }

  loadProducts(page: number = 1, elements: number = 100) {
    page = page === 0 ? 1 : page;
    this._productService.getProducts(page, elements).subscribe((products) => {
      if (products && products.length > 0) {
        this.products = products.list;
        this.paginatedProducts = this.products.slice(0, this.pageSize);
        this.totalProducts = products.length;
        this.pageSizeOptions = [8, 16, 32, this.totalProducts];
      }
      this.isLoading = false;
      delete this.prodottoToDelete;
    });
  }

  deleteProdotto(prodottoDaCancellare: any) {
    this.prodottoToDelete = prodottoDaCancellare;

    const dialogRef = this._dialog.open<ModalComponent, DialogData, any>(ModalComponent, {
      data: {
        message: `Sei sicuro di voler procedere alla cancellazione di <br />
                  <strong class="d-flex justify-content-center py-3">${prodottoDaCancellare.data.title}</strong>`,
        title: 'Conferma Cancellazione',
        cancelText: 'No',
        confirmText: 'Si'
      },
      panelClass: 'info'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.prodottoToDelete && this.prodottoToDelete.id) {
          this.isLoading = true;
          this._productService.deleteProduct(this.prodottoToDelete.id).subscribe(
            complete => this.loadProducts(),
            error => this.openModaleErrore(this.prodottoToDelete.data && this.prodottoToDelete.data.title || 'Prodotto non trovato')
          );
        } else {
          this.openModaleErrore(this.prodottoToDelete.data && this.prodottoToDelete.data.title || 'Prodotto non trovato');
        }
      } else {
        delete this.prodottoToDelete;
        this.isLoading = false;
      }
    });
  }


  openModaleErrore(titolo: string) {
    this.isLoading = false;
    this._dialog.open<ModalComponent, DialogData, any>(ModalComponent, {
      data: {
        message: `Non è possibile cancellare <br />
                  <strong class="d-flex justify-content-center">${titolo}</strong>
                  Riprovare più tardi.`,
        title: 'Attenzione'
      },
      panelClass: 'error'
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.paginate();
  }

  paginate() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }


  toggleView(view: ViewType) {
    this.typeView = view;
  }
}
