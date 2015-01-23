module.exports = function(grunt) {
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
					'assets/{js,font}/*.*'
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
					'assets/{js,font,css}/*.*'
					]
				}]
			}
		},
		sass: {
			dist: {
				options: {
					style: 'compressed',
					require: ['./helpers/url64.rb'],
					sourcemap: 'none',
                    debugInfo: false,
                    lineNumbers: false
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
					require: ['./helpers/url64.rb'],
					sourcemap: 'inline',
                    debugInfo: false,
                    lineNumbers: false
				},
				expand: true,
				cwd: 'assets/scss/',
				src: ['*.scss', '!_*.scss'],
				dest: 'assets/css/',
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
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,

				globals: {
					module: true,
					require: true,
					console: true,
					$: true,
					jQuery: true
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
				}, {
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
					from: /\s*<link rel="stylesheet" type="text\/css" href="{{asset "\/css\/normalize.css"}}" \/>/,
					to: function(matchedWord, index, fullText, regexMatches) {
						return '';
					}
				}]
			}
		},
		bump: {
			options: {
				updateConfigs: ['pkg'],
				commitFiles: ['package.json', '<%= phantom.compiled %>/package.json'],
				push: true,
				pushTo: 'origin'
			}
		},
		githubAsset: {
			options: {
				credentials: grunt.file.readJSON('credentials.json'),
				repo: 'git@github.com:Bartinger/phantom.git',
				file: 'phantom.zip'
			}
		},
		rsync: {
			options: {
				args: ['--verbose'],
				exclude: ['.git*', '*.scss', 'node_modules'],
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
				files: [{
					expand: true,
					src: "**/*",
					cwd: "dist/"
				}]
			}
		},
		"git-describe": {
			all: {}
		},
		gitadd: {
			task: {
				files: {
					src: ['.txt']
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

	grunt.registerTask('compileDist', [
		'clean:dist',
		'jshint',
		'copy:dist',
		'sass:dist',
		'cssmin:dist',
		'replace:dist'
		]);

	grunt.registerTask('compileStandalone', [
		'clean:compiled',
		'jshint',
		'sass:dev',
		'copy:compiled',
		'replace:codes',
		'packtheme:standalone'
		]);

	grunt.task.registerTask('packtheme', '', function(type) {
		var pkg = grunt.file.readJSON('package.json');
		var data = JSON.stringify({
			name: pkg.name,
			version: pkg.version
		});
		var dist = grunt.config('phantom.dist');
		var compiled = grunt.config('phantom.compiled');
		if (!type || type === 'dist') {
			grunt.file.write(dist + '/package.json', data);
		}
		if (!type || type === 'standalone') {
			grunt.file.write(compiled + '/package.json', data);
		}
	});

	grunt.task.registerTask('verify', '', function() {
		grunt.event.once('git-describe', function (rev) {
			if (rev.dirty) {
				grunt.fail.fatal('You have uncommited changes. Please run "grunt build" and make sure everything is committed.');
			}
		});
		grunt.task.run('git-describe');
	});

	grunt.task.registerTask('pump', '', function (increment) {
		increment = getIncrementType(increment);
		grunt.task.run([
			'bump-only:' + increment,
			'packtheme',
			'bump-commit'
			]);
	});

	grunt.task.registerTask('release', '', function (increment) {
		increment = getIncrementType(increment);
		grunt.task.run([
			'build',
			'verify',
			'pump:' + increment,
			'compress',
			'githubAsset'
			]);
	});

	function getIncrementType(increment) {
		var incrementTypes = ['patch', 'minor', 'major'];
		if (increment) {
			if (incrementTypes.indexOf(increment) === -1) {
				grunt.fail.fatal('"' + increment + '" is not a valid option use one of ' + incrementTypes.join(', '));
			}
		} else {
			increment = incrementTypes[0];
		}
		return increment;
	}

	grunt.registerTask('build', ['compileStandalone', 'compileDist']);
	grunt.registerTask('package', ['build', 'compress']);

};