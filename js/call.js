(function() {
	$(document).on('click', 'a', function() {
		var self = this, 
			video = $("#video"),
			plid = $(this).data('plid'),
			vid = $(this).data('vid');
		if(plid) {
			// 获取vid
			$.getJSON('http://pl.hd.sohu.com/videolist?playlistid=' + plid + '&pagesize=999&callback=?', function(ret) {
				var videos = ret.videos;
				var ul = $('<ul>').insertAfter($(self));
				$.each(videos, function(index, video) {
					ul.append("<li><a href data-vid='" + video.vid + "'>" + video.showName + "</a></li>"); 
				});
			});
		}else if(vid) {
			$.getJSON('http://api.tv.sohu.com/video/playinfo/' + vid + '.json?api_key=f351515304020cad28c92f70f002261c&callback=?', function(ret) {
				var url = ret.data.url_high_mp4;
				video.attr('src', url);
			});
		}
		return false;
	});

})()