var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    fileinclude = require('gulp-file-include'),
    htmlbeautify = require('gulp-html-beautify'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    postcss = require('gulp-postcss'),
    gcmq = require('gulp-group-css-media-queries'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
	return gulp.src('app/sass/**/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
     .pipe(sourcemaps.write())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
	.pipe(gcmq())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('fileinclude', function() {
    gulp.src(['templates/*.html'])
        .pipe(fileinclude({
            prefix: '@@'
        }))
        .pipe(htmlbeautify())
        .pipe(gulp.dest('app/'));
});

gulp.task('scripts', function(){
	return gulp.src([
		'app/libs/**/*.js'
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function(){
	return gulp.src('app/libs/**/*.css')
	.pipe(concat('libs.css'))
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});


gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('clearCache', function(){
	return gulp.cache.clearAll();
});

gulp.task('images', function(){
	return gulp.src('app/images/**/*').
	pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
	})))
	.pipe(gulp.dest('dist/images'));
});

gulp.task('watch', ['browser-sync','sass','fileinclude'], function(){
	gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('templates/**/*.html', ['fileinclude']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);

gulp.task('build', ['clean', 'images', 'sass'], function(){

	var buildCss = gulp.src('app/css/**/*')
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var buildJS = gulp.src('app/js/*')
	.pipe(gulp.dest('dist/js'));

	var buildHTML = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));

	var buildLibs = gulp.src('app/libs/**/*')
 	.pipe(gulp.dest('dist/libs'));

});
