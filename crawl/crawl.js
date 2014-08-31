var jsdom = require('jsdom'),
	fs = require('fs');

var address = require('./address.json');

function parseLinks(type, window) {
	var $ = window.$,
		picList = $(".show-pic"),
		result = {};
	picList.forEach(function(pic) {
		var a = $(this).find(a)[0],
			img = $(a).find("img")[0];

		var plid = $(a).attr('_s_v'),
			title = img.title;
		result[title] = plid;
	});
	fs.writeFile('../data/' + type + ".json", JSON.stringify(result));
}


for(var type in address) {
	var url = address[type];
	jsdom.env(url, ["http://code.jquery.com/jquery.js"],
		function(errors, window) {
		parseLinks(type, window);
	});
}