import { Type } from '@angular/core';

/** One component's examples page in the storybook. */
export interface ComponentExamples {
  /** URL segment, matching the component's folder in the library. */
  readonly id: string;
  /** Name shown in the storybook navigation and page heading. */
  readonly title: string;
  /** Lazily loads the examples component. */
  readonly load: () => Promise<Type<unknown>>;
}

/** Every component's examples, sorted by title. */
export const COMPONENT_EXAMPLES: readonly ComponentExamples[] = [
  {
    id: 'alert',
    title: 'Alert',
    load: () => import('./alert/alert-examples').then((m) => m.AlertExamples),
  },
  {
    id: 'avatar',
    title: 'Avatar',
    load: () => import('./avatar/avatar-examples').then((m) => m.AvatarExamples),
  },
  {
    id: 'badge',
    title: 'Badge',
    load: () => import('./badge/badge-examples').then((m) => m.BadgeExamples),
  },
  {
    id: 'breadcrumb',
    title: 'Breadcrumb',
    load: () => import('./breadcrumb/breadcrumb-examples').then((m) => m.BreadcrumbExamples),
  },
  {
    id: 'button',
    title: 'Button',
    load: () => import('./button/button-examples').then((m) => m.ButtonExamples),
  },
  {
    id: 'card',
    title: 'Card',
    load: () => import('./card/card-examples').then((m) => m.CardExamples),
  },
  {
    id: 'checkbox',
    title: 'Checkbox',
    load: () => import('./checkbox/checkbox-examples').then((m) => m.CheckboxExamples),
  },
  {
    id: 'chip',
    title: 'Chip',
    load: () => import('./chip/chip-examples').then((m) => m.ChipExamples),
  },
  {
    id: 'container',
    title: 'Container',
    load: () => import('./container/container-examples').then((m) => m.ContainerExamples),
  },
  {
    id: 'description-list',
    title: 'Description list',
    load: () =>
      import('./description-list/description-list-examples').then((m) => m.DescriptionListExamples),
  },
  {
    id: 'dialog',
    title: 'Dialog',
    load: () => import('./dialog/dialog-examples').then((m) => m.DialogExamples),
  },
  {
    id: 'divider',
    title: 'Divider',
    load: () => import('./divider/divider-examples').then((m) => m.DividerExamples),
  },
  {
    id: 'empty-state',
    title: 'Empty state',
    load: () => import('./empty-state/empty-state-examples').then((m) => m.EmptyStateExamples),
  },
  {
    id: 'error-page',
    title: 'Error page',
    load: () => import('./error-page/error-page-examples').then((m) => m.ErrorPageExamples),
  },
  {
    id: 'footer',
    title: 'Footer',
    load: () => import('./footer/footer-examples').then((m) => m.FooterExamples),
  },
  {
    id: 'form-field',
    title: 'Form field',
    load: () => import('./form-field/form-field-examples').then((m) => m.FormFieldExamples),
  },
  {
    id: 'form-layout',
    title: 'Form layout',
    load: () => import('./form-layout/form-layout-examples').then((m) => m.FormLayoutExamples),
  },
  {
    id: 'gallery',
    title: 'Gallery',
    load: () => import('./gallery/gallery-examples').then((m) => m.GalleryExamples),
  },
  {
    id: 'icon',
    title: 'Icon',
    load: () => import('./icon/icon-examples').then((m) => m.IconExamples),
  },
  {
    id: 'inline-message',
    title: 'Inline message',
    load: () =>
      import('./inline-message/inline-message-examples').then((m) => m.InlineMessageExamples),
  },
  {
    id: 'link',
    title: 'Link',
    load: () => import('./link/link-examples').then((m) => m.LinkExamples),
  },
  {
    id: 'list',
    title: 'List',
    load: () => import('./list/list-examples').then((m) => m.ListExamples),
  },
  {
    id: 'menu',
    title: 'Menu',
    load: () => import('./menu/menu-examples').then((m) => m.MenuExamples),
  },
  {
    id: 'page-header',
    title: 'Page header',
    load: () => import('./page-header/page-header-examples').then((m) => m.PageHeaderExamples),
  },
  {
    id: 'pagination',
    title: 'Pagination',
    load: () => import('./pagination/pagination-examples').then((m) => m.PaginationExamples),
  },
  {
    id: 'progress-bar',
    title: 'Progress bar',
    load: () => import('./progress-bar/progress-bar-examples').then((m) => m.ProgressBarExamples),
  },
  {
    id: 'radio-group',
    title: 'Radio group',
    load: () => import('./radio-group/radio-group-examples').then((m) => m.RadioGroupExamples),
  },
  {
    id: 'select',
    title: 'Select',
    load: () => import('./select/select-examples').then((m) => m.SelectExamples),
  },
  {
    id: 'sidebar-navigation',
    title: 'Sidebar navigation',
    load: () =>
      import('./sidebar-navigation/sidebar-navigation-examples').then(
        (m) => m.SidebarNavigationExamples,
      ),
  },
  {
    id: 'skeleton',
    title: 'Skeleton',
    load: () => import('./skeleton/skeleton-examples').then((m) => m.SkeletonExamples),
  },
  {
    id: 'skip-link',
    title: 'Skip link',
    load: () => import('./skip-link/skip-link-examples').then((m) => m.SkipLinkExamples),
  },
  {
    id: 'spinner',
    title: 'Spinner',
    load: () => import('./spinner/spinner-examples').then((m) => m.SpinnerExamples),
  },
  {
    id: 'stat',
    title: 'Stat',
    load: () => import('./stat/stat-examples').then((m) => m.StatExamples),
  },
  {
    id: 'switch',
    title: 'Switch',
    load: () => import('./switch/switch-examples').then((m) => m.SwitchExamples),
  },
  {
    id: 'table',
    title: 'Table',
    load: () => import('./table/table-examples').then((m) => m.TableExamples),
  },
  {
    id: 'tabs',
    title: 'Tabs',
    load: () => import('./tabs/tabs-examples').then((m) => m.TabsExamples),
  },
  {
    id: 'text-field',
    title: 'Text field',
    load: () => import('./text-field/text-field-examples').then((m) => m.TextFieldExamples),
  },
  {
    id: 'textarea',
    title: 'Textarea',
    load: () => import('./textarea/textarea-examples').then((m) => m.TextareaExamples),
  },
  {
    id: 'toast',
    title: 'Toast',
    load: () => import('./toast/toast-examples').then((m) => m.ToastExamples),
  },
  {
    id: 'theme-toggle',
    title: 'Theme toggle',
    load: () => import('./theme-toggle/theme-toggle-examples').then((m) => m.ThemeToggleExamples),
  },
  {
    id: 'tooltip',
    title: 'Tooltip',
    load: () => import('./tooltip/tooltip-examples').then((m) => m.TooltipExamples),
  },
  {
    id: 'top-bar',
    title: 'Top bar',
    load: () => import('./top-bar/top-bar-examples').then((m) => m.TopBarExamples),
  },
];
