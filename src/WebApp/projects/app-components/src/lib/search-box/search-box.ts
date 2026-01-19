import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-box.html',
  styleUrl: './search-box.scss',
})
export class SearchBox {
  @Input() placeholder: string = 'Search for braiders near you...';
  @Input() buttonText: string = 'Search';
  @Input() value: string = '';
  @Output() search = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();

  onSearch(): void {
    this.search.emit(this.value);
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.valueChange.emit(this.value);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
