import type { Meta, StoryObj } from '@storybook/angular';
import { AppAvatar } from './app-avatar';

const meta: Meta<AppAvatar> = {
  title: 'App/Data Display/Avatar',
  component: AppAvatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    initials: { control: 'text' },
    src: { control: 'text' },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'xlarge'],
    },
    alt: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<AppAvatar>;

export const Default: Story = {
  args: {
    initials: '👩🏾',
    src: '',
    size: 'large',
    alt: 'Braider',
  },
};

export const Small: Story = {
  args: {
    initials: '👩🏿',
    src: '',
    size: 'small',
    alt: 'Braider',
  },
};

export const Medium: Story = {
  args: {
    initials: '👩🏾',
    src: '',
    size: 'medium',
    alt: 'Braider',
  },
};

export const WithImage: Story = {
  args: {
    initials: '',
    src: 'https://via.placeholder.com/250x250?text=Profile',
    size: 'large',
    alt: 'Jasmine Williams',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <lib-app-avatar size="small" initials="👩🏾"></lib-app-avatar>
        <lib-app-avatar size="medium" initials="👩🏿"></lib-app-avatar>
        <lib-app-avatar size="large" initials="👩🏾"></lib-app-avatar>
      </div>
    `,
  }),
};
