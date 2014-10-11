var request = require('request');
var testUtils = require('../utils');

describe('bidding.spec.js', function () {
	var apiUrl, url, payload, error, response, result, bidItem;

	beforeEach(function () {
		apiUrl = testUtils.getRootUrl() + '/api/bidding';
	});

	beforeEach(function () {
		url = apiUrl + '/item/' + 'qwe9123s';
	});

	describe('When user access the auction room', function () {

		beforeEach(function (done) {
			request({url: url, json: true}, function (err, resp, body) {
				response = resp;
				result = body;
				done(err);
			});
		});

		it('shoud respond 200(OK)', function () {
			expect(response.statusCode).to.equal(200);
		});
		
		xit('shoud respond with a picture of the current item', function () {

		});
	});
});