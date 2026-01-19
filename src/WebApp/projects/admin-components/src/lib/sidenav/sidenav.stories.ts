import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Sidenav } from './sidenav';
import { NavItem } from '../nav-item/nav-item';
import { NavSection } from '../nav-section/nav-section';

const meta: Meta<Sidenav> = {
  title: 'Admin/Navigation/Sidenav',
  component: Sidenav,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NavItem, NavSection],
    }),
  ],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    expanded: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Sidenav>;

export const Default: Story = {
  args: {
    expanded: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="height: 400px;">
        <lib-sidenav [expanded]="expanded">
          <lib-nav-section title="Main">
            <lib-nav-item icon="&#127968;" text="Dashboard" [active]="true"></lib-nav-item>
            <lib-nav-item icon="&#128100;" text="Users"></lib-nav-item>
            <lib-nav-item icon="&#128197;" text="Bookings"></lib-nav-item>
          </lib-nav-section>
          <lib-nav-section title="Content">
            <lib-nav-item icon="&#9733;" text="Braiders"></lib-nav-item>
            <lib-nav-item icon="&#128247;" text="Media"></lib-nav-item>
            <lib-nav-item icon="&#11088;" text="Reviews"></lib-nav-item>
          </lib-nav-section>
        </lib-sidenav>
      </div>
    `,
  }),
};

export const Collapsed: Story = {
  args: {
    expanded: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="height: 400px;">
        <lib-sidenav [expanded]="expanded">
          <lib-nav-section title="Main">
            <lib-nav-item icon="&#127968;" text="Dashboard" [active]="true"></lib-nav-item>
            <lib-nav-item icon="&#128100;" text="Users"></lib-nav-item>
            <lib-nav-item icon="&#128197;" text="Bookings"></lib-nav-item>
          </lib-nav-section>
        </lib-sidenav>
      </div>
    `,
  }),
};
