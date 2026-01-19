import type { Meta, StoryObj } from '@storybook/angular';
import { Toggle } from './toggle';

const meta: Meta<Toggle> = {
  title: 'Admin/Forms/Toggle',
  component: Toggle,
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
type Story = StoryObj<Toggle>;

export const Default: Story = {
  args: {
    label: 'Enable notifications',
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
    label: 'Disabled toggle',
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <lib-toggle label="Default (off)"></lib-toggle>
        <lib-toggle label="Disabled (off)" [disabled]="true"></lib-toggle>
      </div>
    `,
  }),
};
