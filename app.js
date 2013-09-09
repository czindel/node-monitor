
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var _ = require('underscore');
var os = require('os');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);


var server = http.createServer(app);

var io = require('socket.io').listen(server);

io.set('log level', 1);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});




io.sockets.on('connection', function (socket) {

	setInterval(function(){
		socket.emit('news', {
			totalmem: os.totalmem(),
			freemem : os.freemem(),
			cpus: getCpuUsage(os.cpus())
		});
	}, 3000)
});

function getCpuUsage(data){

  var cpus = _.pluck(data, 'times');

  var result = [];

  _.each(cpus, function(cpu){
     var total = 0;

      _.each(cpu, function(ticks){
        total += ticks;
      });

      var cpuPercents = {};

      _.each(cpu, function(value, key){
        cpuPercents[key] = value/total*100;
      });

      result.push(cpuPercents);
  })

  return result;
}


