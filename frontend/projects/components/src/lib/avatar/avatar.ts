import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  isDevMode,
  linkedSignal,
} from '@angular/core';

import { Icon, IconSize } from '../icon/icon';

/** Avatar sizes: sm 2 rem, md 2.5 rem (no modifier), lg 3 rem, xl 3 rem then 4 rem from 48 rem. */
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

/** The only status an avatar shows: a supplied offered slot. */
export type AvatarStatus = 'available';

/** One person in an avatar group. */
export interface AvatarPerson {
  readonly name: string | null;
  readonly src?: string | null;
}

type AvatarMode = 'image' | 'initials' | 'icon';

const graphemes =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

function firstGrapheme(word: string): string {
  if (graphemes) {
    for (const { segment } of graphemes.segment(word)) {
      return segment;
    }
    return '';
  }
  return Array.from(word)[0] ?? '';
}

/**
 * Initials from a full name (avatar.md D-3): the first grapheme of the first word and, for two or
 * more words, of the last word, uppercased with the locale. "Nia Okafor" → "NO", "Nia" → "N".
 */
export function avatarInitials(name: string | null | undefined): string {
  const words = (name ?? '').trim().split(/\s+/u).filter(Boolean);
  if (words.length === 0) {
    return '';
  }
  const first = firstGrapheme(words[0]);
  const last = words.length > 1 ? firstGrapheme(words[words.length - 1]) : '';
  return (first + last).toLocaleUpperCase();
}

/**
 * A face or initials beside a person's name (avatar.md). The host is the `<span class="avatar">`
 * (D-1). Decorative by default; a failed image falls back to initials until `src` changes.
 */
@Component({
  selector: 'span[hp-avatar]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: {
    class: 'avatar',
    '[class.avatar--sm]': "size() === 'sm'",
    '[class.avatar--lg]': "size() === 'lg'",
    '[class.avatar--xl]': "size() === 'xl'",
    '[attr.aria-hidden]': "mode() !== 'image' && isDecorative() ? 'true' : null",
    '[attr.role]': "mode() === 'initials' && !isDecorative() ? 'img' : null",
    '[attr.aria-label]': "mode() === 'initials' && !isDecorative() ? name() : null",
  },
  // Unformatted on purpose: keeps the initials text node free of surrounding whitespace.
  // prettier-ignore
  template: `@switch (mode()) {
      @case ('image') {
        <img
          [src]="src()"
          [alt]="isDecorative() ? '' : name()"
          [attr.loading]="loading()"
          decoding="async"
          (error)="failed.set(true)"
        />
      }
      @case ('initials') {{{ initials() }}}
      @default {
        <svg hp-icon name="user" [size]="iconSize()"></svg>
      }
    }
    @if (status() === 'available') {
      <span class="avatar__status"></span>
    }`,
  styles: `
    :host {
      --avatar-size: 2.5rem;
      --avatar-font: var(--text-label);
      display: inline-grid;
      place-items: center;
      width: var(--avatar-size);
      height: var(--avatar-size);
      border-radius: var(--radius-full);
      background: var(--color-accent-subtle);
      color: var(--color-fg-accent);
      font: var(--avatar-font);
      overflow: hidden;
      flex: none;
      position: relative;
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      max-width: none;
      object-fit: cover;
    }

    :host(.avatar--sm) {
      --avatar-size: 2rem;
      --avatar-font: var(--text-caption);
    }

    :host(.avatar--lg) {
      --avatar-size: 3rem;
      --avatar-font: var(--text-h4);
    }

    :host(.avatar--xl) {
      --avatar-size: 3rem;
      --avatar-font: var(--text-h3);
    }

    @media (min-width: 48rem) {
      :host(.avatar--xl) {
        --avatar-size: 4rem;
      }
    }

    .avatar__status {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 25%;
      height: 25%;
      min-width: 0.5rem;
      min-height: 0.5rem;
      border-radius: var(--radius-full);
      background: var(--color-success-icon);
      box-shadow: 0 0 0 var(--border-width-thick) var(--color-bg-surface);
    }

    @media (forced-colors: active) {
      :host {
        border: var(--border-width-hairline) solid CanvasText;
        color: CanvasText;
      }

      .avatar__status {
        forced-color-adjust: none;
        background: CanvasText;
      }
    }
  `,
})
export class Avatar {
  /** The person's full name; null or blank means an unknown person (the `user` icon). */
  readonly name = input.required<string | null>();
  /** Portrait URL; on `error` the avatar falls back to initials until it changes. */
  readonly src = input<string | null>(null);
  /** Box size. */
  readonly size = input<AvatarSize>('md');
  /** `'available'` draws the status dot; write the availability beside the avatar in words. */
  readonly status = input<AvatarStatus | null>(null);
  /** True hides the avatar from assistive technology; false names it with `name`. */
  readonly decorative = input(true, { transform: booleanAttribute });
  /** The image's `loading` attribute; the profile header passes `'eager'`. */
  readonly loading = input<'lazy' | 'eager'>('lazy');

  /** The image raised `error`; reset whenever `src` changes. */
  protected readonly failed = linkedSignal({ source: this.src, computation: () => false });

  protected readonly initials = computed(() => avatarInitials(this.name()));
  private readonly hasName = computed(() => this.initials() !== '');

  protected readonly mode = computed<AvatarMode>(() => {
    if (this.src() && !this.failed()) {
      return 'image';
    }
    return this.hasName() ? 'initials' : 'icon';
  });

  /** Without a name the avatar cannot be named, so it is always decorative (D-4). */
  protected readonly isDecorative = computed(() => this.decorative() || !this.hasName());

  protected readonly iconSize = computed<IconSize>(() => {
    const size = this.size();
    return size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg';
  });

  constructor() {
    if (isDevMode()) {
      effect(() => {
        if (!this.decorative() && !this.hasName()) {
          console.error(
            'hp-avatar: a standalone avatar (decorative false) needs a name; it renders as decorative.',
          );
        }
      });
    }
  }
}
