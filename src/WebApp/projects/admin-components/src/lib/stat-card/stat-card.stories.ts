import type { Meta, StoryObj } from '@storybook/angular';
import { StatCard } from './stat-card';

const meta: Meta<StatCard> = {
  title: 'Admin/Cards/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    icon: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'accent'],
    },
    trend: { control: 'text' },
    trendDirection: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
    },
  },
};

export default meta;
type Story = StoryObj<StatCard>;

export const Default: Story = {
  args: {
    value: '1,234',
    label: 'Total Users',
    icon: '&#128100;',
    variant: 'primary',
    trend: '+12% from last month',
    trendDirection: 'up',
  },
};

export const Success: Story = {
  args: {
    value: '$45,678',
    label: 'Revenue',
    icon: '&#128176;',
    variant: 'success',
    trend: '+8.5% from last month',
    trendDirection: 'up',
  },
};

export const Warning: Story = {
  args: {
    value: '23',
    label: 'Pending Reviews',
    icon: '&#9733;',
    variant: 'warning',
    trend: '-3% from last week',
    trendDirection: 'down',
  },
};

export const WithoutTrend: Story = {
  args: {
    value: '456',
    label: 'Active Braiders',
    icon: '&#128135;',
    variant: 'accent',
    trend: '',
    trendDirection: 'neutral',
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; width: 600px;">
        <lib-stat-card
          value="1,234"
          label="Total Users"
          icon="&#128100;"
          variant="primary"
          trend="+12%"
          trendDirection="up"
        ></lib-stat-card>
        <lib-stat-card
          value="$45,678"
          label="Revenue"
          icon="&#128176;"
          variant="success"
          trend="+8.5%"
          trendDirection="up"
        ></lib-stat-card>
        <lib-stat-card
          value="23"
          label="Pending"
          icon="&#9733;"
          variant="warning"
          trend="-3%"
          trendDirection="down"
        ></lib-stat-card>
        <lib-stat-card
          value="456"
          label="Braiders"
          icon="&#128135;"
          variant="accent"
        ></lib-stat-card>
      </div>
    `,
  }),
};
