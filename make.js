
require('nitro')(function (nitro) {

  nitro.task('jqlite.min.js', function () {
    nitro
      .load('jqlite.js')
      .process('uglify')
      .each(function (f) {
        var now = new Date();
        f.setSrc( '/* jqlite ' + now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() + ' */\n' + f.getSrc() );
      })
      .writeFile('jqlite.min.js');
  });

}).run();
