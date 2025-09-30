const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

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
    .pipe(gulp.dest(paths.sass.dest));
}

// Watch SASS task
function watchSass() {
  gulp.watch(paths.sass.src, compileSass);
}

// Define complex tasks
const build = gulp.series(compileSass);
const watch = gulp.series(build, watchSass);

// Export tasks
exports.compileSass = compileSass;
exports.watch = watch;
exports.default = watch;