var gulp = require('gulp-help')(require('gulp'));

gulp.task('production', 'Build static assets and compress for production', ['webpack:build']);
