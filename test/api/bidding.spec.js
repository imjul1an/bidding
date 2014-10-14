var request = require('request');
var testUtils = require('../utils');
var io = require('socket.io-client');

describe('bidding.spec.js', function () {
	var apiUrl, url, response, result, payload, error;

	beforeEach(function () {
		apiUrl = testUtils.getRootUrl() + '/api';
	});

	beforeEach(function (done) {
		testUtils.createTestItem(function(err, item) {
			item = item;
			done(err);
		});
	});

	afterEach(function (done) {
		testUtils.clearCollection(function (err) {
			done(err);
		});
	});

	describe('When user access the auction room', function () {
		describe('and id is wrong', function () {
			beforeEach(function () {
				url = apiUrl + '/auction/' + '1234';
			});

			beforeEach(function (done) {
				request({url: url, json: true}, function (err, resp, body) {
					response = resp;
					result = body;
					done(err);
				});
			});

			it('should respond 404(Not Found)', function () {
				expect(response.statusCode).to.equal(404);
			});
		});

		describe('and id is ok', function () {
			beforeEach(function () {
				url = apiUrl + '/auction/' + 'ryrGV6';
			});

			beforeEach(function (done) {
				request({url: url, json: true}, function (err, resp, body) {
					response = resp;
					result = body;
					done(err);
				});
			});

			it('shoud respond 200 (OK)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('shoud respond with requested item id', function () {
				expect(result.item.itemId).to.equal('ryrGV6');
			});

			it('shoud respond with a picture of the current item', function () {
				expect(result.item.picture).to.be.ok;
			});

			it('shoud respond with a name of the current item', function () {
				expect(result.item.name).to.be.ok;
			});

			it('shoud respond with a description of the current item', function () {
				expect(result.item.description).to.be.ok;
			});

			it('shoud respond with the current highest bid of the current item', function () {
				expect(result.item.highestBid).to.be.ok;
			});
		});
	});

	describe('When user playing on specific item', function () {
		describe('and I am the only bidder on an item', function () {
			var userName, userBid, highestUserName, highestUserBid, julian;

			beforeEach(function () {
				url = apiUrl + '/auction/' + 'ryrGV6';
			});

			beforeEach(function (done) {
				request({url: url, json: true}, function (err, resp, body) {
					response = resp;
					result = body;
					done(err);
				});
			});

			beforeEach(function (done) {
				julian = io.connect('http://127.0.0.1:5000', {
					'reconnection delay' : 0,
					'reopen delay' : 0,
					'force new connection' : true});

				julian.on('connect', function (data) {
					julian.emit('join', 'Julian');
					julian.emit('place:bid', 30);
				});

				julian.on('last:bid', function (lastBid) {
					userName = lastBid.name;
					userBid = lastBid.bid;
				});

				julian.on('highest:bid', function (highestBid) {
					highestUserName = highestBid.name;
					highestUserBid = highestBid.bid;
					done();
				});
			});

			afterEach(function (done) {
				julian.emit('delete:users', '');
				julian.disconnect();
				done();
			});

			it('should return the bidder name - Julian', function () {
				expect(userName).to.equal('Julian');
			});

			it('should return the bid that I have placed 30', function () {
				expect(userBid).to.equal(30);
			});

			it('should return the highest bid equals to the one that I have placed 30', function () {
				expect(highestUserBid).to.equal(30);
			});

			it('should return my name as the highest bid user name - Julian', function () {
				expect(highestUserName).to.equal('Julian');
			});
		});

		describe('and multiple users bidding on an item - I am the first', function () {
			var julian, valdemar, lastBidderName, lastBidderBid, highestBidderName, highestUserBid;

			beforeEach(function () {
				url = apiUrl + '/auction/' + 'ryrGV6';
			});

			beforeEach(function (done) {
				request({url: url, json: true}, function (err, resp, body) {
					response = resp;
					result = body;
					done(err);
				});
			});

			beforeEach(function (done) {
				julian = io.connect('http://127.0.0.1:5000', {
					'reconnection delay' : 0,
					'reopen delay' : 0,
					'force new connection' : true});

				valdemar = io.connect('http://127.0.0.1:5000', {
						'reconnection delay' : 0,
						'reopen delay' : 0,
						'force new connection' : true});

				julian.on('connect', function (data) {
					julian.emit('join', 'Julian');
				});

				valdemar.on('connect', function (data) {
					valdemar.emit('join', 'Valdemar');
				});

				julian.emit('place:bid', 48);
				valdemar.emit('place:bid', 46);

				julian.on('last:bid', function (data) {
					lastBidderBid = data.bid;
					lastBidderName = data.name;
				});

				julian.on('highest:bid', function (data) {
					highestUserBid = data.bid;
					highestBidderName = data.name;
					done();
				});
			});

			afterEach(function (done){
				julian.emit('delete:users', '');
				julian.disconnect();
				valdemar.disconnect();
				done();
			});

			it('should return my name - Julian as a last bidder', function () {
				expect(lastBidderName).to.equal('Julian');
			});

			it('should return the latest bid that I have placed 46', function () {
				expect(lastBidderBid).to.equal(48);
			});

			it('should return my name - Julian as a highest bidder', function () {
				expect(highestBidderName).to.equal('Julian');
			});

			it('should return the highest bid that I have placed 46', function () {
				expect(highestUserBid).to.equal(48);
			});
		});

		describe('and multiple users bidding on an item - I am not the first', function() {
			var valdemarLastBidderBid, valdemarLastBidderName, valdemarHighestUserBid, highestBidderName, valdemarHighestBidderName, highestUserBid, lastBidderBid, lastBidderName, julian, valdemar;

			beforeEach(function () {
				url = apiUrl + '/auction/' + 'ryrGV6';
			});

			beforeEach(function (done) {
				request({url: url, json: true}, function (err, resp, body) {
					response = resp;
					result = body;
					done(err);
				});
			});

			beforeEach(function (done) {
				julian = io.connect('http://127.0.0.1:5000', {
					'reconnection delay' : 0,
					'reopen delay' : 0,
					'force new connection' : true});

				valdemar = io.connect('http://127.0.0.1:5000', {
						'reconnection delay' : 0,
						'reopen delay' : 0,
						'force new connection' : true});

				valdemar.on('connect', function (data) {
					valdemar.emit('join', 'Valdemar');
				});

				julian.on('last:bid', function (data) {
					lastBidderBid = data.bid;
					lastBidderName = data.name;
				});

				julian.on('highest:bid', function (data) {
					highestUserBid = data.bid;
					highestBidderName = data.name;
					done();
				});

				valdemar.on('last:bid', function (data) {
					valdemarLastBidderBid = data.bid;
					valdemarLastBidderName = data.name;
				});

				valdemar.on('highest:bid', function (data) {
					valdemarHighestUserBid = data.bid;
					valdemarHighestBidderName = data.name;
				});

				valdemar.emit('place:bid', 46);
			});

			afterEach(function (done) {
				valdemar.emit('delete:users', '');

				julian.disconnect();
				valdemar.disconnect();

				done();
			});

			it('should return the last bidder name - Valdemar', function () {
				expect(lastBidderName).to.equal('Valdemar');
			});

			it('should return the latest bid that Valdemar placed I have placed 44', function () {
				expect(lastBidderBid).to.equal(46);
			});

			it('should return name - Valdemar as a highest bidder', function () {
				expect(highestBidderName).to.equal('Valdemar');
			});

			it('should return the highest bid that I have placed 46', function () {
				expect(highestUserBid).to.equal(46);
			});
		});
	});

	describe('When user wants to place a new bid using RESR API', function () {
		describe('and the bid is missed', function () {
			beforeEach(function () {
				payload = {};
			});

			beforeEach(function () {
				url = apiUrl + '/auction/' + 'ryrGV6';
			});

			beforeEach(function (done) {
				request.post({url: url, body: payload, json:true}, function (err, res, body) {
					response = res;
					body = body;
					error = err;
					done(err);
				});
			});

			it('should return 400 (Bad Request)', function (){
				expect(response.statusCode).to.equal(400);
			});
		});

		describe('and the bid is ok', function () {
			beforeEach(function () {
				payload = { bid: '50' };
			});

			beforeEach(function () {
				url = apiUrl + '/auction/' + 'ryrGV6';
			});

			beforeEach(function (done) {
				request.post({url: url, body: payload, json:true}, function (err, res, body) {
					response = res;
					result = body;
					error = err;
					done(err);
				});
			});

			it('should return 200 (Created)', function () {
				expect(response.statusCode).to.equal(200);
			});

			it('should return last placed bid date', function () {
				expect(result.item.lastPlacedBidDate).to.be.ok;
			});

			it('should return last placed bid date', function () {
				expect(result.item.bids.length).to.equal(4);
			});
		});
	});
});