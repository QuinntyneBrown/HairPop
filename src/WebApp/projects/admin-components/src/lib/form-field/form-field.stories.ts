import type { Meta, StoryObj } from '@storybook/angular';
import { FormField } from './form-field';

const meta: Meta<FormField> = {
  title: 'Admin/Forms/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<FormField>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    hint: '',
    error: '',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-form-field
        [label]="label"
        [placeholder]="placeholder"
        [type]="type"
        [hint]="hint"
        [error]="error"
        [disabled]="disabled"
        style="width: 300px;"
      ></lib-form-field>
    `,
  }),
};

export const WithHint: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    hint: 'Must be at least 8 characters',
    error: '',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-form-field
        [label]="label"
        [placeholder]="placeholder"
        [type]="type"
        [hint]="hint"
        [error]="error"
        [disabled]="disabled"
        style="width: 300px;"
      ></lib-form-field>
    `,
  }),
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    hint: '',
    error: 'Invalid email address',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-form-field
        [label]="label"
        [placeholder]="placeholder"
        [type]="type"
        [hint]="hint"
        [error]="error"
        [disabled]="disabled"
        style="width: 300px;"
      ></lib-form-field>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    type: 'text',
    hint: '',
    error: '',
    disabled: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-form-field
        [label]="label"
        [placeholder]="placeholder"
        [type]="type"
        [hint]="hint"
        [error]="error"
        [disabled]="disabled"
        style="width: 300px;"
      ></lib-form-field>
    `,
  }),
};
