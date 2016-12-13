var fs = require('fs');
var path = require('path');
var log = require('./log');
var webpack = require('./webpack');

var logger = log("build", 'src/index.js');
logger.start();
var distPath = path.join(__dirname, './../dist/playground.min.js');

webpack(
    path.join(__dirname, './../src/index.js'), distPath
).then(function () {
    var babel = fs.readFileSync(path.join(__dirname, '../node_modules/babel-standalone/babel.min.js'));
    var playground = fs.readFileSync(distPath);
    fs.writeFileSync(distPath, babel + playground);
    logger.finish();
}, function (e) {
    logger.error(e);
});