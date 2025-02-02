import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { Product, StatisticheList, StoreItem, } from 'src/app/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl: string = 'https://techops-eurisit-fe-test.azurewebsites.net/api/stores';

  private idStoreSubject = new BehaviorSubject<string>('ijpxNJLM732vm8AeajMR');
  idStore$ = this.idStoreSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadMyStore();
  }

  getMyStore(idStore: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${idStore}`).pipe(
      catchError(error => {
        this.handleError(error);
        return of(null);
      })
    );
  }

  getProducts(page: number = 1, elements: number = 100): Observable<any> {
    return this.ensureStoreId().pipe(
      switchMap((idStore) =>
        this.http.get<any>(`${this.baseUrl}/${idStore}/products?page=${page}&elements=${elements}`)
      )
    );
  }

  getProductById(idProduct: string): Observable<Product> {
    return this.ensureStoreId().pipe(
      switchMap((idStore) =>
        this.http.get<Product>(`${this.baseUrl}/${idStore}/products/${idProduct}`).pipe(
          catchError(error => {
            this.handleError(error);
            return of(null);
          })
        )
      )
    );
  }

  createProduct(product: Product): Observable<any> {
    return this.ensureStoreId().pipe(
      switchMap((idStore) =>
        this.http.post<any>(`${this.baseUrl}/${idStore}/products`, product, { responseType: 'text' as 'json' }).pipe(
          catchError((err) => {
            console.error('Errore durante la creazione del prodotto:', err);
            return throwError(() => new Error('Errore durante la creazione del prodotto'));
          })
        )
      )
    );
  }

  deleteProduct(productId: string): Observable<void> {
    return this.ensureStoreId().pipe(
      switchMap((idStore) => this.http.delete<void>(`${this.baseUrl}/${idStore}/products/${productId}`))
    );
  }

  getStatisticheCategoria(): Observable<StatisticheList[]> {
    return this.ensureStoreId().pipe(
      switchMap((idStore) => this.http.get<any>(`${this.baseUrl}/${idStore}/stats/categories`))
    );
  }

  private loadMyStore() {
    this.http.get<StoreItem[]>(this.baseUrl)
      .pipe(
        map((stores) => {
          if (stores.length === 0) {
            throw new Error('Non ci sono Negozi disponibili');
          }
          return stores[0].id;
        }),
        catchError((err) => {
          console.error('Caricamento Negozi Fallito', err);
          return of(null);
        })
      )
      .subscribe({
        next: (idStore) => {
          if (idStore) {
            this.idStoreSubject.next(idStore);
          } else {
            console.error('Nessun Id Negozio Disponibile');
          }
        },
        error: (err) => console.error('Errore caricamento Negozio', err),
      });
  }

  private ensureStoreId(): Observable<string> {
    return this.idStore$.pipe(
      filter((idStore): idStore is string => idStore !== null),
      take(1),
      catchError((err) => {
        console.error('ID Negozio non disponibile', err);
        throw new Error('ID Negozio non disponibile');
      })
    );
  }

  private handleError(error: any) {
    switch (error.code) {
      case 'PRODUCT_NOT_FOUND':
        console.error('Prodotto non trovato:', error.error.message);
        break;
      case 'STORE_NOT_FOUND':
        console.error('Negozio non trovato:', error.error.message);
        break;
      default:
        console.error('Errore:', error);
        break;
    }
  }
}
