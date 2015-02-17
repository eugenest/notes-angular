var gulp = require('gulp');

var jshint    = require('gulp-jshint');
var concat    = require('gulp-concat');
var rename    = require('gulp-rename');
var uglify    = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var size      = require('gulp-size');
var sass      = require('gulp-sass');

gulp.task('lint', function() { 
  gulp.src('./notes/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('js-minify', function(){
    setTimeout(function () {
    gulp.src([
            './common/js/*.js',
            './notes/js/*.js'
            ])
        .pipe(concat('personal.js'))
        //.pipe(obfuscate({ replaceMethod: obfuscate.ZALGO }))
        .pipe(size())
        .pipe(gulp.dest('./build'))
        /*.pipe(rename('personal.min.js'))
        .pipe(uglify())
        .pipe(size())
        .pipe(gulp.dest('./personal/build'))*/;
      }, 200);
});
gulp.task('js-vendor-minify', function(){
    gulp.src([
      './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      './bower_components/spin.js/spin.js',
      './bower_components/angular-spinner/angular-spinner.min.js',
      './bower_components/angular-i18n/angular-locale_ru-ru.js'
      ])
    .pipe(concat('vendor.js'))
    .pipe(size())
    .pipe(gulp.dest('./build'))
    .pipe(rename('vendor.min.js'))
    .pipe(uglify())
    .pipe(size())
    .pipe(gulp.dest('./build'));
});

gulp.task('js-vendor-quickstart-minify', function(){
    gulp.src([
      './bower_components/jquery/dist/jquery.min.js',
      './bower_components/angular/angular.min.js',
      './bower_components/underscore/underscore-min.js',
      './bower_components/angular-route/angular-route.min.js',
      './bower_components/bootstrap/dist/js/bootstrap.min.js'
      ])
    .pipe(concat('vendor-quickstart.js'))
    .pipe(size())
    .pipe(gulp.dest('./build'))
    .pipe(rename('vendor-quickstart.min.js'))
    .pipe(uglify())
    .pipe(size())
    .pipe(gulp.dest('./build'));
});

gulp.task('css-minify', function(){
    setTimeout(function () {
    gulp.src('./common/css/*.css')
        .pipe(concat('personal.css'))
        .pipe(size())
        .pipe(gulp.dest('./build'))
        .pipe(rename('personal.min.css'))
        .pipe(minifyCSS())
        .pipe(size())
        .pipe(gulp.dest('./build'));
    }, 300);
});

gulp.task('css-vendor-minify', function(){
    gulp.src([
        './bower_components/bootstrap/dist/css/bootstrap.min.css',
        //'./bower_components/components-font-awesome/css/font-awesome.min.css', //problem with font paths
        ])
        .pipe(concat('vendor.css'))
        .pipe(size())
        .pipe(gulp.dest('./build'))
        .pipe(rename('vendor.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./build'))
        .pipe(size());
});

gulp.task('compile-sass', function(){
    setTimeout(function () {
    gulp.src('./common/css/*.scss')
        .pipe(size())
        .pipe(sass({errLogToConsole: true}))
        .pipe(size())
        .pipe(gulp.dest('./common/css'));
    }, 200);
});

gulp.task('default', ['watch']);

gulp.task('watch', function(){
  gulp.watch(["./notes/js/*.js", "./common/js/*.js"], ['js-minify']);
  gulp.watch("./common/css/*.scss", ['compile-sass','css-minify']);
});