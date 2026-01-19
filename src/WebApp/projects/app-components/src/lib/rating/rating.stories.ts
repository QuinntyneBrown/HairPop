import type { Meta, StoryObj } from '@storybook/angular';
import { Rating } from './rating';

const meta: Meta<Rating> = {
  title: 'App/Data Display/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 5, step: 0.5 } },
    reviewCount: { control: 'number' },
    showCount: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Rating>;

export const FiveStars: Story = {
  args: {
    value: 5,
    reviewCount: 128,
    showCount: true,
  },
};

export const FourStars: Story = {
  args: {
    value: 4,
    reviewCount: 56,
    showCount: true,
  },
};

export const WithoutCount: Story = {
  args: {
    value: 5,
    reviewCount: 0,
    showCount: false,
  },
};

export const AllRatings: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <lib-rating [value]="5" [reviewCount]="150" [showCount]="true"></lib-rating>
        <lib-rating [value]="4" [reviewCount]="89" [showCount]="true"></lib-rating>
        <lib-rating [value]="3" [reviewCount]="34" [showCount]="true"></lib-rating>
        <lib-rating [value]="2" [reviewCount]="12" [showCount]="true"></lib-rating>
        <lib-rating [value]="1" [reviewCount]="5" [showCount]="true"></lib-rating>
      </div>
    `,
  }),
};
