var bunyan = require('bunyan');

//Create the Metrics Logger
var metrics = bunyan.createLogger({
  name: "Metrics",
  streams: [
    {
      level: 'info',
      stream: process.stdout
    }
  ],
  serializers: bunyan.stdSerializers
});

module.exports = metrics;