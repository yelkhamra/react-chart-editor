/* jest.config.js */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src/'],
  // Load shims/polyfills before test env
  setupFiles: ['<rootDir>/jest.polyfills.js', 'raf/polyfill'],
  // Configure Enzyme and other test utils after env
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Ensure Babel transforms run in Jest 30+
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  // Transform ESM in specific node_modules that ship ESM (e.g., cheerio used by enzyme)
  // Allow transforming cheerio (including nested under enzyme) and enzyme itself
  transformIgnorePatterns: ['node_modules/(?!(cheerio|enzyme)/)'],
  moduleNameMapper: {
    // Node core shims for browser-y libs
    '^stream$': require.resolve('stream-browserify'),
    '^buffer$': require.resolve('buffer/'),
    '^process$': require.resolve('process/browser'),
    '^util$': require.resolve('util/'),
    '^url$': require.resolve('url/'),
    '^querystring$': require.resolve('querystring-es3'),
    '^path$': require.resolve('path-browserify'),

    // Babel module-resolver aliases
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^lib/(.*)$': '<rootDir>/src/lib/$1',
    '^styles/(.*)$': '<rootDir>/src/styles/$1',

    // Styles
    '^.+\\.(css|scss)$': '<rootDir>/config/CSSStub.js',

    // Force Enzyme to resolve cheerio to root CJS (0.22.x) which provides lib/*
    '^cheerio$': '<rootDir>/node_modules/cheerio/lib/cheerio.js',
    '^cheerio/lib/(.*)$': '<rootDir>/node_modules/cheerio/lib/$1',



  },
};
