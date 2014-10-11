"use strict";

var items = require('../models/items');


module.exports = biddingService;

function biddingService (app) {
	app.get('/api/auction/:id',
		validateRequest,
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

			res.json(200, {item: item});
		});
	}

	function validateRequest (req, res, next) {
		var id = req.params.id;
		if(!id) {
			return next({message: 'missing id', status: 400});
		}

		next();
	}
}