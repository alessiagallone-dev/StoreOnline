import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Product, StatisticheList, StoreListItem, } from 'src/app/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl: string = 'https://techops-eurisit-fe-test.azurewebsites.net/api/stores';

  private idStoreSubject = new BehaviorSubject<string | null>('ijpxNJLM732vm8AeajMR');
  idStore$ = this.idStoreSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadMyStore();
  }

  private loadMyStore() {
    this.http.get<StoreListItem[]>(this.baseUrl)
      .pipe(map((stores) => {
        if (stores.length === 0) {
          throw new Error('No stores available');
        }
        return stores[0].id;
      })
      ).subscribe({
        next: (idStore) => this.idStoreSubject.next(idStore),
        error: (err) => console.error('Failed to set store ID', err),
      });
  }

  getAllStores(): Observable<StoreListItem[]> {
    return this.http.get<StoreListItem[]>(`${this.baseUrl}`);
  }

  getStatisticheCategoria(): Observable<StatisticheList[]> {
    return this.idStore$.pipe(
      filter((idStore): idStore is string => idStore !== null),
      switchMap((idStore) =>
        this.http.get<any>(`${this.baseUrl}/${idStore}/stats/categories`)
      )
    );
  }

  getProducts(page: number = 1, elements: number = 100): Observable<any> {
    return this.idStore$.pipe(
      filter((idStore): idStore is string => idStore !== null),
      switchMap((idStore) =>
        this.http.get<any>(
          `${this.baseUrl}/${idStore}/products?page=${page}&elements=${elements}`
        )
      )
    );
  }

  getProductById(idProduct: string): Observable<Product> {
    return this.idStore$.pipe(
      switchMap((idStore) => {
        if (!idStore) {
          throw new Error('Store ID is not set yet');
        }
        return this.http.get<Product>(
          `${this.baseUrl}/${idStore}/products/${idProduct}`
        );
      })
    );
  }

  createProduct(product: Product): Observable<string> {
    return this.idStore$.pipe(
      switchMap((idStore) => {
        if (!idStore) {
          throw new Error('Store ID is not set yet');
        }
        return this.http.post<string>(`${this.baseUrl}/${idStore}/products`, product);
      })
    );
  }

  deleteProduct(productId: string): Observable<void> {
    return this.idStore$.pipe(
      switchMap((idStore) => {
        if (!idStore) {
          throw new Error('Store ID is not set yet');
        }
        return this.http.delete<void>(`${this.baseUrl}/${idStore}/products/${productId}`);
      })
    );
  }
}
