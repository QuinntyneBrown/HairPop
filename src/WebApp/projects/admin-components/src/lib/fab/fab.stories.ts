import type { Meta, StoryObj } from '@storybook/angular';
import { Fab } from './fab';

const meta: Meta<Fab> = {
  title: 'Admin/Buttons/Fab',
  component: Fab,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    icon: { control: 'text' },
    size: {
      control: 'select',
      options: ['default', 'mini'],
    },
    color: {
      control: 'select',
      options: ['primary', 'accent', 'warn'],
    },
    disabled: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Fab>;

export const Default: Story = {
  args: {
    icon: '&#10010;',
    size: 'default',
    color: 'accent',
    disabled: false,
    ariaLabel: 'Add',
  },
};

export const Primary: Story = {
  args: {
    icon: '&#10010;',
    size: 'default',
    color: 'primary',
    disabled: false,
    ariaLabel: 'Add',
  },
};

export const Warn: Story = {
  args: {
    icon: '&#128465;',
    size: 'default',
    color: 'warn',
    disabled: false,
    ariaLabel: 'Delete',
  },
};

export const Mini: Story = {
  args: {
    icon: '&#10010;',
    size: 'mini',
    color: 'accent',
    disabled: false,
    ariaLabel: 'Add',
  },
};

export const Disabled: Story = {
  args: {
    icon: '&#10010;',
    size: 'default',
    color: 'accent',
    disabled: true,
    ariaLabel: 'Add',
  },
};

export const AllColors: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px;">
        <lib-fab icon="&#10010;" color="primary" ariaLabel="Primary"></lib-fab>
        <lib-fab icon="&#10010;" color="accent" ariaLabel="Accent"></lib-fab>
        <lib-fab icon="&#10010;" color="warn" ariaLabel="Warn"></lib-fab>
      </div>
    `,
  }),
};
