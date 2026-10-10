import {
  ChangeDetectionStrategy,
  Component,
  HostAttributeToken,
  InjectionToken,
  computed,
  inject,
} from '@angular/core';

/** Internal: what a form field tells the addons projected into it. */
export interface FieldAddonHost {
  /** The field's generated id, `hp-field-{n}`. */
  readonly fieldId: string;
}

/** Internal token the form field provides so its addons can derive their ids. */
export const HP_FIELD_ADDON_HOST = new InjectionToken<FieldAddonHost>('HP_FIELD_ADDON_HOST');

/**
 * A unit or currency beside a form field's control ("$", "km"). Projected into the field's
 * `[slot=prefix]` or `[slot=suffix]`; the field gives it the id `{fieldId}-addon-prefix|suffix`
 * and, unless it is `aria-hidden="true"`, lists that id in the control's description (D-12).
 */
@Component({
  selector: 'span[hp-field-addon]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    class: 'addon',
    '[attr.id]': 'id()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      padding-inline: var(--space-3);
      background: var(--color-bg-subtle);
      border: var(--border-width-hairline) solid var(--color-border-strong);
      color: var(--color-fg-muted);
      font: var(--text-body-sm);
      white-space: nowrap;
    }

    @media (forced-colors: active) {
      :host {
        border-color: CanvasText;
      }
    }
  `,
})
export class FieldAddon {
  private readonly host = inject(HP_FIELD_ADDON_HOST, { optional: true });
  private readonly slot = inject(new HostAttributeToken('slot'), { optional: true });
  private readonly ariaHidden = inject(new HostAttributeToken('aria-hidden'), { optional: true });

  /** Which side of the control the addon sits on, from its `slot` attribute. */
  readonly position: 'prefix' | 'suffix' = this.slot === 'suffix' ? 'suffix' : 'prefix';

  /** True when the addon is announced as part of the control's description. */
  readonly described = this.ariaHidden !== 'true';

  /** `{fieldId}-addon-prefix` or `-suffix`; null outside a form field. */
  readonly id = computed(() => (this.host ? `${this.host.fieldId}-addon-${this.position}` : null));
}
