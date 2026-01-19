import type { Meta, StoryObj } from '@storybook/angular';
import { Toolbar } from './toolbar';

const meta: Meta<Toolbar> = {
  title: 'Admin/Navigation/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    title: { control: 'text' },
    showMenuButton: { control: 'boolean' },
    showSearch: { control: 'boolean' },
    avatarInitials: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Toolbar>;

export const Default: Story = {
  args: {
    title: 'HairPop Admin',
    showMenuButton: true,
    showSearch: true,
    avatarInitials: 'AD',
  },
};

export const WithoutSearch: Story = {
  args: {
    title: 'HairPop Admin',
    showMenuButton: true,
    showSearch: false,
    avatarInitials: 'AD',
  },
};

export const WithoutMenuButton: Story = {
  args: {
    title: 'HairPop Admin',
    showMenuButton: false,
    showSearch: true,
    avatarInitials: 'JD',
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Dashboard',
    showMenuButton: true,
    showSearch: true,
    avatarInitials: 'QA',
  },
};
