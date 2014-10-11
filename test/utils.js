var config = require('../config');
var items = require('../source/models/items');

module.exports = {
	getRootUrl: getRootUrl,
	createTestItem: createTestItem,
	clearCollection: clearCollection
};

function getRootUrl () {
	return config.applicationUrl;
}

function clearCollection (callback) {
	items.clearCollection(callback);
}

function createTestItem (callback) {
	var item = {
		itemId: 'ryrGV6',
		name: 'watch',
		description: 'This Jacques silver chronograph pocket watch with minute repetition was made in Switzerland around 1910.',
		picture: 'http://d2c2dsgt13elzw.cloudfront.net/resources/630x473/21/56/2c8d-6b66-4e7c-8aa1-ae2f312dc07f.jpg'
	};

	items.create(item, function (err, shortcode) {
		if (err) {
			return callback(err);
		}
		callback(null, shortcode);
	});
}