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
			
			client.broadcast.emit('last:bid', {
				name: clients[client.id].name,
				bid: clients[client.id].bid
			});

			emitHighestBid(bid);

			function emitHighestBid (bid) {
				var highest = _.max(Object.keys(clients), function (id) { return +clients[id].bid; });

				if(clients[highest].bid >= bid) {
					io.sockets.emit('highest:bid', {
						name: clients[client.id].name,
						bid: clients[client.id].bid
					});
				}
			}
		});
	});
}