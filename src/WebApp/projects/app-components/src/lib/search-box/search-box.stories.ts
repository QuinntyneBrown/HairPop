import type { Meta, StoryObj } from '@storybook/angular';
import { SearchBox } from './search-box';

const meta: Meta<SearchBox> = {
  title: 'App/Forms/SearchBox',
  component: SearchBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    placeholder: { control: 'text' },
    buttonText: { control: 'text' },
    value: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<SearchBox>;

export const Default: Story = {
  args: {
    placeholder: 'Search for braiders near you...',
    buttonText: 'Search',
    value: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-search-box
        [placeholder]="placeholder"
        [buttonText]="buttonText"
        [value]="value"
        style="width: 600px;"
      ></lib-search-box>
    `,
  }),
};

export const WithValue: Story = {
  args: {
    placeholder: 'Search for braiders near you...',
    buttonText: 'Search',
    value: 'Toronto, ON',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-search-box
        [placeholder]="placeholder"
        [buttonText]="buttonText"
        [value]="value"
        style="width: 600px;"
      ></lib-search-box>
    `,
  }),
};

export const CustomButton: Story = {
  args: {
    placeholder: 'Enter location...',
    buttonText: 'Find Braiders',
    value: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-search-box
        [placeholder]="placeholder"
        [buttonText]="buttonText"
        [value]="value"
        style="width: 600px;"
      ></lib-search-box>
    `,
  }),
};
