#!/usr/bin/env node

var express = require('express');
var http = require('http')
var path = require('path');
var socketio = require('socket.io');


/**
 * Webserver config
 */
var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	//app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('MarioClock'));
	app.use(express.session());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

// Socket IO
var io = socketio.listen(server);
io.set('log level', 0);

/**
 * Webserver routes
 */

app.get('/', function (req, res){
	res.render('index');
});

app.get('/message', function (req, res){
	console.log(req.query.broadcast);
	var id = req.query.broadcast;

	io.sockets.emit( 'text', id );
	res.send(200);
});

app.get('/reset', function (req, res){
	console.log(req.query.to);
	var id = req.query.to;

	io.sockets.emit( 'reset', id );
	res.send(200);
});

