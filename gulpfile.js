// Gulp tasks

// Load plugins
var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./dist"
    }
  })
});

gulp.task('bs-reload', function() {
  browserSync.reload();
})

// compile LESS to CSS
gulp.task('compile-less', function() {
  return gulp.src('src/styles/main.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(rename('main.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.reload({stream: true}));
});

// concatenate and minify javascript
gulp.task('scripts', function() {
  return gulp.src(['src/js/*.js'])
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({stream: true}));
});

// copy HTML files
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream: true}));
});

// compress and copy images
gulp.task('images', function () {
  return gulp.src('src/img/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.reload({stream: true}));
});

// clean up dist folder
gulp.task('clean', function(cb) {
  del(['dist/styles', 'dist/js', 'dist/img', 'dist/lib', 'dist/fonts'], cb)
});

// build task to populate the dist folder
gulp.task('build', ['clean'], function() {
  gulp.start('compile-less', 'scripts', 'html', 'images');
});

// watch task
gulp.task('watch', function() {
  gulp.watch('src/styles/*.less', ['compile-less']);
  gulp.watch('src/styles/main.css', ['bs-reload']);
  gulp.watch('src/*.html', ['html']);
  gulp.watch('src/img/*', ['images']);
  gulp.watch('src/js/*.js', ['scripts']);
});

// cleans dist, builds the files, starts a server, and watches files for changes
gulp.task('serve', ['clean', 'build', 'browser-sync', 'watch']);

// default task - calls serve
gulp.task('default', ['serve'])
