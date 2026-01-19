import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  header: string;
  width?: string;
}

@Component({
  selector: 'lib-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {
  @Input() columns: TableColumn[] = [];
  @Input() data: Record<string, unknown>[] = [];
  @Input() selectable: boolean = false;
  @Output() rowClick = new EventEmitter<Record<string, unknown>>();

  selectedRows: Set<number> = new Set();

  onRowClick(row: Record<string, unknown>, index: number): void {
    this.rowClick.emit(row);
  }

  toggleRow(index: number, event: Event): void {
    event.stopPropagation();
    if (this.selectedRows.has(index)) {
      this.selectedRows.delete(index);
    } else {
      this.selectedRows.add(index);
    }
  }

  isSelected(index: number): boolean {
    return this.selectedRows.has(index);
  }

  getCellValue(row: Record<string, unknown>, key: string): unknown {
    return row[key];
  }
}
