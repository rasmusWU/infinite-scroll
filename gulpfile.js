var gulp = require("gulp");
var sass = require("gulp-sass");
var cleanCSS = require("gulp-clean-css");
var connect = require("gulp-connect");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var sourcemap = require("gulp-sourcemaps");
var imagemin = require("gulp-imagemin");
var imageResize = require('gulp-image-resize');

function processHTML() {
    return gulp.src("src/html/**/*.html")
    .pipe(gulp.dest("dist/"))
    .pipe(connect.reload());
}

function processSass() {
    return gulp.src("src/sass/**/*.scss")
    .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(cleanCSS({compatibility: "ie9"}))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("dist/assets/css"))
        .pipe(connect.reload());
}

function processJS() {
    return gulp.src("src/js/**/*.js")
    .pipe(sourcemap.init())
    .pipe(babel({
        presets: ["@babel/env"]
    }))
    .pipe(concat("all.js"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("dist/assets/js"))
    .pipe(connect.reload());
}

function processImages() {
    return gulp.src(["src/img/**/*", "!src/img/**/thumb.db"])
    .pipe(imagemin([
        imagemin.mozjpeg({ quality: 25 }),
        imagemin.optipng({ optimizationLevel: 1 })
    ]))
    .pipe(imageResize({
        width : 500,
        crop : false,
        upscale : false
    }))
    .pipe(gulp.dest("dist/assets/media"))
    .pipe(connect.reload());
}

function watch() {
    gulp.watch("src/sass/**/*.scss",
    {ignoreInitial: false},
    processSass);

    gulp.watch("src/html/**/*.html",
    {ignoreInitial: false},
    processHTML);

    gulp.watch("src/js/**/*.js",
    {ignoreInitial: false},
    processJS);

    gulp.watch("src/img/**/*",
    {ignoreInitial: false},
    processImages);
}

function server() {
    connect.server({
        root: 'dist',
        livereload: true
    });
};

gulp.task("default", gulp.parallel(server, watch));