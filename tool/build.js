var fs = require('fs');
var path = require('path');
var log = require('./log');
var webpack = require('./webpack');

var logger = log("build", 'src/index.js');
logger.start();
var minDistPath = path.join(__dirname, './../dist/playground.min.js');
var distPath = path.join(__dirname, './../dist/playground.js');

webpack(
    path.join(__dirname, './../src/index.js'), minDistPath
).then(function () {
    var babel = fs.readFileSync(path.join(__dirname, '../node_modules/babel-standalone/babel.min.js'));
    var playground = fs.readFileSync(minDistPath);
    fs.writeFileSync(minDistPath, babel + playground);
    logger.finish();
}, function (e) {
    logger.error(e);
});

webpack(
    path.join(__dirname, './../src/index.js'), distPath, true
).then(function () {
    var babel = fs.readFileSync(path.join(__dirname, '../node_modules/babel-standalone/babel.js'));
    var playground = fs.readFileSync(distPath);
    fs.writeFileSync(distPath, babel + playground);
    logger.finish();
}, function (e) {
    logger.error(e);
});