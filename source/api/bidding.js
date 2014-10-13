"use strict";

var _ = require('underscore');
var items = require('../models/items');

module.exports = biddingService;

function biddingService (app) {

	app.get('/api/auction/:id',
		byId);

	app.post('/api/auction/:id',
		validateRequest,
		placeBid);

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

	function validateRequest(req, res, next) {
		var body = req.body;

		if(!body || !body.bid) {
			return next({message: 'missing bid', status: 400 });
		}

		next();
	}

	function placeBid(req, res, next) {
		var bid = req.body.bid;
		var id = req.params.id;

		items.update(id, bid, function (err, updatedItem) {
			if (err) {
				return next({message: 'Failed to update item', err: err, status: 500 });
			}

			res.json(200, {item: updatedItem});
		});
	}
}