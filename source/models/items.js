"use strict";

var _ = require('underscore');
var moment = require('moment');
var config = require('../../config');
var db = require('../db')(config);

module.exports = {
	create: create,
	findById: findById,
	update: update,
	clearCollection: clearCollection
};

function create (item, callback) {
	var ext =  { createdDate: moment().toDate() };
	item = _.extend(item, ext);
	db.items.save(item, callback);
}

function findById (itemId, callback) {
	db.items.findOne({itemId: itemId}, callback);
}

function clearCollection (callback) {
	db.items.remove(callback);
}

function update(itemId, bid, callback) {
	db.items.update({itemId: itemId}, {$set: {lastPlacedBidDate: moment().toDate()}}, {multi: true}, function (err, count) {
		if (err) {
			return callback(err);
		}

		db.items.findAndModify({
			query: {itemId: itemId},
			update: {$push: {bids: { date:moment().toDate(), bid: bid} } },
			'new': true
		}, callback);
	});
}