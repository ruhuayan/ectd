'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

gulp.task('browserSync', function() {
    browserSync({
      server: {
        baseDir: './'
      }
    })
});

gulp.task('sass', function() {
    return gulp.src('./assets/layouts/layout/scss/*.scss') // Gets all files ending with .scss in app/scss and children dirs
      .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
      .pipe(gulp.dest('./assets/layouts/layout/css')) // Outputs it in the css folder
      .pipe(browserSync.reload({ // Reloading with Browser Sync
        stream: true
      }));
});

gulp.task('watch', ['sass', 'browserSync'], function() {
    gulp.watch('./assets/layouts/layout/scss/*.scss', ['sass']);
    // gulp.watch('assets/layouts/**/*.css', browserSync.reload);
    gulp.watch('views/*.html', browserSync.reload);
    gulp.watch('./js/**/*.js', browserSync.reload);
    gulp.watch('./dist/**/*.js', browserSync.reload);
})