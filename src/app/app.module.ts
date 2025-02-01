import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ChartComponent } from './features/chart/chart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { MatPaginatorIntlIt } from './i18n/mat-paginator-intl-it';
import { ChartsModule } from 'ng2-charts';
import { ProductsListComponent } from './features/products-list/products-list.component';
import { TitleComponent } from './shared/title/title.component';
import { ModalComponent } from './shared/modal/modal.component';
import { ResponsiveClassDirective } from './responsive-class.directive';


registerLocaleData(localeIt);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProductsListComponent,
    ProductDetailComponent,
    ChartComponent,
    TitleComponent,
    ModalComponent,
    ResponsiveClassDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'it-IT' }, { provide: MatPaginatorIntl, useClass: MatPaginatorIntlIt }],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})
export class AppModule { }
