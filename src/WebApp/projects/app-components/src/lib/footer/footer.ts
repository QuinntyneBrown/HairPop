import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  @Input() copyrightText: string = '';
  @Input() year: number = new Date().getFullYear();
  @Input() companyName: string = 'HairPop';
}
