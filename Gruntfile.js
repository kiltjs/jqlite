'use strict';

module.exports = function(grunt) {

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
        dest: '<%= pkg.main.replace(/\.js$/, \'.min.js\') %>'
      }
    }
  });

  grunt.registerTask('git:increase-version', [ 'shell:git-add', 'shell:git-commit-version', 'shell:git-push' ]);

  grunt.registerTask('publish', [ 'uglify:min', 'increase-version', 'git:increase-version', 'shell:npm-publish' ]);

};