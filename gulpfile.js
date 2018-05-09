const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');

gulp.task('dev', () => {
  // eslint-disable-next-line global-require
  browserSync.init(require('./bs-config'));
});

gulp.task('build', ['jspm', 'css'], () => gulp.src('src/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist')));

const plugins = [
  autoprefixer({ browsers: ['last 5 version'] }),
  cssnano(),
];

gulp.task('css', () => gulp.src('src/**/*.css')
  .pipe(sourcemaps.init())
  .pipe(postcss(plugins))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist')));


gulp.task('jspm', () => gulp.src('jspm_packages/**/*')
  .pipe(gulp.dest('dist/jspm_packages')));
