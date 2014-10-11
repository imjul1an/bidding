"use strict";

module.exports = {
	generate: generate
};

function generate (callback) {
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_0123456789";
	var stringLength = 6;

	return Array.apply(null, new Array(stringLength)).map(function () {
		return possible[Math.floor(Math.random() * possible.length)];
	}).join('');
}