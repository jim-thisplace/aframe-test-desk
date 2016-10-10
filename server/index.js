var path    = require('path');
var express = require('express');
var app     = express();
var PORT    = process.env.PORT || 3000;
// var ROOT    = path.normalize(__dirname + '/../');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.listen(PORT, function () {
    console.log('VR server listening on port ' + PORT);
});