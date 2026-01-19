import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NavSection } from './nav-section';
import { NavItem } from '../nav-item/nav-item';

const meta: Meta<NavSection> = {
  title: 'Admin/Navigation/NavSection',
  component: NavSection,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NavItem],
    }),
  ],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<NavSection>;

export const Default: Story = {
  args: {
    title: 'Main',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-nav-section [title]="title">
        <lib-nav-item icon="&#127968;" text="Dashboard" [active]="true"></lib-nav-item>
        <lib-nav-item icon="&#128100;" text="Users"></lib-nav-item>
        <lib-nav-item icon="&#128197;" text="Bookings"></lib-nav-item>
      </lib-nav-section>
    `,
  }),
};

export const WithoutTitle: Story = {
  args: {
    title: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-nav-section [title]="title">
        <lib-nav-item icon="&#127968;" text="Dashboard"></lib-nav-item>
        <lib-nav-item icon="&#128100;" text="Users"></lib-nav-item>
      </lib-nav-section>
    `,
  }),
};
