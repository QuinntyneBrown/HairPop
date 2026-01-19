import type { Meta, StoryObj } from '@storybook/angular';
import { Container } from './container';

const meta: Meta<Container> = {
  title: 'App/Layout/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'full'],
    },
    centered: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Container>;

export const Large: Story = {
  args: {
    size: 'large',
    centered: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-container [size]="size" [centered]="centered">
        <div style="background: #f0f0f0; padding: 40px; text-align: center; border-radius: 8px;">
          Large Container (max-width: 1200px)
        </div>
      </lib-container>
    `,
  }),
};

export const Medium: Story = {
  args: {
    size: 'medium',
    centered: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-container [size]="size" [centered]="centered">
        <div style="background: #f0f0f0; padding: 40px; text-align: center; border-radius: 8px;">
          Medium Container (max-width: 900px)
        </div>
      </lib-container>
    `,
  }),
};

export const Small: Story = {
  args: {
    size: 'small',
    centered: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-container [size]="size" [centered]="centered">
        <div style="background: #f0f0f0; padding: 40px; text-align: center; border-radius: 8px;">
          Small Container (max-width: 600px)
        </div>
      </lib-container>
    `,
  }),
};

export const Full: Story = {
  args: {
    size: 'full',
    centered: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-container [size]="size" [centered]="centered">
        <div style="background: #f0f0f0; padding: 40px; text-align: center; border-radius: 8px;">
          Full Width Container
        </div>
      </lib-container>
    `,
  }),
};
