/* global require, process */
/* eslint-env es6 */

require('nitro')(function (nitro) {

  nitro.task('jqlite.min.js', function () {
    nitro
      .load('jqlite.js')
      .process('uglify')
      .each(function (f) {
        var now = new Date();
        f.setSrc( '/* jqlite ' + now.getFullYear() + '-' + ( now.getMonth() + 1 )+ '-' + now.getDate() + ' */\n' + f.getSrc() );
      })
      .writeFile('jqlite.min.js');
  });

  var pkgActions = {
    increaseVersion: function () {
      nitro.package('bower').setVersion( nitro.package('npm').increaseVersion().version() );
    }
  };

  nitro.task('pkg', function (target) {
    if( pkgActions[target] ) {
      return pkgActions[target]();
    }

    var pkg = require('./package');
    process.stdout.write(pkg[target]);
    process.exit(0);
  });

  nitro.task('dev', function () {
    nitro.watch('.')
      .when(['{,**/}*.js', '!jqlite.min.js', '!make.js'], ['test', 'jqlite.min.js']);
    nitro.livereload('.', { port: 55555 });
  });

  nitro.task('live', ['dev'], function () {
    nitro.server({
      root: '.',
      openInBrowser: true
    });
  });

}).run();
