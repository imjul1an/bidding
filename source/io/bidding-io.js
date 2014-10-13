"use strict";

var _ = require('underscore');

module.exports = biddingIoService;

function biddingIoService (io) {
	var clients = [];

	io.sockets.on('connection', function (client) {
		client.on('join',function(user){
			clients[client.id] = { name: user , bid: 0};
			io.sockets.emit('new:user', clients[client.id].name);
		});

		client.on('place:bid', function (bid) {
			clients[client.id].bid = bid;

			client.emit('last:bid', {
				name: clients[client.id].name,
				bid: clients[client.id].bid
			});

			broadcastHighestBid();

			function broadcastHighestBid () {
				var highest = _.max(_.values(clients), function (client) {return + client.bid});
				// if(bid > highest.bid) {
					io.sockets.emit('highest:bid', {
						name: highest.name,
						bid: highest.bid
					});
				// }
			}
		});

		client.on('delete:users', function () {
			clients = [];
			console.log(clients);
		});
	});
}