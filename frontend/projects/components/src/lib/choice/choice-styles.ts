/**
 * Shared option-row styles for the label-hosted choice controls.
 *
 * `CHOICE_TEXT_STYLES` holds the label and description rules (`.choice__text`, its `<small>`,
 * and the long-word wrapping of checkbox D-15 / radio group D-15). The checkbox, the radio and
 * the switch include it.
 *
 * `CHOICE_STYLES` holds the `.choice` row, the native box or circle, and the `.choice--card`
 * frame, ported from `docs/design-system/assets/components.css` with `:host` selectors. The
 * checkbox and the radio include it, so the rules exist once in the library (checkbox and
 * radio group implementation notes).
 */
export const CHOICE_TEXT_STYLES = `
  :host > span,
  .choice__text {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .choice__text {
    display: flex;
    flex-direction: column;
    gap: var(--space-0-5);
  }

  .choice__text small {
    font: var(--text-body-sm);
    color: var(--color-fg-muted);
  }

  :host input:disabled ~ .choice__text small {
    color: var(--color-fg-disabled);
  }
`;

export const CHOICE_STYLES = `
  :host {
    --choice-size: 1.25rem;
    display: flex;
    gap: var(--space-3);
    align-items: flex-start;
    cursor: pointer;
    font: var(--text-body);
    color: var(--color-fg-default);
    padding-block: var(--space-1);
    min-height: var(--target-min);
    min-width: var(--target-min);
    box-sizing: border-box;
  }

  :host input {
    appearance: none;
    flex: none;
    box-sizing: border-box;
    width: var(--choice-size);
    height: var(--choice-size);
    margin: var(--space-0-5) 0 0;
    border: var(--border-width-hairline) solid var(--color-border-strong);
    background: var(--color-bg-surface);
    display: grid;
    place-content: center;
    cursor: pointer;
    transition:
      background-color var(--duration-fast) var(--ease-standard),
      border-color var(--duration-fast) var(--ease-standard);
  }

  :host input[type='checkbox'] {
    border-radius: var(--radius-xs);
  }

  :host input[type='radio'] {
    border-radius: var(--radius-full);
  }

  :host(:hover) input:not(:disabled) {
    border-color: var(--color-accent);
  }

  :host input:checked {
    background: var(--color-accent);
    border-color: var(--color-accent);
  }

  :host input[type='checkbox']:checked::before {
    content: '';
    width: 0.75rem;
    height: 0.75rem;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    background: var(--color-fg-on-accent);
  }

  :host input[type='checkbox']:indeterminate {
    background: var(--color-accent);
    border-color: var(--color-accent);
  }

  :host input[type='checkbox']:indeterminate::before {
    content: '';
    width: 0.75rem;
    height: var(--border-width-thick);
    clip-path: none;
    background: var(--color-fg-on-accent);
  }

  :host input[type='radio']:checked::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-radius: var(--radius-full);
    background: var(--color-fg-on-accent);
  }

  :host input:disabled {
    background: var(--color-bg-subtle);
    border-color: var(--color-border-default);
    cursor: not-allowed;
  }

  :host input:disabled ~ * {
    color: var(--color-fg-disabled);
  }

  :host:has(input:disabled) {
    cursor: not-allowed;
  }

  :host input[aria-invalid='true'] {
    border-color: var(--color-danger-solid);
    box-shadow: inset 0 0 0 1px var(--color-danger-solid);
  }

  :host(.choice--card) {
    flex-wrap: wrap;
    padding: var(--space-4);
    border: var(--border-width-hairline) solid var(--color-border-strong);
    border-radius: var(--radius-md);
    background: var(--color-bg-surface);
  }

  :host(.choice--card) > span {
    flex: 1 1 8em;
  }

  :host(.choice--card:has(input:checked)) {
    border-color: var(--color-accent);
    box-shadow: inset 0 0 0 1px var(--color-accent);
    background: var(--color-accent-subtle);
  }

  @media (forced-colors: active) {
    :host input:checked,
    :host input[type='checkbox']:indeterminate {
      forced-color-adjust: none;
      background: Highlight;
    }
  }
`;
