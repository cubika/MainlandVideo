var http = require('http'),
	jsdom = require('jsdom'),
	fs = require('fs'),
	map = {};

function requestJSON(url, callback) {
	var req = http.request(url, function(res) {
		var buff = '';
		res.on('data', function(chunk) {
			buff += chunk;
		});
		res.on('end', function() {
			callback(JSON.parse(buff));
		});
	});
	req.end();
}

function Once(page) {
	requestJSON('http://www.tudou.com/list/albumData.action?&sort=1&tagType=3&firstTagId=5&page=' + page, function(result) {
		if(result.data.length == 0) {
			console.log("crawl to the end, exit...");
			fs.writeFile("../data/tudou.json", JSON.stringify(map));
			return;
		}
		result.data.forEach(function(data) {
			console.log(data.albumShortDesc);
			
			(function(url) {
				console.log(url);
				jsdom.env(url, function(error, window) {
					map[window.itemData.kw] = window.itemData.iid;
				});
			})(data.playUrl);
		});
		Once(page++);
	});
}

Once(1);
