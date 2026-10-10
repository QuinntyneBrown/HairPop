/**
 * The HairPop icon set: 24-unit grid, 2-unit round stroke, `currentColor`.
 * Paths are copied verbatim from the design system's `build.py` `ICONS` table,
 * plus `arrow-up` and `arrow-down` (icon.md D-6).
 */
export const ICONS = {
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
  close: 'M6 6l12 12M18 6L6 18',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  check: 'M5 12l5 5L19 7',
  'check-circle': 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12l3 3 5-6',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 7.5v.01',
  'alert-circle': 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5v5M12 16v.01',
  warning: 'M12 4L2.5 20h19zM12 10v4M12 17v.01',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  'arrow-up': 'M12 19V5M6 11l6-6 6 6',
  'arrow-down': 'M12 5v14M6 13l6 6 6-6',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-left': 'M15 6l-6 6 6 6',
  'chevron-right': 'M9 6l6 6-6 6',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  'map-pin':
    'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0',
  user: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 20a8 8 0 0 1 16 0',
  menu: 'M4 6h16M4 12h16M4 18h16',
  filter: 'M4 5h16l-6 8v6l-4-2v-4z',
  plus: 'M12 5v14M5 12h14',
  edit: 'M4 20h4l10-10-4-4L4 16v4zM13 7l4 4',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  'eye-off':
    'M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.9M6.2 6.2C3.6 8 2 12 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5-1.4M9.9 9.9a3 3 0 0 0 4.2 4.2',
  more: 'M5 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM19 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
  'wifi-off':
    'M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M12 20h.01M16.7 11.3A10 10 0 0 1 19 13M2 9a15 15 0 0 1 4.6-2.9M10.7 5.1A15 15 0 0 1 22 9',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  message: 'M4 5h16v11H8l-4 4z',
  'log-out': 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10',
  help: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 16.5v.01',
  home: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
} as const;

/** One of the 38 icon names in the HairPop set. */
export type IconName = keyof typeof ICONS;
