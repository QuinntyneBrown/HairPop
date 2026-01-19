import type { Meta, StoryObj } from '@storybook/angular';
import { Card } from './card';

const meta: Meta<Card> = {
  title: 'Admin/Cards/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    noPadding: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Card>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    subtitle: 'Card subtitle text',
    noPadding: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-card [title]="title" [subtitle]="subtitle" [noPadding]="noPadding" style="width: 400px;">
        <p style="color: rgba(255, 255, 255, 0.87); margin: 0;">This is the card content. You can put any content here.</p>
      </lib-card>
    `,
  }),
};

export const WithoutSubtitle: Story = {
  args: {
    title: 'Card Title',
    subtitle: '',
    noPadding: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-card [title]="title" [subtitle]="subtitle" [noPadding]="noPadding" style="width: 400px;">
        <p style="color: rgba(255, 255, 255, 0.87); margin: 0;">Card content without subtitle.</p>
      </lib-card>
    `,
  }),
};

export const WithoutHeader: Story = {
  args: {
    title: '',
    subtitle: '',
    noPadding: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-card [title]="title" [subtitle]="subtitle" [noPadding]="noPadding" style="width: 400px;">
        <p style="color: rgba(255, 255, 255, 0.87); margin: 0;">Card without any header. Just content.</p>
      </lib-card>
    `,
  }),
};

export const NoPadding: Story = {
  args: {
    title: 'Table Card',
    subtitle: 'Content without padding',
    noPadding: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-card [title]="title" [subtitle]="subtitle" [noPadding]="noPadding" style="width: 400px;">
        <div style="background: var(--surface-elevated, #383838); padding: 32px; text-align: center; color: rgba(255, 255, 255, 0.6);">
          Full-width content (e.g., a table)
        </div>
      </lib-card>
    `,
  }),
};
