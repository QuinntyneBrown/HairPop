import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-chip-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chip-filter.html',
  styleUrl: './chip-filter.scss',
})
export class ChipFilter {
  @Input() label: string = '';
  @Input() active: boolean = false;
  @Input() count: number | null = null;
  @Output() filterClick = new EventEmitter<void>();

  onClick(): void {
    this.filterClick.emit();
  }
}
