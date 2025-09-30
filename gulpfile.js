const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');

// Set the compiler to node-sass explicitly to ensure compatibility
sass.compiler = require('node-sass');

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