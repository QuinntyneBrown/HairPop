import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Avatar, AvatarPerson, AvatarSize } from './avatar';

/**
 * Up to `max` people and a "+N" overflow, exposed as one image named by `label` (avatar.md).
 * Avatars overlap by `--space-2` through an inline-end margin and wrap flush when the row
 * is too narrow (D-5).
 */
@Component({
  selector: 'hp-avatar-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar],
  host: {
    class: 'avatar-group',
    role: 'img',
    '[attr.aria-label]': 'label()',
  },
  template: `@for (person of shown(); track $index) {
      <span hp-avatar [name]="person.name" [src]="person.src ?? null" [size]="size()"></span>
    }
    @if (overflow() > 0) {
      <span
        class="avatar"
        [class.avatar--sm]="size() === 'sm'"
        [class.avatar--lg]="size() === 'lg'"
        [class.avatar--xl]="size() === 'xl'"
        aria-hidden="true"
        >+{{ overflow() }}</span
      >
    }`,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      row-gap: var(--space-1);
      padding-inline-end: var(--space-2);
    }

    .avatar {
      box-shadow: 0 0 0 var(--border-width-thick) var(--color-bg-surface);
      margin-inline-end: calc(-1 * var(--space-2));
    }

    /* The overflow avatar is plain markup, so it carries the avatar frame rules itself. */
    span.avatar:not([hp-avatar]) {
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

    span.avatar--sm:not([hp-avatar]) {
      --avatar-size: 2rem;
      --avatar-font: var(--text-caption);
    }

    span.avatar--lg:not([hp-avatar]) {
      --avatar-size: 3rem;
      --avatar-font: var(--text-h4);
    }

    span.avatar--xl:not([hp-avatar]) {
      --avatar-size: 3rem;
      --avatar-font: var(--text-h3);
    }

    @media (min-width: 48rem) {
      span.avatar--xl:not([hp-avatar]) {
        --avatar-size: 4rem;
      }
    }

    @media (forced-colors: active) {
      span.avatar:not([hp-avatar]) {
        border: var(--border-width-hairline) solid CanvasText;
        color: CanvasText;
      }
    }
  `,
})
export class AvatarGroup {
  /** The people to show, in order; the first `max` render as decorative avatars. */
  readonly people = input.required<readonly AvatarPerson[]>();
  /** The group's accessible name, composed and translated by the consumer. */
  readonly label = input.required<string>();
  /** The real number of people when `people` holds only the first few. */
  readonly total = input<number | null>(null);
  /** Faces shown before the overflow. */
  readonly max = input<number>(3);
  /** Size of every avatar in the group, including the overflow. */
  readonly size = input<AvatarSize>('md');

  protected readonly shown = computed(() => this.people().slice(0, Math.max(0, this.max())));
  protected readonly overflow = computed(() => {
    const total = this.total() ?? this.people().length;
    return Math.max(0, total - this.shown().length);
  });
}
