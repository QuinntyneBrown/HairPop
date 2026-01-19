import type { Meta, StoryObj } from '@storybook/angular';
import { ActivityItem } from './activity-item';

const meta: Meta<ActivityItem> = {
  title: 'Admin/Data Display/ActivityItem',
  component: ActivityItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    icon: { control: 'text' },
    type: {
      control: 'select',
      options: ['success', 'warning', 'info', 'error'],
    },
    title: { control: 'text' },
    description: { control: 'text' },
    timestamp: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ActivityItem>;

export const Success: Story = {
  args: {
    icon: '&#10003;',
    type: 'success',
    title: 'New booking confirmed',
    description: 'John Doe booked an appointment with Jasmine Williams',
    timestamp: '2 min ago',
  },
};

export const Warning: Story = {
  args: {
    icon: '&#9888;',
    type: 'warning',
    title: 'Review pending approval',
    description: 'A new review requires moderation',
    timestamp: '15 min ago',
  },
};

export const Info: Story = {
  args: {
    icon: '&#128100;',
    type: 'info',
    title: 'New user registered',
    description: 'alice@example.com just signed up',
    timestamp: '1 hour ago',
  },
};

export const Error: Story = {
  args: {
    icon: '&#10006;',
    type: 'error',
    title: 'Payment failed',
    description: 'Transaction #12345 was declined',
    timestamp: '3 hours ago',
  },
};

export const ActivityList: Story = {
  render: () => ({
    template: `
      <div style="background: var(--surface-card, #1e1e1e); border-radius: 8px; max-width: 500px;">
        <lib-activity-item
          icon="&#10003;"
          type="success"
          title="New booking confirmed"
          description="John Doe booked an appointment"
          timestamp="2 min ago"
        ></lib-activity-item>
        <lib-activity-item
          icon="&#9888;"
          type="warning"
          title="Review pending approval"
          description="A new review requires moderation"
          timestamp="15 min ago"
        ></lib-activity-item>
        <lib-activity-item
          icon="&#128100;"
          type="info"
          title="New user registered"
          description="alice@example.com just signed up"
          timestamp="1 hour ago"
        ></lib-activity-item>
      </div>
    `,
  }),
};
