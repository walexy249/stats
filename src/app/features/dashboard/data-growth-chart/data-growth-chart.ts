import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  fill: ApexFill;
};

@Component({
  selector: 'app-data-growth-chart',
  templateUrl: './data-growth-chart.html',
  styleUrls: ['./data-growth-chart.css'],
  imports: [CommonModule, NgApexchartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGrowthChartComponent {
  public chartOptions: any;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Active Users',
          data: [480, 530, 420, 480, 430, 520, 470, 490, 460, 500, 530, 450],
        },
        {
          name: 'Revenue',
          data: [400, 460, 370, 420, 360, 450, 400, 420, 380, 430, 460, 390],
        },
      ],
      chart: {
        type: 'bar',
        height: 400,
        stacked: true,
        toolbar: { show: false },
      },
      colors: ['#2563EB', '#E5EDFF'],
      plotOptions: {
        bar: {
          columnWidth: '50%',
          borderRadius: 4,
        },
      },
      dataLabels: { enabled: false },
      stroke: {
        show: false,
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        labels: { style: { colors: '#6B7280' } },
      },
      yaxis: {
        title: { text: 'Volume' },
        labels: { style: { colors: '#6B7280' } },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
      },
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 4,
      },
      fill: {
        opacity: 1,
      },
    };
  }
}
