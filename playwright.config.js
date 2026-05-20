// Load environment variables from .env file
require('dotenv').config();

const { defineConfig } = require('@playwright/test');
const { config } = require('./config/env.js');

module.exports = defineConfig({
  testDir: './tests',
  //testMatch: '**/*.spec.js',
  timeout: 30 * 1000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }] ,['allure-playwright'] ],

  testMatch: '**/*.spec.js',
  use: {

    baseURL: config.baseURL,
    extraHTTPHeaders: {
      'Accept': 'application/json'
    }
  },

  
});
