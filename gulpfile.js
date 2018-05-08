const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');

gulp.task('dev', () => {
  // eslint-disable-next-line global-require
  browserSync.init(require('./bs-config'));
});

gulp.task('build', () => gulp.src('src/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist')));
