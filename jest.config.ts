export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
      '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
      '^@/(.*)$': '<rootDir>/src/$1',  // Handle path aliases (optional)
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest', // Transform TypeScript files
    },
    testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  };
  