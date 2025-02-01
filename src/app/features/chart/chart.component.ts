import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from './../../core/services/product.service';
import { ChartDataSets } from 'chart.js';
import * as Chart from 'chart.js';
import { ScreenSizeService } from 'src/app/screen-size.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() hasTitle = true;
  chart: any;
  chartData: any;
  chartOptions: any;
  chartLabels: string[] = [];
  chartDataset: number[] = [];
  isMobile: boolean = false;
  private _screenSizeSubscription: Subscription;

  public polarAreaChartLabels: string[] = [];
  public polarAreaChartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Statistica Categoria Prodotti'
    }
  ];
  public polarAreaChartOptions = {
    responsive: true,
    scale: {
      ticks: {
        beginAtZero: true
      }
    }
  };

  constructor(
    private productService: ProductService,
    private _screenSizeService: ScreenSizeService) { }

  async ngOnInit() {
    this._screenSizeSubscription = this._screenSizeService.screenWidth$.subscribe(width => {
      this.isMobile = this._screenSizeService.isMobile();
    });

    this.initChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  initChart() {
    this.productService.getStatisticheCategoria().subscribe(statistiche => {
      const categoryData: { [key: string]: number } = {};
      for (const statistica of statistiche) {
        categoryData[statistica.category] = statistica.numberOfProducts;
      }

      var ctx = document.getElementById('chartCategorie') as HTMLCanvasElement;
      this.chart = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: Object.keys(categoryData),
          datasets: [{
            label: 'Statistiche Prodotti Categorie',
            data: Object.values(categoryData),
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 1)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 0.2)',
              'rgb(27, 33, 145)',
              'rgba(246, 29, 142, 1)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 1)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 0.2)',
              'rgb(27, 33, 145)',
              'rgba(246, 29, 142, 1)',
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          },
          legend: {
            display: this.hasTitle && !this.isMobile,
            position: 'left',
            align: 'start',
            fullWidth: true
          },
          layout: {
            padding: { left: this.isMobile ? 0 : 50, right: this.isMobile ? 0 : 50, top: 0, bottom: 0 }
          }
        }
      });
    });
  }
}
