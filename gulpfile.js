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
var runSequence = require('run-sequence');

// Jekyll task, build with jekyll
gulp.task('jekyll-gh', function(cb){
	return exec('jekyll build --config _config.yml,_config_gh.yml', function(error, stdout, stderr){
		console.log(stdout);
		cb();
	});
});

gulp.task('jekyll', function(cb){
	return exec('jekyll build --config _config.yml', function(error, stdout, stderr){
		console.log(stdout);
		cb();
	});
});

// Github io page task, makes github.io page version
gulp.task('gh', ['clean', 'jekyll-gh'], function () {
	return gulp.src('publish/**/*')
			.pipe(deploy({
	  	remoteUrl:'https://github.com/KoreaHTML5/dev.koreahtml5.kr.git'
		}));
});

// Dist task, make distribution version with node application
gulp.task('dist', ['default'], function () {
	return gulp.src(['publish/**/*'], {base: '.'})
			.pipe(gulp.dest('dist'))
});

// Watch files changes
gulp.task('watch', function() {
	gulp.watch(['contents/**/*.html', 'contents/**/*.css', 'contents/**/*.js'], ['jekyll', reload]);
	gulp.watch(['contents/getstarted/**/*.md'], ['jekyll', reload]);
	gulp.watch(['contents/tutorials/**/*.md'], ['jekyll', reload]);
});

// Browser-sync for preview
gulp.task('browser-sync', function() {
	browserSync.init(null, {
		notify: false,
		server: {
			baseDir: 'publish'
		},
		port: 8888
	});
});

// Watch files for changes & reload
gulp.task('serve', ['default'], function (cb) {
	runSequence('browser-sync', 'watch', cb);
});

// Clean task
gulp.task('clean', del.bind(null, ['publish', 'dist']));

// Default task to build
gulp.task('default', ['clean'], function(cb) {
	runSequence('jekyll', cb);
});
