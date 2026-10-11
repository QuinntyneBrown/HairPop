import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

/** The two themes the tokens define. */
export type Theme = 'light' | 'dark';

/** `localStorage` key of the saved choice: a functional preference, not optional data (ADR-0006). */
export const THEME_STORAGE_KEY = 'hp-theme';

/**
 * The inline script each app places in `index.html` `<head>`, before its styles, so the saved
 * theme is applied before first paint (theme-toggle.md, ADR-0006).
 */
export const THEME_INIT_SCRIPT =
  "try{var t=localStorage.getItem('hp-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t;}catch(e){}";

const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Owns the applied theme (theme-toggle.md): the saved choice, otherwise the system preference,
 * which it keeps following until a choice is saved (D-4). The server renders without a theme
 * attribute, so CSS `prefers-color-scheme` applies until the init script runs.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly applied = signal<Theme>('light');

  /** The applied theme. */
  readonly theme = this.applied.asReadonly();

  constructor() {
    if (!this.browser) {
      return;
    }
    const saved = this.saved();
    const system = this.document.defaultView?.matchMedia(DARK_QUERY);
    this.applied.set(saved ?? (system?.matches ? 'dark' : 'light'));
    system?.addEventListener('change', (event) => {
      if (!this.saved()) {
        this.applied.set(event.matches ? 'dark' : 'light');
      }
    });
  }

  /** Switches theme, saves it and sets `data-theme` on `<html>`. */
  toggle(): void {
    this.set(this.applied() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.applied.set(theme);
    this.document.documentElement.dataset['theme'] = theme;
    try {
      this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage can be blocked; the choice then lasts for this page view only.
    }
  }

  private saved(): Theme | null {
    try {
      const value = this.document.defaultView?.localStorage.getItem(THEME_STORAGE_KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch {
      return null;
    }
  }
}
