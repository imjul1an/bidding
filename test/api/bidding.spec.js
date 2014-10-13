var request = require('request');
var testUtils = require('../utils');
var io = require('socket.io-client');
var socketURL = 'localhost:5000';

var options = {
	transports: ['websocket'],
	'force new connection': true
};

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
		describe('and user successfully connected to the auction room', function () {
			var userName, client1, client2;

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
				client1 = io.connect('http://127.0.0.1:5000', {
					'reconnection delay' : 0,
					'reopen delay' : 0,
					'force new connection' : true});

				client1.on('connect', function (data) {
					client1.emit('join', 'Tom');
				});

				client2 = io.connect('http://127.0.0.1:5000', {
					'reconnection delay' : 0,
					'reopen delay' : 0,
					'force new connection' : true});

				client2.on('new:user', function (name) {
					userName = name;
					done();
				});
			});

			afterEach(function (done){
				client1.emit('delete:users', '');
				client1.disconnect();
				client2.disconnect();
				done();
			});

			it('should broadcast new user to all connected users', function () {
				expect(userName).to.equal('Tom');
			});
		});

		describe('and user placed a bid on the item, when he is only one in the auction room', function () {
			var userName, userBid, highestUserName, highestUserBid, client;

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
				client = io.connect('http://127.0.0.1:5000', {
					'reconnection delay' : 0,
					'reopen delay' : 0,
					'force new connection' : true});

				client.on('connect', function (data) {
					client.emit('join', 'Julian');
					client.emit('place:bid', 30);
				});

				client.on('last:bid', function (lastBid) {
					userName = lastBid.name;
					userBid = lastBid.bid;
				});

				client.on('highest:bid', function (highestBid) {
					highestUserName = highestBid.name;
					highestUserBid = highestBid.bid;
					done();
				});
			});

			afterEach(function (done) {
				client.emit('delete:users', '');
				client.disconnect();
				done();
			});

			it('should return the bidder name', function () {
				expect(userName).to.equal('Julian');
			});

			it('should return the bidder bid value', function () {
				expect(userBid).to.equal(30);
			});

			it('should return the highest bid equals to the one that user passed', function () {
				expect(highestUserBid).to.equal(30);
			});

			it('should return the name of the highest bid user', function () {
				expect(highestUserName).to.equal('Julian');
			});
		});

		describe('and user placed a bid on the item, when there are a few users in the auction room, but he was a first bidder', function() {
			var userName, highestUserName, highestUserBid, client1, client2;

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
				// Client 1
				client1 = io.connect('http://127.0.0.1:5000', {
					'reconnection delay' : 0,
					'reopen delay' : 0,
					'force new connection' : true});

				client1.on('connect', function (data) {
					client1.emit('join', 'Tom');
				});

				// Client 2
				client2 = io.connect('http://127.0.0.1:5000', {
					'reconnection delay' : 0,
					'reopen delay' : 0,
					'force new connection' : true});

				client2.on('connect', function (data) {
					client2.emit('join', 'Julian');
				});
				
				client2.on('new:user', function (name) {
					userName = name;
				});

				client2.emit('place:bid', 25);

				client1.on('highest:bid', function (lastBid) {
					highestUserName = lastBid.name;
					highestUserBid = lastBid.bid;
					done();
				});
			});

			afterEach(function (done) {
				client1.emit('delete:users', '');

				client1.disconnect();
				client2.disconnect();

				done();
			});

			it('should detect a new user connected', function(){
				expect(userName).to.equal('Julian');
			});

			it('should broadcast the highest bid equal to 25', function () {
				expect(highestUserBid).to.equal(25);
			});

			it('should broadcast the user name of highest bidder equal to "Julian"', function () {
				expect(highestUserName).to.equal('Julian');
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