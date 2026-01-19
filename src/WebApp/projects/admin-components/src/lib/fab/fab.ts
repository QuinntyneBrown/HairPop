import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FabSize = 'mini' | 'default';
export type FabColor = 'primary' | 'accent' | 'warn';

@Component({
  selector: 'lib-fab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fab.html',
  styleUrl: './fab.scss',
})
export class Fab {
  @Input() icon: string = '&#10010;';
  @Input() size: FabSize = 'default';
  @Input() color: FabColor = 'accent';
  @Input() disabled: boolean = false;
  @Input() ariaLabel: string = 'Action';
  @Output() fabClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.fabClick.emit();
    }
  }
}
