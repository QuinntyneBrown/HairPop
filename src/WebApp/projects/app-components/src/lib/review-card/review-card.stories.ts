import type { Meta, StoryObj } from '@storybook/angular';
import { ReviewCard } from './review-card';

const meta: Meta<ReviewCard> = {
  title: 'App/Cards/ReviewCard',
  component: ReviewCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    reviewerName: { control: 'text' },
    date: { control: 'text' },
    rating: { control: { type: 'number', min: 1, max: 5 } },
    reviewText: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ReviewCard>;

export const Default: Story = {
  args: {
    reviewerName: 'Sarah M.',
    date: 'December 15, 2025',
    rating: 5,
    reviewText: 'Jasmine is amazing! She did my box braids perfectly and the service was excellent. Will definitely come back!',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-review-card
        [reviewerName]="reviewerName"
        [date]="date"
        [rating]="rating"
        [reviewText]="reviewText"
        style="width: 400px;"
      ></lib-review-card>
    `,
  }),
};

export const FourStars: Story = {
  args: {
    reviewerName: 'Michelle K.',
    date: 'January 5, 2026',
    rating: 4,
    reviewText: 'Great experience overall. The braids look beautiful and lasted well. Only reason for 4 stars is the wait time was a bit long.',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-review-card
        [reviewerName]="reviewerName"
        [date]="date"
        [rating]="rating"
        [reviewText]="reviewText"
        style="width: 400px;"
      ></lib-review-card>
    `,
  }),
};

export const ReviewList: Story = {
  render: () => ({
    template: `
      <div style="width: 400px;">
        <lib-review-card
          reviewerName="Sarah M."
          date="December 15, 2025"
          [rating]="5"
          reviewText="Amazing experience! Will definitely come back!"
        ></lib-review-card>
        <lib-review-card
          reviewerName="Michelle K."
          date="January 5, 2026"
          [rating]="4"
          reviewText="Great braids, very professional service."
        ></lib-review-card>
      </div>
    `,
  }),
};
