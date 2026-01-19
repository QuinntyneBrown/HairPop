import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ActivityType = 'success' | 'warning' | 'info' | 'error';

@Component({
  selector: 'lib-activity-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-item.html',
  styleUrl: './activity-item.scss',
})
export class ActivityItem {
  @Input() icon: string = '';
  @Input() type: ActivityType = 'info';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() timestamp: string = '';
}
