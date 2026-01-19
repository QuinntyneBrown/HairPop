import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() logoSrc: string = '';
  @Input() logoAlt: string = 'HairPop';
  @Input() navLinks: NavLink[] = [];
  @Input() showMobileMenu: boolean = false;
  @Output() menuToggle = new EventEmitter<void>();
  @Output() linkClick = new EventEmitter<NavLink>();

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onLinkClick(link: NavLink): void {
    this.linkClick.emit(link);
  }
}
