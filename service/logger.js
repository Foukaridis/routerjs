var bunyan = require('bunyan');

//Create the Standard Logger
var logger = bunyan.createLogger({
  name: "Router",
  streams: [
    { stream: process.stdout }
  ],
  serializers: bunyan.stdSerializers
});

module.exports = logger;