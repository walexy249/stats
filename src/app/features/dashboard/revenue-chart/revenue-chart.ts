import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexStroke,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  responsive: ApexResponsive[];
  labels: string[];
  colors: string[];
  legend: ApexLegend;
};

@Component({
  selector: 'app-revenue-chart',
  templateUrl: './revenue-chart.html',
  styleUrls: ['./revenue-chart.css'],
  imports: [CommonModule, NgApexchartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevenueChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: any;

  monthlyBudget = 1975.33;

  constructor() {
    this.chartOptions = {
      series: [20, 20, 20, 20, 20],
      chart: {
        type: 'donut',
        height: 280,
      },
      stroke: {
        show: false,
      },
      colors: ['#2463EB', '#1E3B8A', '#91C3FD', '#DCEBFE', '#61A6FA'],
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { height: 220 },
          },
        },
      ],
    };
  }
}
