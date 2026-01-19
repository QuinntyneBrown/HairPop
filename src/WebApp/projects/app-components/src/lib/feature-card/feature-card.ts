import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-feature-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-card.html',
  styleUrl: './feature-card.scss',
})
export class FeatureCard {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
}
