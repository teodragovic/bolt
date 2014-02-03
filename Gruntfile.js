'use strict';

module.exports = function(grunt) {

	//require('load-grunt-tasks')(grunt);

	require('jit-grunt')(grunt, {
		validation: "grunt-html-validation",
		jscs: "grunt-jscs-checker",
	});

	require('time-grunt')(grunt);

	grunt.initConfig ({

		//pkg: grunt.file.readJSON('package.json'),

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
				cssDir: '.tmp/styles',
				imagesDir: '<%= config.src %>/images',
				javascriptsDir: '<%= config.src %>/scripts',
				fontsDir: '<%= config.src %>/fonts',
				importPath: '<%= config.src %>/styles',
				httpImagesPath: '/img',
				httpGeneratedImagesPath: '/img',
				httpFontsPath: '/fonts',
				relativeAssets: true,
			},
			dev: {
				options: {
					generatedImagesDir: '.tmp/images/generated',
					// assetCacheBuster: false, // true?
					noLineComments: true,
					outputStyle: 'expanded',
					sourcemap: true,
					// watch: true, // must run concurrent
					debugInfo: true,
				},
			},
			dist: {
				debugInfo: false,
				sourcemap: false,
			}
		},

		sass: {
			options: {
				outputStyle: 'expanded',
				sourceComments: 'none',
				sourcemap: true,
			},
			files: {
				src: '<%= config.src %>/styles/style.scss',
				dest: '.tmp/css/style.css',
			},
		},

		copy: {
			server: {
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
					{ expand: true, cwd: '<%= config.src %>/images', src: ['**'], dest: '<%= config.build %>/images/'},
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
			src: ['.tmp/styles/style.css']
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
					requireCurlyBraces: [ "if" ]
			},
		},

		uncss: {
			dist: {
				options: {
					stylesheets: ['.tmp/styles/style.css'],
					//compress: true,
				},
				files: {
					'<%= config.build %>/css/style.css': ['<%= config.build %>/*.html'],
				},
			},
		},

		autoprefixer: {
			options: {
				browsers: ['last 2 version'],
			},
			dist: {
				src: '.tmp/styles/style.css', // change if using uncss
				dest: '<%= config.build %>/css/style.css',
			},
			server: {
				src: '.tmp/css/style.css',
				dest: '.tmp/css/style.css',
			}
		},

		csso: {
			options: {
				restructure: true, // ??? needs testing
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
					'scripts/plugins/fastclick.js' : 'fastclick/lib/fastclick.js',
					'scripts/vendor/modernizr.js' : 'modernizr/modernizr.js',
					'styles/utilities/_normalize.scss' : 'normalize-css/normalize.css',
				},
			},
		},

		modernizr: {
			devFile: '<%= config.src %>/scripts/vendor/modernizr.js',
			outputFile: '<%= config.build %>/js/vendor/modernizr.min.js',
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
/*
		imagemin: {
			dist: {
				options: {
					optimizationLevel: 7, // change to smaller number if too slow
				},
				files: [{
					expand: true,
					cwd: '<%= config.src %>/images/',
					src: '{,/}*.{gif,jpeg,jpg,png}',
					dest: '<%= config.build %>/images/',
				}]
			},
		},
*/

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
/*
		useminPrepare: {
			options: {
					dest: '<%= config.build %>'
			},
			html: ['<%= config.build %>/{,/}*.html']
		},
*/
		usemin: {
			options: {
				assetsDirs: ['<%= config.build %>'],
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
					src: '{,*/}*.html',
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
					open: true, // or use grunt-devtools
					base: ['<%= config.build %>', '.tmp'],
				},
			},
		},

		watch: {
			styles: {
				files: ['<%= config.src %>/styles/**/*.scss'],
				tasks: ['sass', 'autoprefixer:server'], // add test
				options: {
					spawn: true,
					livereload: false,
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
				files: ['<%= config.build %>/**/*.html', '.tmp/css/style.css', '<%= config.build %>/js/*.js'], // add img
				options: {
					spawn: false,
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
			gruntfile: {
				files: ['Gruntfile.js']
			},
		},

		concurrent: {
			dist: ['assemble', 'compass:dist', 'bowercopy'],
			test: ['validation', 'test-js'], // csslint (can't use force)
			optimize: ['css', 'js', 'imgmin'],
			server: ['assemble', 'sass', 'bowercopy'],
			scripts: ['modernizr', 'concat'],
			copy: ['copy:server', 'copy:dist', 'copy:img'],
			options: {
				limit: 12,
			}
		},

	});

	grunt.loadNpmTasks('assemble');

	grunt.registerTask('serve', [
		'clean',
		'concurrent:server',
		'autoprefixer:server',
		'copy:server',
		'concurrent:scripts',
		'connect',
		'watch',
	]);

	grunt.registerTask('server', function () {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve']);
	});

	grunt.registerTask('css', ['autoprefixer:dist', 'csso']); // uncss

	grunt.registerTask('js', ['modernizr', 'concat', 'uglify']); // removelogging

	grunt.registerTask('imgmin', ['img', 'svgmin', 'grunticon']); //imagemin

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


// run grunt-devtools

/*
### task list:
time grunt - times grunt tasks
jit-grunt - load tasks

clean:build - clean build dir before build task
clean:serve - clean tmp dir before serve task

assemble - generate html

sass - generate css
compass - generate css

exec:bower - run bower install
copy:bower - copy vendor scripts

validation - validate html
csslint - validate css
jshint - validate js
jscs - validate js

uncss - remove unused classes
autoprefixer - vendor prefixes for css
csso - compress css

modernizr - generate modernizr
concat - merge scripts
uglify - compress scripts

imagemin/img - optimize images
svgmin - optimize svg
grunticon - fallbacks for svg

rev - ads hash to filenames for caching
usemin (useminPrepare) - update reference to cached files

htmlmin - compress html

connect - runs server on localhost:9000, opens browser
watch - run tasks when files modified

newer: - run task only on modified files

concurrent: - make some task run async

split tasks to multiple files?
*/
