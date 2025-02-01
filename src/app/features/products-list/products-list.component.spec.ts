import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsListComponent } from './products-list.component';
import { ProductService } from '../../core/services/product.service';
import { MatDialog, PageEvent } from '@angular/material';
import { ScreenSizeService } from 'src/app/screen-size.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let screenSizeService: jasmine.SpyObj<ScreenSizeService>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'deleteProduct']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const screenSizeServiceSpy = jasmine.createSpyObj('ScreenSizeService', ['screenWidth$', 'isMobile']);

    // Mock del servizio screenSizeService
    screenSizeServiceSpy.screenWidth$ = of(1024);  // simuliamo una larghezza desktop
    screenSizeServiceSpy.isMobile.and.returnValue(false);  // simuliamo che non sia mobile

    await TestBed.configureTestingModule({
      declarations: [ProductsListComponent],
      imports: [HttpClientTestingModule],  // Importa il modulo per le chiamate HTTP di test
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ScreenSizeService, useValue: screenSizeServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } }  // Simula un ActivatedRoute senza parametri
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]  // Per ignorare gli errori relativi ai componenti esterni non dichiarati
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    // productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    // dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    // screenSizeService = TestBed.inject(ScreenSizeService) as jasmine.SpyObj<ScreenSizeService>;
    // activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

});
