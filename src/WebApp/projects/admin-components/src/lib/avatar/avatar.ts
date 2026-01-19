import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

@Component({
  selector: 'lib-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
})
export class Avatar {
  @Input() initials: string = '';
  @Input() src: string = '';
  @Input() size: AvatarSize = 'medium';
  @Input() alt: string = '';
}
