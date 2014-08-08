// Gulp
var gulp = require('gulp');

// Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var browserSync = require('browser-sync');
var htmlv = require('gulp-html-validator');

// Define our paths
var paths = {
	scripts: ['js/**/*.js', '!js/app.min.js'],
	sass: 'scss/**/*.scss',
	images: ['img/**/*', '!img/compressed']
};

var destPaths = {
	scripts: 'js',
	sass: 'css',
	images: 'img/compressed',
	html: 'validated'
};

// Lint, minify, and concat our JS
gulp.task('js', function() {
	return gulp.src(paths.scripts)
		.pipe(plumber())
		.pipe(changed(destPaths.scripts))
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest(destPaths.scripts));
});

// Compile our Sass
gulp.task('sass', function() {
	return gulp.src(paths.sass)
		.pipe(plumber())
		.pipe(changed(destPaths.sass))
		.pipe(sass({sourceComments: 'map', sourceMap: 'sass'}))
		.pipe(rename('app.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest(destPaths.sass));
});

// Compress images
gulp.task('images', function() {
	gulp.src(paths.images)
		.pipe(plumber())
		.pipe(changed(destPaths.images))
		.pipe(imagemin())
		.pipe(gulp.dest(destPaths.images));
});

// Validate HTML
gulp.task('validate', function() {
	gulp.src('*.html')
		.pipe(plumber())
		.pipe(changed(destPaths.html))
		.pipe(htmlv())
		.pipe(gulp.dest(destPaths.html));
});

// Browser Sync - autoreload the browser
gulp.task('browser-sync', function () {
	var files = [
		'**/*.html',
		'**/*.php',
		'js/app.min.js',
		'css/app.css',
		'img/**/*'
	];
	browserSync.init(files, {
		server: {
			baseDir: './'
		}
		// proxy: "gulp.dev" // Use instead if desired
	});
});

// Default Task
gulp.task('default', ['js', 'sass', 'validate', 'browser-sync', 'images'], function() {
	// Watch for changes made to files
	gulp.watch(paths.scripts, ['js']);
	gulp.watch(paths.sass, ['sass']);
	gulp.watch('*.html', ['validate']);
});
