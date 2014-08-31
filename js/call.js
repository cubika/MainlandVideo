(function() {
	var video = $("#video"),
		list = $("#videoList"),
		container = $("#result-container");

		$("#video-container").resizable({
			aspectRatio: 89/50
		}).draggable();

	$.get('data/src.json', function(data) {
		for(var key in data) {
			container.append($("<a href class='u-blka' data-plid=" + data[key] + ">" + key + "</a>"));
		}
	});

	$('#content').on('click', 'a', function() {
		var self = this, 
			plid = $(this).data('plid'),
			vid = $(this).data('vid');
		if(plid) {
			// 获取vid
			$.getJSON('http://pl.hd.sohu.com/videolist?playlistid=' + plid + '&pagesize=999&callback=?', function(ret) {
				var videos = ret.videos,
					ul = $('<ul>').addClass('f-cb');
				$.each(videos, function(index, video) {
					ul.append("<li><a href class='u-blka' data-vid='" + video.vid + "'>" + video.showName + "</a></li>"); 
				});
				ul.appendTo(list.empty()).hide().fadeIn('slow');
			});
		}else if(vid) {
			// 获取src
			$.getJSON('http://api.tv.sohu.com/video/playinfo/' + vid + '.json?api_key=f351515304020cad28c92f70f002261c&callback=?', function(ret) {
				var urls = ret.data.url_super_mp4.split(','),
					current = 0;
				video.attr('src', urls[current]);

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

	$("#nav a").on('click', function() {
		var type = $(this).data('type');
		container.empty();
		list.empty();
		$.get('data/'+ type +'.json', function(data) {
			for(var key in data) {
				container.append($("<a href class='u-blka' data-plid=" + data[key] + ">" + key + "</a>"));
			}
		});
		return false;
	});

})()