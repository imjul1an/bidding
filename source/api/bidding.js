"use strict";
var _ = require('underscore');

var items = require('../models/items');


module.exports = biddingService;

function biddingService (app) {
	app.get('/api/auction/:id',
		byId);

	function byId (req, res, next) {
		var id = req.params.id;

		items.findById(id, function (err, item) {
			if (err) {
				return next(err);
			}

			if(!item) {
				return next ({message: "item cannot be found", status: 404});
			}

			function extendWithHighestBid(item) {
				var highestBid = _.max(item.bids, function (bid) { return bid.bid; });
				var ext =  { highestBid: highestBid };
				return  _.extend(item, ext);
			}

			res.json(200, {item: extendWithHighestBid(item)});
		});
	}
}