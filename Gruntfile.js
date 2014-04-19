module.exports = function (grunt) {	
	require('load-grunt-tasks')(grunt, ['grunt-*']);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options: {
					style: 'compressed',
					require: ['./helpers/url64.rb']
				},
				expand: true,
				cwd: './assets/scss/',
				src: ['*.scss', '!_*.scss'],
				dest: './assets/css/',
				ext: '.css'
			},
			dev: {
				options: {
					style: 'expanded',
					debugInfo: true,
					lineNumbers: true,
					require: ['./helpers/url64.rb']
				},
				expand: true,
				cwd: './assets/scss/',
				src: ['*.scss', '!_*.scss'],
				dest: './assets/css/',
				ext: '.css'
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'assets/**/*.js'],
			options: {
				curly:   true,
				eqeqeq:  true,
				immed:   true,
				latedef: true,
				newcap:  true,
				noarg:   true,
				sub:     true,
				undef:   true,
				boss:    true,
				eqnull:  true,
				browser: true,

				globals: {
					module:		true,
					require:	true,
					console:    true,
					$:          true,
					jQuery:     true
				}
			}
		},
		watch: {
			scss: {
				files: [
					'assets/**/*.{scss, scss}'
				],
				tasks: ['sass:dev']
			},
			livereload: {
				files: [
					'**/*.hbs',
					'assets/**/*.{css,js,png,jpg,gif,svg}'
				],
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			}
		}
	});

	// Default Task
	grunt.registerTask('dev', ['watch']);
};