import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-braider-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './braider-card.html',
  styleUrl: './braider-card.scss',
})
export class BraiderCard {
  @Input() name: string = '';
  @Input() location: string = '';
  @Input() rating: number = 5;
  @Input() reviewCount: number = 0;
  @Input() bio: string = '';
  @Input() specialties: string[] = [];
  @Input() imageUrl: string = '';
  @Input() initials: string = '';
  @Output() viewProfile = new EventEmitter<void>();

  get stars(): string {
    return '⭐'.repeat(Math.round(this.rating));
  }

  onViewProfile(): void {
    this.viewProfile.emit();
  }
}
