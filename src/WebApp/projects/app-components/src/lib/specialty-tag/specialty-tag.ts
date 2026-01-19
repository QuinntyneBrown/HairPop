import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SpecialtyTagSize = 'small' | 'medium';

@Component({
  selector: 'lib-specialty-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './specialty-tag.html',
  styleUrl: './specialty-tag.scss',
})
export class SpecialtyTag {
  @Input() text: string = '';
  @Input() size: SpecialtyTagSize = 'medium';
}
