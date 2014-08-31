var jsdom = require('jsdom'),
	fs = require('fs');

var address = require('./address.json');

function parseLinks($, result) {
	var picList = $(".show-pic"),
		next = $('.next');
	picList.each(function(index, pic) {
		var a = $(this).find('a')[0],
			img = $(a).find("img")[0];

		var plid = $(a).attr('_s_a'),
			title = img.title;
		result[title] = plid;
	});
	if(next.length) {
		parseLinks(next[0].href, result);
	}
}

function getContent(type, url) {
	var result = {};
	jsdom.env(url, ["http://code.jquery.com/jquery.js"],
		function(errors, window) {
		parseLinks(window.$, result);
		fs.writeFile('../data/' + type + ".json", JSON.stringify(result));
	});
}

for(var type in address) {
	var url = address[type];
	getContent(type, url);
}
