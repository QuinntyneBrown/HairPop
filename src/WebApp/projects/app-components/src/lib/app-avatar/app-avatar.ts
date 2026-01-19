import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AppAvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

@Component({
  selector: 'lib-app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-avatar.html',
  styleUrl: './app-avatar.scss',
})
export class AppAvatar {
  @Input() initials: string = '';
  @Input() src: string = '';
  @Input() size: AppAvatarSize = 'large';
  @Input() alt: string = '';
}
