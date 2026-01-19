import type { Meta, StoryObj } from '@storybook/angular';
import { Footer } from './footer';

const meta: Meta<Footer> = {
  title: 'App/Layout/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    copyrightText: { control: 'text' },
    year: { control: 'number' },
    companyName: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Footer>;

export const Default: Story = {
  args: {
    copyrightText: '',
    year: 2026,
    companyName: 'HairPop',
  },
};

export const CustomText: Story = {
  args: {
    copyrightText: 'Made with love in Canada',
    year: 2026,
    companyName: 'HairPop',
  },
};
