import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The application shell: top bar, the one `main#main` landmark, footer.
 *
 * It has no styles of its own; `.product-shell`, `.container`, `.product-main`
 * and `.container--narrow` are styled by the global `layout.css` (container.md D-1).
 */
@Component({
  selector: 'hp-app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'product-shell' },
  template: `<ng-content select="[slot=topbar]" />
    <main id="main" class="container product-main" [class.container--narrow]="narrow()">
      <ng-content />
    </main>
    <ng-content select="[slot=footer]" />`,
})
export class AppShell {
  /** Caps main at `--layout-form-max` for auth and form-only pages. */
  readonly narrow = input(false, { transform: booleanAttribute });
}
