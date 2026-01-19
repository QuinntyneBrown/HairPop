import type { Meta, StoryObj } from '@storybook/angular';
import { SpecialtyTag } from './specialty-tag';

const meta: Meta<SpecialtyTag> = {
  title: 'App/Data Display/SpecialtyTag',
  component: SpecialtyTag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    text: { control: 'text' },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
  },
};

export default meta;
type Story = StoryObj<SpecialtyTag>;

export const Default: Story = {
  args: {
    text: 'Box Braids',
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    text: 'Cornrows',
    size: 'small',
  },
};

export const TagList: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <lib-specialty-tag text="Box Braids"></lib-specialty-tag>
        <lib-specialty-tag text="Cornrows"></lib-specialty-tag>
        <lib-specialty-tag text="Twists"></lib-specialty-tag>
        <lib-specialty-tag text="Knotless Braids"></lib-specialty-tag>
        <lib-specialty-tag text="Senegalese Twists"></lib-specialty-tag>
      </div>
    `,
  }),
};
