import type { Meta, StoryObj } from '@storybook/angular';
import { BraiderCard } from './braider-card';

const meta: Meta<BraiderCard> = {
  title: 'App/Cards/BraiderCard',
  component: BraiderCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    name: { control: 'text' },
    location: { control: 'text' },
    rating: { control: { type: 'number', min: 1, max: 5 } },
    reviewCount: { control: 'number' },
    bio: { control: 'text' },
    specialties: { control: 'object' },
    imageUrl: { control: 'text' },
    initials: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<BraiderCard>;

export const Default: Story = {
  args: {
    name: 'Jasmine Williams',
    location: 'Toronto, ON',
    rating: 5,
    reviewCount: 128,
    bio: 'Specializing in protective styles with 10+ years of experience. Passionate about hair health and beautiful braids.',
    specialties: ['Box Braids', 'Cornrows', 'Twists'],
    imageUrl: '',
    initials: '👩🏾',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-braider-card
        [name]="name"
        [location]="location"
        [rating]="rating"
        [reviewCount]="reviewCount"
        [bio]="bio"
        [specialties]="specialties"
        [imageUrl]="imageUrl"
        [initials]="initials"
        style="width: 320px;"
      ></lib-braider-card>
    `,
  }),
};

export const WithImage: Story = {
  args: {
    name: 'Amara Johnson',
    location: 'Vancouver, BC',
    rating: 5,
    reviewCount: 95,
    bio: 'Expert in knotless braids and natural hair care.',
    specialties: ['Box Braids', 'Knotless Braids'],
    imageUrl: 'https://via.placeholder.com/320x250?text=Braider',
    initials: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-braider-card
        [name]="name"
        [location]="location"
        [rating]="rating"
        [reviewCount]="reviewCount"
        [bio]="bio"
        [specialties]="specialties"
        [imageUrl]="imageUrl"
        [initials]="initials"
        style="width: 320px;"
      ></lib-braider-card>
    `,
  }),
};

export const MinimalInfo: Story = {
  args: {
    name: 'Keisha Brown',
    location: 'Montreal, QC',
    rating: 4,
    reviewCount: 42,
    bio: '',
    specialties: ['Braids'],
    imageUrl: '',
    initials: '👩🏿',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-braider-card
        [name]="name"
        [location]="location"
        [rating]="rating"
        [reviewCount]="reviewCount"
        [bio]="bio"
        [specialties]="specialties"
        [imageUrl]="imageUrl"
        [initials]="initials"
        style="width: 320px;"
      ></lib-braider-card>
    `,
  }),
};
