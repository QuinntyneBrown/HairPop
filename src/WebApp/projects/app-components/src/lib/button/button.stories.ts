import type { Meta, StoryObj } from '@storybook/angular';
import { AppButton } from './button';

const meta: Meta<AppButton> = {
  title: 'App/Buttons/Button',
  component: AppButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'pill'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<AppButton>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<lib-app-button [variant]="variant" [size]="size" [disabled]="disabled">Book Appointment</lib-app-button>`,
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<lib-app-button [variant]="variant" [size]="size" [disabled]="disabled">Send Message</lib-app-button>`,
  }),
};

export const Pill: Story = {
  args: {
    variant: 'pill',
    size: 'medium',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<lib-app-button [variant]="variant" [size]="size" [disabled]="disabled">Load More Braiders</lib-app-button>`,
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
    template: `<lib-app-button [variant]="variant" [size]="size" [disabled]="disabled">Small Button</lib-app-button>`,
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
    template: `<lib-app-button [variant]="variant" [size]="size" [disabled]="disabled">Large Button</lib-app-button>`,
  }),
};

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
    fullWidth: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 300px;">
        <lib-app-button [variant]="variant" [size]="size" [disabled]="disabled" [fullWidth]="fullWidth">View Profile</lib-app-button>
      </div>
    `,
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
    template: `<lib-app-button [variant]="variant" [size]="size" [disabled]="disabled">Disabled</lib-app-button>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <lib-app-button variant="primary">Primary</lib-app-button>
        <lib-app-button variant="secondary">Secondary</lib-app-button>
        <lib-app-button variant="pill">Pill Button</lib-app-button>
      </div>
    `,
  }),
};
