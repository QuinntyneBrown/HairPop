import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-nav-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-item.html',
  styleUrl: './nav-item.scss',
})
export class NavItem {
  @Input() icon: string = '';
  @Input() text: string = '';
  @Input() active: boolean = false;
  @Output() itemClick = new EventEmitter<void>();

  onClick(): void {
    this.itemClick.emit();
  }
}
