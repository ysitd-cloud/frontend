const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');

gulp.task('build', () => gulp.src('src/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist')));

