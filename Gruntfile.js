
module.exports = function(grunt) {
  'use strict';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    shell: {
      options: {
        stderr: false
      },
      'git-add': {
        command: 'git add --all'
      },
      'git-commit-version': {
        command: 'git commit -m "increasing version"'
      },
      'git-push': {
        command: 'git push origin master'
      },
      'git-status': {
        command: 'git status'
      },
      'npm-publish': {
        command: 'npm publish'
      }
    },
    'increase-version': {
      bower: {
        options: {
        },
        files: {
          src: [ 'bower.json' ]
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      min: {
        src: [
          '<%= pkg.main %>'
        ],
        dest: '<%= pkg.main.replace(/\\.js$/, \'.min.js\') %>'
      }
    },

    watch: {
      js: {
        files: [ 'Gruntfile.js', '<%= pkg.main %>', 'tests/**/*.js' ],
        tasks: [ 'jshint', 'karma', 'uglify' ]
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    jshint: {
      gruntfile: ['Gruntfile.js'],
      main: ['<%= pkg.main %>']
    }
  });

  grunt.registerTask('commit', function () {
    grunt.task.run([ 'jshint:main' ]);

    var cb = this.async(),
        exec = require('child_process').exec,
        cp = exec('git commit -a -m "' + arguments[0] + '" & git push origin master', {}, function (err, stdout, stderr) {
          if (err && options.failOnError) {
            grunt.warn(err);
          }
          cb();
        }.bind(this));

    cp.stdout.pipe(process.stdout);

  });

  grunt.registerTask('git:increase-version', [ 'shell:git-add', 'shell:git-commit-version', 'shell:git-push' ]);

  grunt.registerTask('publish', [ 'uglify:min', 'increase-version', 'git:increase-version', 'shell:npm-publish' ]);

  grunt.registerTask('dev', ['jshint', 'uglify', 'karma', 'watch']);

  grunt.registerTask('test', [ 'jshint', 'uglify', 'karma' ]);

};