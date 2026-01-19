import type { Meta, StoryObj } from '@storybook/angular';
import { Checkbox } from './checkbox';

const meta: Meta<Checkbox> = {
  title: 'Admin/Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Checkbox>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
    disabled: false,
  },
};

export const WithoutLabel: Story = {
  args: {
    label: '',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <lib-checkbox label="Unchecked"></lib-checkbox>
        <lib-checkbox label="Disabled" [disabled]="true"></lib-checkbox>
      </div>
    `,
  }),
};
