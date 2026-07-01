const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:8082',
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },
});
