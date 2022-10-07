const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './'
});

// Add any custom config to be passed to Jest
const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        // Handle module aliases (this will be automatically configured for you soon)
        '^@layouts(.*)$': '<rootDir>/src/layouts$1',
        '^@components(.*)$': '<rootDir>/src/components$1',
        '^@config(.*)$': '<rootDir>/src/config$1',
        '^@stores(.*)$': '<rootDir>/src/stores$1',
        '^@assets(.*)$': '<rootDir>/src/assets$1',
        '^@hooks(.*)$': '<rootDir>/src/hooks$1',
        '^@templates(.*)$': '<rootDir>/src/templates$1',
        '^@mocks(.*)$': '<rootDir>/src/mocks$1',
        '^@helpers(.*)$': '<rootDir>/src/lib/helpers$1',
        '^@api(.*)$': '<rootDir>/src/lib/api$1',
        '^@interfaces(.*)$': '<rootDir>/src/lib/interfaces$1',
        '^@types(.*)$': '<rootDir>/src/lib/types$1',
        '^@documentation(.*)$': '<rootDir>/src/lib/documentation$1'
    },
    testEnvironment: 'jest-environment-jsdom'
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
