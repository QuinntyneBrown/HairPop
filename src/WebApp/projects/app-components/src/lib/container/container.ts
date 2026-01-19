import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ContainerSize = 'small' | 'medium' | 'large' | 'full';

@Component({
  selector: 'lib-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './container.html',
  styleUrl: './container.scss',
})
export class Container {
  @Input() size: ContainerSize = 'large';
  @Input() centered: boolean = true;
}
