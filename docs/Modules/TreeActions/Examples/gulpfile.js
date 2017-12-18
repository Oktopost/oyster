var gulp		= require('gulp');
var wrap 		= require('gulp-wrap');
var rename 		= require('gulp-rename');
var concat 		= require('gulp-concat');


const TARGET_DIR	= 'bin';
const TARGET_FILE	= 'app.js';

const NAMESPACE_JS_BUILD_NAME	= 'namespace.js';
const NAMESPACE_TEMPLATE		= 'bin/templates/namespace.wrap.js.template';


function getDependencies()
{
	var result = require('oktopost-namespace').getDependencies(
		__dirname,
		function () {},
		function (root)
		{
			var load = [
				root.Example.IntroExample,
				root.Example.ChainExample,
				root.Example.PathMatchExample
			];
		});
			
	return [TARGET_DIR + '/' + NAMESPACE_JS_BUILD_NAME].concat(result);			
}

gulp.task(
	'jquery',
	() =>
	{
		gulp.src(__dirname + '/node_modules/jquery/dist/jquery.js')
			.pipe(gulp.dest(TARGET_DIR));
	});

gulp.task(
	'namespace', 
	() => 
	{
		gulp.src('node_modules/oktopost-namespace/src/Namespace.js')
			.pipe(wrap({src: NAMESPACE_TEMPLATE}))
			.pipe(rename(NAMESPACE_JS_BUILD_NAME))
			.pipe(gulp.dest(TARGET_DIR));
	}
);

gulp.task(
	'build', 
	['jquery', 'namespace'],
	() => 
	{
		gulp.src(getDependencies())
			.pipe(concat(TARGET_FILE))
			.pipe(gulp.dest(TARGET_DIR));
	}
);