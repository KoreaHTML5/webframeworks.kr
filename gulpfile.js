/**
 * Created with JetBrains WebStorm.
 * User: leewonjae
 * Date: 2014. 8. 18.
 * Time: 오후 5:01
 * To change this template use File | Settings | File Templates.
 */
var gulp = require('gulp');
//var jekyll = require('gulp-jekyll');
var exec = require('child_process').exec;
var del = require('del');

//gulp.

gulp.task('jekyll', function(){

	exec('jekyll build', function(error, stdout, stderr){
		console.log(stdout);
	});


	return;
});

gulp.task('clean', del.bind(null, 'pages'));

gulp.task('default', ['clean', 'jekyll']);
