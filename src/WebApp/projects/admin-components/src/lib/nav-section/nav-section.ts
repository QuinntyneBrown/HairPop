import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-nav-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-section.html',
  styleUrl: './nav-section.scss',
})
export class NavSection {
  @Input() title: string = '';
}
