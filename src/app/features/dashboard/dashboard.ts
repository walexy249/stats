import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';

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
  imports: [CommonModule, HlmButtonImports, HlmInputImports],
})
export class DashboardComponent {
  // Add component logic here

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
}
