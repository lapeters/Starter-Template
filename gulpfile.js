var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	browserSync = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	del = require('del');


// Development Tasks
// -----------------

// Browser Sync server
gulp.task('browser-sync', ['styles'], function() {
	browserSync({
		server: {
			baseDir: 'app'
		}
	});
});

// Compiles files from _scss into dist folder and app. Also reloads Browser Sync.
gulp.task('styles', function(){
	return sass('app/assets/css/main.scss', { style: 'expanded' })
		.pipe(autoprefixer('last 2 version'))
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(cssnano())
		.pipe(browserSync.reload({stream:true}))
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(gulp.dest('app/assets/css'))
});

// Transfer index.html to dist folder
gulp.task('html', function() {
	return gulp.src('app/index.html')
	.pipe(gulp.dest('dist'))
});

// The Watchers
gulp.task('watch', function(){
	gulp.watch('app/assets/css/**', ['styles']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/assets/js/**', browserSync.reload);
	gulp.watch('app/assets/img/**', browserSync.reload);
});


// Omptimization Tasks
// -------------------

// Concatinate and minify JavaScript
gulp.task('scripts', function() {
	return gulp.src('app/assets/js/*.js')
		.pipe(concat('functions.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js'));
});

// Optimizing Images
gulp.task('images', function() {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin({
			optimizationLevel: 7,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/assets/img'));
});

gulp.task('clean', function(){
	return del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img']);
});


// Build Sequence
// --------------

gulp.task('build', ['clean'], function(){
	gulp.start('styles', 'scripts', 'html', 'images');
});

gulp.task('default', ['browser-sync', 'watch']);
