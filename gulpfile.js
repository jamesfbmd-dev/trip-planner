const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');

// Define paths
const paths = {
  sass: {
    src: 'sass/**/*.scss',
    dest: 'css'
  },
  mainSass: 'sass/main.scss'
};

// Compile SASS task
function compileSass() {
  return gulp.src(paths.mainSass)
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('styles.css'))
    .pipe(gulp.dest(paths.sass.dest));
}

// Watch SASS task
function watch() {
  gulp.watch(paths.sass.src, compileSass);
}

// Export tasks
exports.compileSass = compileSass;
exports.watch = watch;
exports.default = watch;