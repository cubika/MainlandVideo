(function() {
	var video = $("#video"),
		list = $("#videoList"),
		container = $("#result-container");

	$.get('data/src.json', function(data) {
		for(var key in data) {
			container.append($("<a href class='u-blka' data-plid=" + data[key] + ">" + key + "</a>"));
		}
	});

	$(document).on('click', 'a', function() {
		var self = this, 
			plid = $(this).data('plid'),
			vid = $(this).data('vid');
		if(plid) {
			// 获取vid
			$.getJSON('http://pl.hd.sohu.com/videolist?playlistid=' + plid + '&pagesize=999&callback=?', function(ret) {
				var videos = ret.videos,
					ul = $('<ul>').appendTo(list.empty()).addClass('f-cb');
				$.each(videos, function(index, video) {
					ul.append("<li><a href class='u-blka' data-vid='" + video.vid + "'>" + video.showName + "</a></li>"); 
				});
			});
		}else if(vid) {
			$.getJSON('http://api.tv.sohu.com/video/playinfo/' + vid + '.json?api_key=f351515304020cad28c92f70f002261c&callback=?', function(ret) {
				var urls = ret.data.url_super_mp4.split(','),
					current = 0;
				video.attr('src', urls[current]);
				/* video.on('loadedmetadata', function(e) {
					var videoObject = e.target;
					var percentWidth = videoObject.clientWidth * 100 / videoObject.videoWidth;
					var videoHeight = videoObject.videoHeight * percentWidth / 100;
					video.height(videoHeight);
				}); */
				video.on('ended', function() {
					if(current == urls.length) return;
					video.attr('src', urls[++current]);
					video[0].load();
					video[0].play();
				});
			});
		}
		return false;
	});

})()