import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexStroke,
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { DataGrowthChartComponent } from './data-growth-chart/data-growth-chart';
import { RevenueChartComponent } from './revenue-chart/revenue-chart';
import { DataTableComponent } from './data-table/data-table';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  stroke: ApexStroke;
  grid: ApexGrid;
};

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  subtitle: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],

  imports: [
    CommonModule,
    HlmButtonImports,
    HlmInputImports,
    NgApexchartsModule,
    DataGrowthChartComponent,
    RevenueChartComponent,
    DataTableComponent,
  ],
})
export class DashboardComponent {
  public chartOptions: any;

  stats: Stat[] = [
    {
      title: 'Total Revenue',
      value: '$1,200,000',
      change: '+18%',
      trend: 'up',
      subtitle: 'Compared to last year',
    },
    {
      title: 'Active Users',
      value: '2500',
      change: '+5%',
      trend: 'up',
      subtitle: 'Compared to last month',
    },
    {
      title: 'Conversion Rate',
      value: '4.2%',
      change: '+0.3%',
      trend: 'up',
      subtitle: 'Compared to last month',
    },
    {
      title: 'New Signups',
      value: '8200',
      change: '-5.3%',
      trend: 'down',
      subtitle: 'Compared to last month',
    },
  ];

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
