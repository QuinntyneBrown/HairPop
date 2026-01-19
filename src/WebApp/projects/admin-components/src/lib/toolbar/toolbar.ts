import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar {
  @Input() title: string = 'HairPop Admin';
  @Input() showMenuButton: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() avatarInitials: string = 'AD';
  @Output() menuClick = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  searchValue: string = '';

  onMenuClick(): void {
    this.menuClick.emit();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search.emit(input.value);
  }
}
