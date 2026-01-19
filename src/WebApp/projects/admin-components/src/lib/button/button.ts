import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'stroked' | 'warn' | 'default';
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() icon: string = '';
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
    };
  }
}
