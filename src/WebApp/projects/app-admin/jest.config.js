module.exports = {
  displayName: 'hairpop-admin',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['node_modules/', 'dist/'],
  testMatch: ['<rootDir>/projects/hairpop-admin/src/**/*.spec.ts'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/projects/hairpop-admin/src/app/$1'
  }
};
