import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatCardVariant = 'primary' | 'success' | 'warning' | 'accent';
export type TrendDirection = 'up' | 'down' | 'neutral';

@Component({
  selector: 'lib-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
})
export class StatCard {
  @Input() value: string = '0';
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() variant: StatCardVariant = 'primary';
  @Input() trend: string = '';
  @Input() trendDirection: TrendDirection = 'neutral';
}
