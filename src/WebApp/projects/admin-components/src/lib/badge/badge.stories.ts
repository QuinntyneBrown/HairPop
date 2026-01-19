import type { Meta, StoryObj } from '@storybook/angular';
import { Badge } from './badge';

const meta: Meta<Badge> = {
  title: 'Admin/Data Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
    icon: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Badge>;

export const Default: Story = {
  args: {
    variant: 'default',
    icon: '',
  },
  render: (args) => ({
    props: args,
    template: `<lib-badge [variant]="variant" [icon]="icon">Default</lib-badge>`,
  }),
};

export const Success: Story = {
  args: {
    variant: 'success',
    icon: '&#10003;',
  },
  render: (args) => ({
    props: args,
    template: `<lib-badge [variant]="variant" [icon]="icon">Active</lib-badge>`,
  }),
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    icon: '&#9888;',
  },
  render: (args) => ({
    props: args,
    template: `<lib-badge [variant]="variant" [icon]="icon">Pending</lib-badge>`,
  }),
};

export const Error: Story = {
  args: {
    variant: 'error',
    icon: '&#10006;',
  },
  render: (args) => ({
    props: args,
    template: `<lib-badge [variant]="variant" [icon]="icon">Inactive</lib-badge>`,
  }),
};

export const Info: Story = {
  args: {
    variant: 'info',
    icon: '&#8505;',
  },
  render: (args) => ({
    props: args,
    template: `<lib-badge [variant]="variant" [icon]="icon">New</lib-badge>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <lib-badge variant="default">Default</lib-badge>
        <lib-badge variant="success" icon="&#10003;">Active</lib-badge>
        <lib-badge variant="warning" icon="&#9888;">Pending</lib-badge>
        <lib-badge variant="error" icon="&#10006;">Inactive</lib-badge>
        <lib-badge variant="info" icon="&#8505;">New</lib-badge>
      </div>
    `,
  }),
};
