
var v1 = require('./routes/v1');
var mdb = require('./db/db');
var stylus = require('stylus');
var express = require('express');
var app = express();
var nib = require('nib');

var port = 5000;

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', false)
    .use(nib());
}

app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
}));

app.use(express.static('public'));

app.set('view engine', 'jade');

app.set('views', __dirname + '/public/views');

v1.init();
mdb.init();

app.get('/', function (req, res) {
    res.render('page', {
        title: "V1 Defect Stats",
        asof: "As of: " + Date(),
    });
});

app.get('/chart', function (request, response) {
    if (response.statusCode == 200) {
        console.log("Requesting chart data");
        response.send([{
            team: 'desktop',
            num_defect: '500'
        }, {
            team: 'android',
            num_defect: '200'
        }]);
    } else {
        console.log(response.statusCode);
    }
});

app.get('/defects/history', function(request,response){
    mdb.getHistoricalDefectStats(response);
});

app.get('/defects', function (request, response) {
    if (response.statusCode == 200) {
        console.log("Requesting chart data");
        mdb.getDefectStats(response);
    } else {
        console.log(response.statusCode);
    }
});

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});