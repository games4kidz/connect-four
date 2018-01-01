/* eslint-env node */

'use strict';

// var puppeteer = require('puppeteer');
// process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function (config) {
  config.set({
    basePath: 'public',
    browsers: ['ChromeHeadlessCustom'],
    files: ['styles/main.css', 'scripts/modules.js', 'scripts/test.js'],
    reporters: ['dots'].concat(process.env.COVERAGE ? ['coverage'] : []),
    frameworks: ['mocha'],
    preprocessors: {
      '**/*.js': ['sourcemap'],
      'scripts/modules.js': process.env.COVERAGE ? ['coverage'] : []
    },
    coverageReporter: {
      type: 'json',
      dir: '../coverage/',
      subdir: '.',
      file: 'coverage-unmapped.json'
    },
    customLaunchers: {
      ChromeHeadlessCustom: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--headless']
      }
    }
  });
};
