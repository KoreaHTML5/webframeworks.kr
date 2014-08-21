/**
 * Korea HTML5
 * Copyright 2014 Korea HTML5
 */

var gulp = require('gulp');
var exec = require('child_process').exec;
var del = require('del');
var deploy = require("gulp-gh-pages");
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var runSequence = require('run-sequence');
var port = 7001;

// Nodemon, execute node application. It will be refreshed if node files has
// been changed
gulp.task('nodemon', function (cb) {
	var init = false;
	nodemon({
		script: 'bin/main.js',
		watch: ['bin/main.js'],
		env: { 'NODE_ENV': 'development', 'PORT': port }
	})
	.on('start', function () {
		if (!init) {
			cb();
			init = true;
		}
	})
});

// Jekyll task, build with jekyll
gulp.task('jekyll', function(cb){
	return exec('jekyll build', function(error, stdout, stderr){
		console.log(stdout);
		cb();
	});
});

// Github io page task, makes github.io page version
gulp.task('gh', ['default'], function () {
	return gulp.src('publish/**/*')
			.pipe(deploy({
	  	remoteUrl:'https://github.com/KoreaHTML5/dev.koreahtml5.kr.git'
		}));
});

// Dist task, make distribution version with node application
gulp.task('dist', ['default'], function () {
	return gulp.src(['publish/**/*', 'bin/**'], {base: '.'})
			.pipe(gulp.dest('dist'))
});

// Watch files changes
gulp.task('watch', function() {
	gulp.watch(['contents/**/*.html'], ['jekyll', reload]);
	gulp.watch(['contents/_posts/**/*.md'], ['jekyll', reload]);
});

// Browser-sync for preview
gulp.task('browser-sync', function() {
	browserSync.init(null, {
		proxy: 'http://localhost:' + port,
		port: 7000
	});
});

// Watch files for changes & reload
gulp.task('serve', ['default'], function (cb) {
	runSequence('nodemon', 'browser-sync', 'watch', cb);
});

// Clean task
gulp.task('clean', del.bind(null, ['publish', 'dist']));

// Default task to build
gulp.task('default', ['clean'], function(cb) {
	runSequence('jekyll', cb);
});
