import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AppButtonVariant = 'primary' | 'secondary' | 'pill';
export type AppButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'lib-app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class AppButton {
  @Input() variant: AppButtonVariant = 'primary';
  @Input() size: AppButtonSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }

  get buttonClasses(): Record<string, boolean> {
    return {
      btn: true,
      [`btn--${this.variant}`]: true,
      [`btn--${this.size}`]: true,
      'btn--disabled': this.disabled,
      'btn--full-width': this.fullWidth,
    };
  }
}
