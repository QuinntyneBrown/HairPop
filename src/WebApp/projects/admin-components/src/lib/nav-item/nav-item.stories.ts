import type { Meta, StoryObj } from '@storybook/angular';
import { NavItem } from './nav-item';

const meta: Meta<NavItem> = {
  title: 'Admin/Navigation/NavItem',
  component: NavItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    icon: { control: 'text' },
    text: { control: 'text' },
    active: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<NavItem>;

export const Default: Story = {
  args: {
    icon: '&#127968;',
    text: 'Dashboard',
    active: false,
  },
};

export const Active: Story = {
  args: {
    icon: '&#127968;',
    text: 'Dashboard',
    active: true,
  },
};

export const Users: Story = {
  args: {
    icon: '&#128100;',
    text: 'Users',
    active: false,
  },
};

export const Bookings: Story = {
  args: {
    icon: '&#128197;',
    text: 'Bookings',
    active: false,
  },
};
