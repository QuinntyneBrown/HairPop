import type { Meta, StoryObj } from '@storybook/angular';
import { Header } from './header';

const meta: Meta<Header> = {
  title: 'App/Layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    logoSrc: { control: 'text' },
    logoAlt: { control: 'text' },
    navLinks: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<Header>;

const defaultNavLinks = [
  { label: 'Home', href: '#', active: true },
  { label: 'Find Braiders', href: '#' },
  { label: 'Hair Styles', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
];

export const Default: Story = {
  args: {
    logoSrc: '',
    logoAlt: 'HairPop',
    navLinks: defaultNavLinks,
  },
};

export const WithLogo: Story = {
  args: {
    logoSrc: 'https://via.placeholder.com/150x60?text=Logo',
    logoAlt: 'HairPop',
    navLinks: defaultNavLinks,
  },
};

export const MinimalNav: Story = {
  args: {
    logoSrc: '',
    logoAlt: 'HairPop',
    navLinks: [
      { label: 'Home', href: '#', active: true },
      { label: 'Browse', href: '#' },
    ],
  },
};
