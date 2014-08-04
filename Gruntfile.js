module.exports = function (grunt) {	
	require('load-grunt-tasks')(grunt, ['grunt-*', 'grunt-bump']);
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		phantom: {
			dist: 'dist',
			compiled: 'standalone'
		},
		clean: {
			dist: ['<%= phantom.dist %>'],
			compiled: ['<%= phantom.compiled %>']
		},
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					dest: '<%= phantom.dist %>',
					src: [
						'*.hbs',
						'partials/*.hbs',
						'assets/{js,fonts}/*.*'
					]
				}]
			},
			compiled: {
				files: [{
					expand: true,
					dot: true,
					dest: '<%= phantom.compiled %>',
					src: [
						'*.hbs',
						'partials/*.hbs',
						'assets/{js,fonts,css}/*.*'
					]
				}]
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
			codes: {
				src: [
					'<%= phantom.compiled %>/partials/analytics.hbs',
					'<%= phantom.compiled %>/partials/disqus.hbs'
				],
				overwrite: true,
				replacements: [{
					from: /UA-21512134-2/,
					to: function(matchedWord, index, fullText, regexMatches) {
						return 'UA-XXXXXXXX-X';
					}
				},{
					from: /bartingerat/,
					to: function(matchedWord, index, fullText, regexMatches) {
						return 'yourDisqusShortname';
					}
				}]
			},
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
		},
		compress: {
			dist: {
				options: {
					archive: 'phantom.zip',
					mode: 'zip'
				},
				files: [
					{expand: true, src: "**/*", cwd: "dist/"}
				]
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

	grunt.registerTask('compile', [
		'clean:compiled',
		'jshint',
		'sass:dev',
		'copy:compiled',
		'replace:codes'
		]);

	grunt.task.registerTask('packtheme', '', function ( dir ) {
		var pkg = grunt.file.readJSON('package.json');
		var data = JSON.stringify({
			name: pkg.name,
			version: pkg.version
		});
		var dist = grunt.config('phantom.dist');
		var compiled = grunt.config('phantom.compiled');

		grunt.file.write(dist + '/package.json', data);
		grunt.file.write(compiled + '/package.json', data);
	});

	grunt.registerTask('release', ['build', 'compile', 'bump', 'packtheme', 'rsync']);
    grunt.registerTask('package', ['build', 'compile', 'packtheme', 'compress']);

};