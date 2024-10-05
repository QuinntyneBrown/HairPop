import { Component, Input } from '@angular/core';

@Component({
  selector: 'hp-braider',
  standalone: true,
  imports: [],
  templateUrl: './braider.component.html',
  styleUrl: './braider.component.scss'
})
export class BraiderComponent {
  @Input() profileImageUrl: string = null!;

  @Input() profileName: string = null!;
}
