import type { Meta, StoryObj } from '@storybook/angular';
import { ChipFilter } from './chip-filter';

const meta: Meta<ChipFilter> = {
  title: 'Admin/Filters/ChipFilter',
  component: ChipFilter,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    label: { control: 'text' },
    active: { control: 'boolean' },
    count: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<ChipFilter>;

export const Default: Story = {
  args: {
    label: 'All',
    active: false,
    count: null,
  },
};

export const Active: Story = {
  args: {
    label: 'Active',
    active: true,
    count: 42,
  },
};

export const WithCount: Story = {
  args: {
    label: 'Pending',
    active: false,
    count: 12,
  },
};

export const FilterGroup: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <lib-chip-filter label="All" [active]="true" [count]="156"></lib-chip-filter>
        <lib-chip-filter label="Active" [count]="120"></lib-chip-filter>
        <lib-chip-filter label="Pending" [count]="24"></lib-chip-filter>
        <lib-chip-filter label="Inactive" [count]="12"></lib-chip-filter>
      </div>
    `,
  }),
};
