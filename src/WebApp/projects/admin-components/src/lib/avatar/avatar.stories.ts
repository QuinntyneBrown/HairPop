import type { Meta, StoryObj } from '@storybook/angular';
import { Avatar } from './avatar';

const meta: Meta<Avatar> = {
  title: 'Admin/Data Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
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
type Story = StoryObj<Avatar>;

export const Default: Story = {
  args: {
    initials: 'JD',
    src: '',
    size: 'medium',
    alt: 'John Doe',
  },
};

export const Small: Story = {
  args: {
    initials: 'AB',
    src: '',
    size: 'small',
    alt: 'Alice Brown',
  },
};

export const Large: Story = {
  args: {
    initials: 'MK',
    src: '',
    size: 'large',
    alt: 'Mary Kate',
  },
};

export const XLarge: Story = {
  args: {
    initials: 'QA',
    src: '',
    size: 'xlarge',
    alt: 'Quality Assurance',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <lib-avatar initials="SM" size="small"></lib-avatar>
        <lib-avatar initials="MD" size="medium"></lib-avatar>
        <lib-avatar initials="LG" size="large"></lib-avatar>
        <lib-avatar initials="XL" size="xlarge"></lib-avatar>
      </div>
    `,
  }),
};
