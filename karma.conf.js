module.exports = function(config) {
  
  var configuration = {
    frameworks: ['jasmine'],
    plugins: [ 'karma-jasmine', 'karma-chrome-launcher' ],
    files: [
      'css.js',
      'tests/*.js'
    ],
    browsers: [ 'Chrome' ],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    singleRun: true
  };

  if(process.env.TRAVIS){
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};