'use strict';

module.exports = function(grunt) {

	require('jit-grunt')(grunt, {
		validation: "grunt-html-validation",
		jscs: "grunt-jscs-checker",
	});

	require('time-grunt')(grunt);

	grunt.initConfig ({

		// configurable paths
		config: {
				src: 'source',
				build: 'build'
		},

		clean: {
			files: {
				src: [
					'.tmp',
					'<%= config.build %>/*',
					'!<%= config.build %>/.git*',
					'logs',
				],
			},
		},

		assemble: {
			options: {
				assets: '<%= config.build %>',
				engine: 'handlebars', // default
				flatten: false, // default
				layoutdir: '<%= config.src %>/layouts',
				layoutext: '.html',
				partials: ['<%= config.src %>/layouts/partials/*.html'],
				data: ['<%= config.src %>/data/*.{json,yml}'],
				plugins: ['assemble-contrib-sitemap', 'assemble-contrib-permalinks'],
				sitemap: {
					exclude: ['404'],
					robot: false,
				},
				permalinks: {
					preset: 'pretty',
				},
			},
			files: {
				expand: true,
				cwd: '<%= config.src %>/pages',
				src: ['*.{md,markdown}'],
				dest: '<%= config.build %>/',
				ext: '.html',
			},
		},

		compass: {
			options: {
				sassDir: '<%= config.src %>/styles',
				cssDir: '<%= config.build %>/css',
				imagesDir: '<%= config.src %>/images',
				javascriptsDir: '<%= config.src %>/scripts',
				fontsDir: '<%= config.src %>/fonts',
				importPath: '<%= config.src %>/styles',
				httpImagesPath: '/img',
				// httpGeneratedImagesPath: '/img',
				httpFontsPath: '/fonts',
				relativeAssets: true
			},
			dev: {
				options: {
					//generatedImagesDir: '.tmp/images/generated',
					noLineComments: true,
					outputStyle: 'expanded',
					sourcemap: true,
					watch: true, // when true, must run concurrent task
					debugInfo: true,
				},
			},
			dist: {
				debugInfo: false,
				sourcemap: false,
				assetCacheBuster: true,
			}
		},

		copy: {
			scripts: {
				files: [
					{ expand: true, dot: true, cwd: '<%= config.src %>/scripts', dest: '<%= config.build %>/js', src: ['vendor/*.js', '!vendor/modernizr.js'], filter: 'isFile' },
				],
			},
			dist: {
				files: [
					{ expand: true, dot: true, cwd: '<%= config.src %>/root', dest: '<%= config.build %>', src: ['**'] },
					{ expand: true, dot: true, cwd: '<%= config.src %>', dest: '<%= config.build %>', src: ['fonts/**'], },
				]
			},
			img: {
				files: [
					{ expand: true, cwd: '<%= config.src %>/images', src: ['**', '!<%= config.src %>/images/svg/**'], dest: '<%= config.build %>/images/'},
				]
			}
		},

		validation: {
			options: {
				reset: grunt.option('reset') || false,
				stoponerror: false,
				path: 'logs/html-status.json',
				reportpath: 'logs/html-report.json',
				doctype: 'HTML5',
				charset: 'utf-8',
			},
			files: {
				src: ['<%= config.build %>/*.html'],
			}
		},

		csslint: {
			options: {
				csslintrc: '.csslintrc',
				force: true,
				formatters: {
					id: 'text',
					dest: 'logs/csslint.txt',
				},
			},
			src: ['<%= config.build %>/css/style.css']
		},

		jshint: {
			files: '<%= config.src %>/scripts/{,*/}*.js',
			options: {
				jshintrc: '.jshintrc',
				ignores: ['<%= config.src %>/scripts/vendor/*.js'],
				reporter: 'checkstyle',
				reporterOutput: 'logs/jslint.xml',
				force: true,
			}
		},

		jscs: {
			src: ['<%= config.src %>/scripts/{,*/}*.js', '!<%= config.src %>/scripts/vendor/*.js'],
			options: {
					force: true,
					reporterOutput: 'logs/jscs.txt',
					//config: ".jscs.json", https://github.com/mdevils/node-jscs
					requireCurlyBraces: [ "if" ],
			},
		},

		autoprefixer: {
			options: {
				//browsers: ["last 2 version"], // By default, Autoprefixer uses > 1%, last 2 versions, Firefox ESR, Opera 12.1
			},
			files: {
				src: '<%= config.build %>/css/style.css',
				dest: '<%= config.build %>/css/style.css',
			},
		},

		csso: {
			options: {
				restructure: true,
				report: 'gzip',
			},
			files: {
				src: '<%= config.build %>/css/style.css',
				dest: '<%= config.build %>/css/style.css',
			},
		},

		bowercopy: {
			options: {
				srcPrefix: '.bower',
				destPrefix: '<%= config.src %>',
				report: true, //default
			},
			dist: {
				files: {
					'scripts/vendor/jquery.min.js' : 'jquery/jquery.min.js',
					'scripts/vendor/modernizr.js' : 'modernizr/modernizr.js',
					'styles/utilities/_normalize.scss' : 'normalize-css/normalize.css',
				},
			},
		},

		modernizr: {
			devFile: '<%= config.src %>/scripts/vendor/modernizr.js',
			outputFile: '<%= config.build %>/js/vendor/modernizr.js',
			files: [
				'<%= config.src %>/scripts/{,*/}*.js',
				'<%= config.src %>/styles/{,*/}*.scss',
				'!<%= config.src %>/scripts/vendor/*'
			],
			uglify: true,
		},

		concat: {
			options: {
				stripBanners: true,
			},
			files: {
				src: ['<%= config.src %>/scripts/plugins/*.js', '<%= config.src %>/scripts/main.js'],
				dest: '<%= config.build %>/js/script.js',
			},
		},

		removelogging: {
			dist: {
				src: '<%= config.build %>/js/script.js',
				dest: '<%= config.build %>/js/script.js',
			},
		},

		uglify: {
			options: {
				report: 'gzip',
				preserveComments: false,
			},
			dist: {
				src: '<%= config.build %>/js/script.js',
				dest: '<%= config.build %>/js/script.js',
			},
		},

		img: {
			dist: {
				src: ['<%= config.build %>/images/**/*.{gif,jpeg,jpg,png}'],
			}
		},

		svgmin: {
			options: {
				plugins: [
					{ removeViewBox: false },
					{ removeUselessStrokeAndFill: false },
					{ removeEmptyAttrs: false },
				]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.src %>/images/svg',
					src: '{,*/}*.svg',
					dest: '<%= config.build %>/images/svg'
				}]
			}
		},

		grunticon: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.build %>/images/svg',
					src: ['*.svg'],
					dest: '<%= config.build %>/images/svg',
				}],
			},
		},

		filerev: {
			files: {
				src: [
					'<%= config.build %>/js/{,*/}*.js',
					'!<%= config.build %>/js/vendor/jquery.min.js',
					'<%= config.build %>/css/{,*/}*.css',
					//'<%= config.build %>/images/{,*/}*.{gif,jpeg,jpg,png,webp}',
				]
			},
		},

		usemin: {
			options: {
				assetsDirs: ['<%= config.build %>/**/*'],
				patterns: {
					script: [[/(js\/script\.js)/, 'Replacing reference to script.js']]
				}
			},
			script: ['<%= config.build %>/**/*.html', '!<%= config.build %>/404.html', '!<%= config.build %>/images/**/*.html'],
			html: ['<%= config.build %>/**/*.html', '!<%= config.build %>/404.html'],
			css: ['<%= config.build %>/css/{,*/}*.css'],
		},

		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeAttributeQuotes: false, // true
					removeCommentsFromCDATA: true,
					removeEmptyAttributes: true,
					removeOptionalTags: true,
					removeRedundantAttributes: true,
					useShortDoctype: true
				},
				files: [{
					expand: true,
					cwd: '<%= config.build %>',
					src: '**/*.html',
					dest: '<%= config.build %>'
				}]
			}
		},

		connect: {
			livereload: {
				options: {
					port: 9000,
					livereload: true,
					hostname: 'localhost',
					open: true, // or disable and use grunt-devtools
					base: '<%= config.build %>',
				},
			},
		},

		watch: {
			styles: {
				files: ['<%= config.build %>/css/style.css'],
				tasks: ['autoprefixer'], // add test
				options: {
					spawn: true,
					livereload: true,
				}
			},
			scripts: {
				files: ['<%= config.src %>/scripts/**/*.js'],
				tasks: ['concat'], // add test
				options: {
					spawn: true,
					livereload: false,
				}
			},
			livereload: {
				files: ['<%= config.build %>/**/*.html', '<%= config.build %>/js/*.js'], // add img
				options: {
					spawn: true,
					livereload: true,
				}
			},
			assemble: {
				files: ['<%= config.src %>/**/*.{html,md}'],
				tasks: ['assemble'],
				options: {
					spawn: false,
					livereload: true,
				},
			},
			images: {
				files: ['<%= config.src %>/images/**/*.{gif,jpeg,jpg,png}'],
				tasks: ['copy:img'],
				options: {
					spawn: false,
					livereload: false,
				},
			},
			svg: {
				files: ['<%= config.src %>/images/svg/*.svg'],
				tasks: ['svgmin', 'grunticon'],
				options: {
					spawn: false,
					livereload: false,
				},
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
		},

		concurrent: {
			dist: ['assemble', 'compass:dist', 'bowercopy'],
			copy: ['copy:scripts', 'copy:dist', 'copy:img'],
			test: ['validation', 'test-js'], // add csslint (can't use force)
			optimize: ['css', 'js', 'imgmin'],
			server1: ['assemble', 'compass:dist', 'bowercopy'],
			server2: ['autoprefixer', 'modernizr', 'concat'],
			server3: ['compass:dev', 'watch'],
			options: {
				limit: 12,
			}
		},

	});

	grunt.loadNpmTasks('assemble');

	grunt.registerTask('serve', [
		'clean',
		'concurrent:server1',
		'concurrent:copy',
		'concurrent:server2',
		'connect',
		'concurrent:server3',
	]);

	grunt.registerTask('server', function () {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve']);
	});

	grunt.registerTask('css', ['autoprefixer', 'csso']); // add uncss

	grunt.registerTask('js', ['modernizr', 'concat', 'uglify']); // add removelogging

	grunt.registerTask('imgmin', ['img', 'svgmin', 'grunticon']);

	grunt.registerTask('test-js', ['jshint', 'jscs']);

	grunt.registerTask('ver', ['filerev', 'usemin']);

	grunt.registerTask('default', [
		'clean',
		'concurrent:dist',
		'concurrent:copy',
		'concurrent:test',
		'concurrent:optimize',
		'ver',
		'htmlmin',
	]);

};
