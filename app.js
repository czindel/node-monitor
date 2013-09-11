
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
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
			cpus: os.cpus(),
      process: process.memoryUsage()
		});
	}, 2000)
});



