import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    '../projects/admin-components/src/**/*.stories.@(js|ts)',
    '../projects/app-components/src/**/*.stories.@(js|ts)',
  ],
  framework: {
    name: '@storybook/angular',
    options: {
      enableIvy: true,
    },
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    check: false,
  },
};

export default config;
