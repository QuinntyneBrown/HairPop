module.exports = {
  displayName: 'hairpop',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['node_modules/', 'dist/'],
  testMatch: ['<rootDir>/projects/hairpop/src/**/*.spec.ts'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/projects/hairpop/src/app/$1'
  }
};
