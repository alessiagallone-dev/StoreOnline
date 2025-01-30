import { DashboardComponent } from './features/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { ChartComponent } from './features/chart/chart.component';
import { ProductsListComponent } from './features/products-list/products-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'product-list', component: ProductsListComponent },
  { path: 'product-list/:viewType', component: ProductsListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'statistics', component: ChartComponent },
  { path: '**', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
