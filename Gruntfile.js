module.exports = function (grunt) {	
	require('load-grunt-tasks')(grunt, ['grunt-*', 'grunt-bump']);
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		phantom: {
			dist: 'dist'
		},
		clean: {
			dist: ['<%= phantom.dist %>']
		},
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					dest: '<%= phantom.dist %>',
					src: [
					'**/*.hbs',
					'assets/fonts/*.*'
					]
				}/*,{
					src: 'theme_package.json',
					dest: '<%= phantom.dist %>/package.json'
				}*/]
			}
		},
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
		cssmin: {
			dist: {
				files: {
					'<%= phantom.dist %>/assets/css/main.css': './assets/**/**.css'
				}
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
		},
		replace: {
			dist: {
				src: ['<%= phantom.dist %>/default.hbs'],
				overwrite: true,
				replacements: [{
					from: /<link rel="stylesheet" type="text\/css" href="\/assets\/css\/normalize.css" \/>\n/g,
					to: function(matchedWord, index, fullText, regexMatches) {
						return '';
					}
				}]
			}
		},
		bump: {
			options: {
				updateConfigs: ['pkg'],
				pushTo: 'origin master'
			}
		},
		rsync: {
			options: {
				args: ['--verbose'],
				exclude: ['.git*','*.scss','node_modules'],
				recursive: true
			},
			dev: {
				options: {
					src: '<%= phantom.dist %>/',
					dest: '/home/ubuntu/ghost/content/themes/phantom',
					host: 'ubuntu@bartinger.at',
					syncDestIgnoreExcl: true
				}
			}
		}
	});

	// Default Task
	grunt.registerTask('dev', [
		'jshint',
		'sass:dev',
		'watch'
		]);

	grunt.registerTask('build', [
		'clean:dist',
		'jshint',
		'copy:dist',
		'sass:dist',
		'cssmin:dist',
		'replace:dist'
		]);

	grunt.task.registerTask('packtheme', '', function () {
		var pkg = grunt.file.readJSON('package.json');
		grunt.file.write('dist/package.json', JSON.stringify({
			name: pkg.name,
			version: pkg.version
		}));
	});

	grunt.registerTask('release', ['build','bump', 'packtheme', 'rsync']);

};