"use strict";

var _ = require('underscore');

module.exports = biddingIoService;

function biddingIoService (io) {
	var clients = [];

	io.sockets.on('connection', function (socket) {
		socket.on('join',function(user){
			clients[socket.id] = { name: user , bid: 0};
			io.sockets.emit('new:user', clients[socket.id].name);
		});

		socket.on('place:bid', function (bid) {
			clients[socket.id].bid = bid;

			io.sockets.emit('last:bid', {
				name: clients[socket.id].name,
				bid: clients[socket.id].bid
			});

			var highest = _.max(_.values(clients), function (client) {return + client.bid;});
			io.sockets.emit('highest:bid', {
				name: highest.name,
				bid: highest.bid
			});
		});

		socket.on('delete:users', function () {
			clients = [];
			console.log('cleared...');
		});
	});
}