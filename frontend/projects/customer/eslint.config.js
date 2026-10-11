// @ts-check
const { defineConfig } = require('eslint/config');
const rootConfig = require('../../eslint.config.js');

module.exports = defineConfig([
  ...rootConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'hp',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'hp',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    // Checkbox, radio and switch hosts are labels that wrap the native input their own template renders.
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/label-has-associated-control': 'off',
    },
  },
]);
