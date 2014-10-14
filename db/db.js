'use strict';

var moment = require('moment');
var items = require('../source/models/items');


createTestItem();

function createTestItem (callback) {
	var item = {
		bids: [
			{
				date:moment().toDate(), bid: 5
			},
			{
				date:moment().toDate(), bid: 14
			},
			{
				date:moment().toDate(), bid: 23
			}
		],
		itemId: 'ryrGV6',
		name: 'watch',
		description: 'This Jacques silver chronograph pocket watch with minute repetition was made in Switzerland around 1910.',
		picture: 'http://d2c2dsgt13elzw.cloudfront.net/resources/630x473/21/56/2c8d-6b66-4e7c-8aa1-ae2f312dc07f.jpg'
	};

	items.create(item, function (err, item) {
		if (err){
			console.log('Error: ' + err);
			process.exit(1);
		}

		console.log('Successfully created an item: ' + item.name);
		process.exit(0);
	});
}