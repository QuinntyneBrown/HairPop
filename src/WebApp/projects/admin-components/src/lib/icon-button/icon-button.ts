import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'lib-icon-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
})
export class IconButton {
  @Input() icon: string = '';
  @Input() size: IconButtonSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() ariaLabel: string = '';
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }
}
