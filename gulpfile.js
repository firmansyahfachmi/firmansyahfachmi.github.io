const gulp = require("gulp"),
  sass = require("gulp-sass"),
  imagemin = require("gulp-imagemin"),
  uglify = require("gulp-uglify"),
  concat = require("gulp-concat"),
  postCss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssnano = require("cssnano")

const paths = {
  styles: {
    src: ["./src/sass/*.scss", "./src/sass/**/*.scss"],
    dest: "./dist/assets/css",
  },
  scripts: {
    src: ["./src/js/*.js", "./src/js/libs/*.js"],
    dest: "./dist/assets/js",
  },
  image: {
    src: "./src/assets/images/*",
    dest: "./dist/assets/images",
  },
}

function copyHtml(cb) {
  return gulp.src("./src/*.html").pipe(gulp.dest("./dist"))
  cb()
}

function doStyle(cb) {
  return gulp
    .src(paths.styles.src)
    .pipe(sass({ outputStyle: "compressed" }))
    .on("error", sass.logError)
    .pipe(postCss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest(paths.styles.dest))
  cb()
}

function concatJs(cb) {
  return gulp
    .src(["./src/js/libs/*.js", "./src/js/*.js"])
    .pipe(concat("global-concat.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
  cb()
}

function concatCss(cb) {
  return gulp
    .src("./src/css/*.css")
    .pipe(concat("vendor.min.css"))
    .pipe(gulp.dest(paths.styles.dest))
  cb()
}

function imageMin(cb) {
  return gulp
    .src(paths.image.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.image.dest))
  cb()
}

function watch() {
  gulp.watch(paths.styles.src, doStyle)
  gulp.watch(paths.scripts.src, concatJs)
  gulp.watch("./src/css/*.css", concatCss)
  gulp.watch(paths.image.src, imageMin)
  gulp.watch("./src/*.html", copyHtml)
}

gulp.task("run", gulp.series(doStyle, concatJs, imageMin, copyHtml, concatCss))

gulp.task("default", gulp.series("run", watch))
