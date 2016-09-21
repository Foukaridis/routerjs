//Use Cluster to Ensure Error doesn't bring down Server
var cluster = require('cluster');
var os = require('os');

if (cluster.isMaster) {
  var children = os.cpus().map(cluster.fork);
  cluster.on('exit', function(worker) {
    cluster.fork();
  });
  return;
}

var service = require('./service/router');
var logger = require('./service/logger');
var express = require('express');
var metrics = require('./service/metrics');

var app = service();

//Define the Error Logger
var errorLogger = function (err, req, res, next) {
  logger.error({ req: req, res: res, error: err }, err.stack);
  next(err);
};

setInterval(function setInter() {
  var startTime = Date.now();
  setImmediate(function () {
    var data = process.memoryUsage();
    data.uptime = process.uptime();
    data.pid = process.pid;
    data.tags = ['process-metrics']; 
    data.lag = Date.now()-startTime;
    metrics.info(data,
       'process.pid: %d heapUsed: %d heapTotal: %d rss: %d uptime %d lag: %d',
       data.pid,
       data.heapUsed,
       data.heapTotal,
       data.rss,
       data.uptime,
       data.lag
       );
  });
}, 5000);

//Set the Port
app.set('port', process.env.PORT || 3000);

//Static Content
app.use(express.static(__dirname + '/public'));

//Get the Port
app.listen(app.get('port'));

//Bind the Error Logger to the App
app.use(errorLogger);

logger.info('Router Started on port %d', app.get('port'));
