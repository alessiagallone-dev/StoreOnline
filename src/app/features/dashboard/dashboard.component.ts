import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { Product } from 'src/app/models/product.model';
import { MatDialog, PageEvent } from '@angular/material';
import { InfoModalComponent } from 'src/app/shared/modals/info-modal/info-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  isGridView = false;
  totalProducts = 0;
  pageSize = 4;
  currentPage = 0;
  pageSizeOptions = [4, 8, 16];
  displayedColumns: string[] = ['category', 'title', 'description', 'price', 'azioni'];

  prodottoToDelete: any;

  constructor(
    private _productService: ProductService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this._productService.getProducts().subscribe((products) => {
      if (products && products.length > 0) {
        this.products = products.list;
        this.paginatedProducts = this.products.slice(0, this.pageSize);
        this.totalProducts = products.length;
        this.pageSizeOptions = [4, 8, 16, this.totalProducts];
        console.log(this.paginatedProducts);
      }
    });
  }

  deleteProdotto(prodottoDaCancellare: any) {
    this.prodottoToDelete = prodottoDaCancellare;
    const dialogRef = this._dialog.open(InfoModalComponent, {
      data: {
        message: `Sei sicuro di voler procedere alla cancellazione di <br />
        <strong>${prodottoDaCancellare.data.title}</strong>?`
      }
    }).afterClosed().subscribe(async result => {
      if (result) {
        await this._productService.deleteProduct(this.prodottoToDelete.id).toPromise();
        delete this.prodottoToDelete;
        this.loadProducts();
      } else {
        delete this.prodottoToDelete;
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

  editProduct(id: string) {
    this._productService.getProductById(id).subscribe(() => { });
  }

  toggleView() {
    this.isGridView = !this.isGridView;
  }
}
