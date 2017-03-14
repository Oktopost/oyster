var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var wrap = require('gulp-wrap');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var declare = require('gulp-declare');
var handlebars = require('gulp-handlebars');

var files = [
	'src/Oyster.js',
	'src/**/*'
];

var build = function () {
	gulp.src(files)
		.pipe(concat('oyster.js'))
		.pipe(gulp.dest('build'));
	
	gulp.src(['app/controllers/*', 'app/Boot.js'])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('build'));

	gulp.src('app/views/**/*')
		.pipe(handlebars())	
		.pipe(wrap('Handlebars.template(<%= contents %>)'))	
		.pipe(declare({
			namespace: 'Handlebars.templates',
			noRedeclare: true,
			processName: function(filePath) {		
				return declare.processNameByPath(filePath.replace('app/views/', ''));
			}
	}))	
	.pipe(concat('templates.js'))
	.pipe(gulp.dest('build'));
}


gulp.task('build', function () {
	build();
});

gulp.task('watch', function () {
	gulp.watch(['src/**/*', 'app/**/*'], ['build']);
})