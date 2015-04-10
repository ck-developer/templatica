var gulp            = require('gulp'),
    path            = require('path'),
    browserSync     = require('browser-sync'),
    reload          = browserSync.reload,
    mainBowerFiles  = require('main-bower-files'),
    $               = require('gulp-load-plugins')();

'use strict';

gulp.task('bower:update', function(){

    return $.bower({ cmd: 'update'});

});

gulp.task('bower', ['bower:update'],function(){

    return  gulp.src(mainBowerFiles())
                .pipe(gulp.dest('dist/assets/plugins'));

});

gulp.task('jade', function(){

    return  gulp.src('app/**/*.jade')
                .pipe($.plumber())
                .pipe($.jade({
                    pretty: true
                }))
                .pipe($.plumber.stop())
                .pipe(gulp.dest('dev'));

});

gulp.task('img', function(){

    return  gulp.src(['app/**/*.jpg', 'app/**/*.jpeg', 'app/**/*.png', 'app/**/*.gif', 'app/**/*.svg'])
        .pipe($.imageOptimization({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dev'))
        .pipe(gulp.dest('dist'));

});

gulp.task('sass', function(){

    return  gulp.src('app/**/*.scss')
                .pipe($.plumber())
                .pipe($.sourcemaps.init())
                .pipe($.sass())
                .pipe($.sourcemaps.write('.'))
                .pipe($.plumber.stop())
                .pipe(gulp.dest('dev'))
                .pipe(reload({stream: true}));

});

gulp.task('coffee', function(){

    return  gulp.src('app/**/*.coffee')
                .pipe($.plumber())
                .pipe($.sourcemaps.init())
                .pipe($.coffee({ bare: true }))
                .pipe($.sourcemaps.write('.'))
                .pipe($.plumber.stop())
                .pipe(gulp.dest('dev'))
                .pipe(reload({stream: true}));

});

gulp.task('build', ['bower', 'jade', 'sass', 'coffee'], function(){

    return  gulp.src(['app/**/*', '!app/**/*.coffee', '!app/**/*.scss', '!app/**/*.jade'])
                .pipe($.if('*.css', $.autoprefixer({
                    browsers: ['> 1%', 'last 2 versions', 'Chrome 30', 'Firefox 30', 'Explorer 7', 'Opera 12', 'Safari 6'],
                    cascade: false
                })))
                .pipe(gulp.dest('dev'));
});

gulp.task('serve', ['build'], function(){

    browserSync({
        server: {
            baseDir: "dev",
        },
        port: 8080,
        ui: {
            port: 8081
        }
    });

    gulp.watch("app/**/*.jade", ['jade']);
    gulp.watch("app/**/*.scss", ['sass']);
    gulp.watch("app/**/*.coffee", ['coffee']);
    gulp.watch("dev/**/*.html").on('change', reload);
});

gulp.task('serve:dist', ['dist'], function(){

    browserSync({
        server: {
            baseDir: "dist",
        },
        port: 8090,
        ui: {
            port: 8091
        }
    });
});

gulp.task('serve:test', ['dist'], function(){

    browserSync({
        server: {
            baseDir: "dist"
        },
        port: 9090,
        open: false,
        ui: false,
    });
});

gulp.task('dist', ['build'], function(){

    var assets = $.useref.assets();

    return  gulp.src(['dev/**/*.html', 'dev/*.html', 'dev/**/*.jpg', 'dev/**/*.jpeg', 'dev/**/*.png', 'dev/**/*.gif', 'dev/**/*.svg'])
                .pipe(assets)
                .pipe($.if('*.js', $.uglifyjs()))
                .pipe($.if('*.css', $.uglifycss()))
                .pipe(assets.restore())
                .pipe($.useref())
                .pipe(gulp.dest('dist'));
});

gulp.task('test', ['serve:test'], function() {
    return  gulp.src('dev/test/**/*.js')
                .pipe($.dalek({
                    browser: ['phantomjs', 'firefox']
                }));
});

gulp.task('default', function(){

});