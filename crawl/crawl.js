var jsdom = require('jsdom'),
	fs = require('fs');

var address = require('./address.json');

function parseLinks($, type, result) {
	var picList = $(".show-pic"),
		next = $('.next');
	picList.each(function(index, pic) {
		var a = $(this).find('a')[0],
			img = $(a).find("img")[0];

		var plid = $(a).attr('_s_a'),
			title = img.title;
		result[title] = plid;
	});
	console.log(type + " page: " + $('.color5')[0].innerHTML);
	if(next.length) {
		jsdom.env(next[0].href, ["http://code.jquery.com/jquery.js"],
			function(erros, window) {
			parseLinks(window.$, type, result);
		});
	}else{
		console.log(type + " come to end ");
		fs.writeFile('../data/' + type + ".json", JSON.stringify(result));
	}
}

/*
for(var type in address) {
	var url = address[type];
	(function(type, url) {
	jsdom.env(url, ["http://code.jquery.com/jquery.js"],
		function(errors, window) {
			parseLinks(window.$, type, {});
		});
	})(type, url);
}
*/

var type = process.argv[2];
jsdom.env(address[type], ["http://code.jquery.com/jquery.js"],
function(errors, window) {
	parseLinks(window.$, type, {});
});
