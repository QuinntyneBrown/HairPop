import type { Meta, StoryObj } from '@storybook/angular';
import { FeatureCard } from './feature-card';

const meta: Meta<FeatureCard> = {
  title: 'App/Cards/FeatureCard',
  component: FeatureCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    icon: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<FeatureCard>;

export const Default: Story = {
  args: {
    icon: '🔍',
    title: 'Find Local Braiders',
    description: 'Search through our verified network of professional hair braiders in your area.',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-feature-card
        [icon]="icon"
        [title]="title"
        [description]="description"
        style="width: 300px;"
      ></lib-feature-card>
    `,
  }),
};

export const Calendar: Story = {
  args: {
    icon: '📅',
    title: 'Easy Booking',
    description: 'Book appointments online with just a few clicks. No phone calls needed.',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-feature-card
        [icon]="icon"
        [title]="title"
        [description]="description"
        style="width: 300px;"
      ></lib-feature-card>
    `,
  }),
};

export const Review: Story = {
  args: {
    icon: '⭐',
    title: 'Verified Reviews',
    description: 'Read honest reviews from real customers to make informed decisions.',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-feature-card
        [icon]="icon"
        [title]="title"
        [description]="description"
        style="width: 300px;"
      ></lib-feature-card>
    `,
  }),
};

export const FeatureGrid: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1000px;">
        <lib-feature-card
          icon="🔍"
          title="Find Local Braiders"
          description="Search through our verified network of professional hair braiders."
        ></lib-feature-card>
        <lib-feature-card
          icon="📅"
          title="Easy Booking"
          description="Book appointments online with just a few clicks."
        ></lib-feature-card>
        <lib-feature-card
          icon="⭐"
          title="Verified Reviews"
          description="Read honest reviews from real customers."
        ></lib-feature-card>
      </div>
    `,
  }),
};
