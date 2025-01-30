import { Component, OnInit } from '@angular/core';
import { ProductService } from './../../core/services/product.service';
import { ChartDataSets } from 'chart.js';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  chartData: any;
  chartOptions: any;
  chartLabels: string[] = [];
  chartDataset: number[] = [];

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

  constructor(private productService: ProductService) { }

  async ngOnInit() {
    this.loadChartData();
  }

  loadChartData() {
    this.productService.getStatisticheCategoria().subscribe(statistiche => {
      const categoryData: { [key: string]: number } = {};
      for (const statistica of statistiche) {
        categoryData[statistica.category] = statistica.numberOfProducts;
      }

      var ctx = document.getElementById('myChart') as HTMLCanvasElement;
      var myChart = new Chart(ctx, {
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
          }
        }
      });
    });
  }
}
