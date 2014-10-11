var config = require('../config');

module.exports = {
	getRootUrl: getRootUrl
};

function getRootUrl () {
	return config.applicationUrl;
}