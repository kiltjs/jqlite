module.exports = function(config) {
  
  var configuration = {
    frameworks: ['jasmine'],
    plugins: [ 'karma-jasmine', 'karma-chrome-launcher', 'karma-firefox-launcher' ],
    files: [
      'jqlite.js',
      'tests/*.js'
    ],
    browsers: [ 'Chrome', 'Firefox' ],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    singleRun: true
  };

  if(process.env.TRAVIS){
    configuration.browsers = [ 'Chrome_travis_ci', 'Firefox' ];
  } else if(process.env.WERCKER){
    configuration.browsers = [ 'Chrome' ];
  }

  config.set(configuration);
};