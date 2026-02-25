module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'backend/src/**/*.js',
    'frontend/main-app/**/*.{ts,tsx}',
    '!node_modules/**',
    '!dist/**',
  ],
  testMatch: [
    '**/tests/**/*.test.cjs',
    '**/?(*.)+(spec|test).cjs',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.cjs'],
  testTimeout: 10000,
};
