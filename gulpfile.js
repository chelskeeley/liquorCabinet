const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('babelify');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const plumber = require('gulp-plumber');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const notify = require('gulp-notify');
const browserify = require('browserify');


gulp.task('styles', () => {
    return gulp.src('./dev/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./public/styles'))
        .pipe(reload({ stream: true }));
});

gulp.task('scripts', () => {
    return browserify('dev/scripts/app.js', { debug: true })
        .transform('babelify', {
            sourceMaps: true,
            presets: ['es2015', 'react']
        })
        .bundle()
        .on('error', notify.onError({
            message: "Error: <%= error.message %>",
            title: 'Error in JS 💀'
        }))
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest('public/scripts'))
        .pipe(reload({ stream: true }));
});

gulp.task('browser-sync', () => {
    return browserSync.init({
        server: {
            baseDir: './'
        },
        middleware: [historyApiFallback()]
    });
});

gulp.task('default', ['browser-sync', 'scripts', 'styles'], () => {
    gulp.watch('dev/**/*.js', ['scripts']);
    gulp.watch('dev/**/*.scss', ['styles']);
    gulp.watch('*.html', reload);
    gulp.watch('./public/styles/style.css', reload);
});