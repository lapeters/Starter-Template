var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');


// Development Tasks
// -----------------

// Browser Sync server
gulp.task('browser-sync', ['sass'], function() {
	browserSync({
		server: {
			baseDir: 'app'
		}
	});
});

// Compiles files from _scss into dist folder and app. Also reloads Browser Sync.
gulp.task('sass', function(){
	return gulp.src('app/css/main.scss', {style: 'compressed'})
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.reload({stream:true}))
		.pipe(gulp.dest('app/css'));
});

// Transfer index.html to dist folder
gulp.task('html', function() {
	return gulp.src('app/index.html')
	.pipe(gulp.dest('dist'))
});

// The Watchers
gulp.task('watch', function(){
	gulp.watch('app/css/**', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**', browserSync.reload);
	gulp.watch('app/img/**', browserSync.reload);
});


// Omptimization Tasks
// -------------------

// Concatinate and minify JavaScript
gulp.task('scripts', function() {
	return gulp.src('app/js/*.js')
		.pipe(concat('main.js'))
			.pipe(rename({suffix: '.min'}))
			.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

// Optimizing Images
gulp.task('images', function() {
	return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg')
		.pipe(cache(imagemin({
			optimizationLevel: 5,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/img'));
});


// Build Sequence
// --------------

gulp.task('build', ['html', 'sass', 'scripts', 'images'])

gulp.task('default', ['browser-sync', 'watch']);
