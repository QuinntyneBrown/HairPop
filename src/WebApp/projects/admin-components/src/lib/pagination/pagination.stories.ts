import type { Meta, StoryObj } from '@storybook/angular';
import { Pagination } from './pagination';

const meta: Meta<Pagination> = {
  title: 'Admin/Table/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    currentPage: { control: 'number' },
    totalPages: { control: 'number' },
    totalItems: { control: 'number' },
    itemsPerPage: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<Pagination>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 5,
    itemsPerPage: 10,
  },
};
