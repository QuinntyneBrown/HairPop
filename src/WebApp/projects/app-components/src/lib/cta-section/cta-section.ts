import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-cta-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cta-section.html',
  styleUrl: './cta-section.scss',
})
export class CtaSection {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() buttonText: string = '';
  @Output() ctaClick = new EventEmitter<void>();

  onClick(): void {
    this.ctaClick.emit();
  }
}
