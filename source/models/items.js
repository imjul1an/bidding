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
	var ext =  { createdDate: moment().toDate(), bids: [{date:moment().toDate(), bid: 0}]};
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
	db.items.update({itemId: itemId}, {$set: {lastBidUpdateDate: moment().toDate()}}, {multi: true}, function (err, count) {
		if (err) {
			return callback(err);
		}

		db.items.findAndModify({
			query: {itemId: itemId},
			update: {$inc: {redirectCount: 1}},
			'new': true
		}, callback);
	});
}