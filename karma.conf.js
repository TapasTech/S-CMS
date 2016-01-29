// Karma configuration
// Generated on Wed Jan 27 2016 12:44:21 GMT+0800 (CST)
const path = require('path')

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'src/**/__tests__/**/*.spec.js',
      'src/**/__tests__/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/__tests__/**/*.spec.js': ['webpack', 'sourcemap'],
      'src/**/__tests__/*.spec.js': ['webpack', 'sourcemap'],
    },


    // webpack config
    webpack: {
      devtool: 'inline-source-map',
      resolve: {
        modulesDirectories: [
          path.resolve('__mocks__'),
          path.resolve('node_modules')
        ],
        alias: {
          '#': path.resolve('src')
        }
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            include: /src|__mocks__/,
            query: {
              presets: ['react', 'es2015', 'stage-0'],
            }
          },
          {
            test: /\.less$/,
            loader: 'style!css!less'
          },
          {
            test: /\.(png|jpg|gif)$/,
            loader: 'url',
            query: {
              limit: 2048,
            }
          },
        ]
      }
    },


    // webpack-dev-middleware configuration
    webpackMiddleware: {
        noInfo: true
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
}
