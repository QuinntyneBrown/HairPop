import type { Meta, StoryObj } from '@storybook/angular';
import { DataTable } from './data-table';

const meta: Meta<DataTable> = {
  title: 'Admin/Table/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    selectable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<DataTable>;

const sampleColumns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
];

const sampleData = [
  { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Active' },
];

export const Default: Story = {
  args: {
    columns: sampleColumns,
    data: sampleData,
    selectable: false,
  },
};

export const Selectable: Story = {
  args: {
    columns: sampleColumns,
    data: sampleData,
    selectable: true,
  },
};

export const Empty: Story = {
  args: {
    columns: sampleColumns,
    data: [],
    selectable: false,
  },
};
