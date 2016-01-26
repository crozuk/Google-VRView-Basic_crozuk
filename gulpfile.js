var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var obfuscate = require('gulp-obfuscate');
var jsfuck = require('gulp-jsfuck');

gulp.task('js', function () {
   return gulp.src('scripts/min/*.js')
      .pipe(uglify())
      .pipe(concat('combined.js'))
      .pipe(gulp.dest('scripts/min/build'));
});

gulp.task('balls', function () {
	gulp.src('scripts/*.js')
		.pipe(obfuscate())
  		.pipe(gulp.dest('scripts/min/build/final/'))
});