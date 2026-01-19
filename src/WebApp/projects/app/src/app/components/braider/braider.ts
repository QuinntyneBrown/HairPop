import { Component, Input } from '@angular/core';

@Component({
  selector: 'hp-braider',
  standalone: true,
  imports: [],
  templateUrl: './braider.html',
  styleUrl: './braider.scss'
})
export class Braider {
  @Input() profileImageUrl: string = null!;

  @Input() profileName: string = null!;
}
