import type { Meta, StoryObj } from '@storybook/angular';
import { Button } from './button';

const meta: Meta<Button> = {
  title: 'Admin/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'stroked', 'warn'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
    icon: { control: 'text' },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
  },
};

export default meta;
type Story = StoryObj<Button>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [size]="size" [disabled]="disabled">Default Button</lib-button>`,
  }),
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [size]="size" [disabled]="disabled">Primary Button</lib-button>`,
  }),
};

export const Stroked: Story = {
  args: {
    variant: 'stroked',
    size: 'medium',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [size]="size" [disabled]="disabled">Stroked Button</lib-button>`,
  }),
};

export const Warn: Story = {
  args: {
    variant: 'warn',
    size: 'medium',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [size]="size" [disabled]="disabled">Delete</lib-button>`,
  }),
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
    icon: '&#10010;',
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [size]="size" [disabled]="disabled" [icon]="icon">Add New</lib-button>`,
  }),
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [size]="size" [disabled]="disabled">Small</lib-button>`,
  }),
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [size]="size" [disabled]="disabled">Large Button</lib-button>`,
  }),
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: true,
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [size]="size" [disabled]="disabled">Disabled</lib-button>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <lib-button variant="default">Default</lib-button>
        <lib-button variant="primary">Primary</lib-button>
        <lib-button variant="stroked">Stroked</lib-button>
        <lib-button variant="warn">Warn</lib-button>
      </div>
    `,
  }),
};
