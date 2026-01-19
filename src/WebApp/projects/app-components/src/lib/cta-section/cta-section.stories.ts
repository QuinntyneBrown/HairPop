import type { Meta, StoryObj } from '@storybook/angular';
import { CtaSection } from './cta-section';

const meta: Meta<CtaSection> = {
  title: 'App/Layout/CtaSection',
  component: CtaSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    buttonText: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<CtaSection>;

export const Default: Story = {
  args: {
    title: 'Ready to Find Your Perfect Braider?',
    description: 'Join thousands of satisfied customers who have found their go-to braider on HairPop.',
    buttonText: 'Get Started Today',
  },
};

export const Simple: Story = {
  args: {
    title: 'Start Your Journey',
    description: '',
    buttonText: 'Sign Up Free',
  },
};

export const WithoutButton: Story = {
  args: {
    title: 'Thank You for Visiting',
    description: 'Follow us on social media for the latest updates and braiding inspiration.',
    buttonText: '',
  },
};

export const BraiderCta: Story = {
  args: {
    title: 'Are You a Professional Braider?',
    description: 'Join HairPop and connect with clients looking for your skills. It\'s free to join!',
    buttonText: 'Join as a Braider',
  },
};
