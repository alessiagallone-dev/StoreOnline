import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { Product, ViewType } from 'src/app/models/product.model';
import { MatDialog, PageEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DialogData, ModalComponent } from 'src/app/shared/modal/modal.component';

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

  prodottoToDelete: any;

  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
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
        confirmText: 'Si',
        showConfirmBtn: true,
        showCancelBtn: true
      },
      panelClass: 'info'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this._productService.deleteProduct(this.prodottoToDelete.id).subscribe(
          resultDelete => {
            this.loadProducts();
            this.isLoading = false;
            delete this.prodottoToDelete;
          },
          error => {
            this.isLoading = false;
            const dialogRef = this._dialog.open<ModalComponent, DialogData, any>(ModalComponent, {
              data: {
                message: `Non è possibile cancellare <br />
                <strong class="d-flex justify-content-center py-3">${prodottoDaCancellare.data.title}</strong> <br/>
                Riprovare più tardi.`,
                title: 'Attenzione',
                confirmText: 'Chiudi',
                showConfirmBtn: true,
                showCancelBtn: false
              },
              panelClass: 'error'
            });
          });
      } else {
        delete this.prodottoToDelete;
        this.isLoading = false;
      }
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
