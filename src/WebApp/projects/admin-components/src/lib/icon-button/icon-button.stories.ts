import type { Meta, StoryObj } from '@storybook/angular';
import { IconButton } from './icon-button';

const meta: Meta<IconButton> = {
  title: 'Admin/Buttons/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    icon: { control: 'text' },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<IconButton>;

export const Default: Story = {
  args: {
    icon: '&#9881;',
    size: 'medium',
    disabled: false,
    ariaLabel: 'Settings',
  },
};

export const Small: Story = {
  args: {
    icon: '&#10006;',
    size: 'small',
    disabled: false,
    ariaLabel: 'Close',
  },
};

export const Large: Story = {
  args: {
    icon: '&#9776;',
    size: 'large',
    disabled: false,
    ariaLabel: 'Menu',
  },
};

export const Disabled: Story = {
  args: {
    icon: '&#128465;',
    size: 'medium',
    disabled: true,
    ariaLabel: 'Delete',
  },
};

export const AllIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px;">
        <lib-icon-button icon="&#9776;" ariaLabel="Menu"></lib-icon-button>
        <lib-icon-button icon="&#128269;" ariaLabel="Search"></lib-icon-button>
        <lib-icon-button icon="&#128276;" ariaLabel="Notifications"></lib-icon-button>
        <lib-icon-button icon="&#9881;" ariaLabel="Settings"></lib-icon-button>
        <lib-icon-button icon="&#128465;" ariaLabel="Delete"></lib-icon-button>
        <lib-icon-button icon="&#10006;" ariaLabel="Close"></lib-icon-button>
      </div>
    `,
  }),
};
