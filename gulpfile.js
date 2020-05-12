var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    concat = require('gulp-concat'),
    tsProject = ts.createProject('tsconfig.json');

gulp.task('copy', async() => {
    await gulp.src('node_modules/createjs/builds/1.0.0/createjs.min.js')
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', gulp.series('copy', async() => {
    await gulp.src(['src/core/*.ts', 'src/scene/*.ts', 'src/*.ts'])
        .pipe(concat('zodream.ts'))
        .pipe(tsProject())
        .pipe(gulp.dest('dist/'));
}));