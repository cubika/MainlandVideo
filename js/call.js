(function() {
	var video = $("#video"),
		current = 0, limit = 20,
		currentType = 'src',
		sourceList = [],
		typeMap = {},
		idMap = {},
		list = $("#videoList"),
		container = $("#result-container");

	$("#video-container").resizable({
		aspectRatio: 89/50
	}).draggable();

	var jxhr = [];
	$.each(['src', 'neidi', 'gangju', 'meiju', 'hanju', "movie", "comic"], function(index, type){
		jxhr.push($.getJSON('data/' + type + '.json', function(result) {
			typeMap[type] = result;
			$.extend(idMap, result);
			$.merge(sourceList, Object.keys(result));
		}));
	});

	$.when.apply($, jxhr).done(function() {
		$("#search").autocomplete({
			source: sourceList,
			select: function(event, ui) {
				var term = ui.item.value,
					plid = idMap[term];
				container.empty();
				list.empty();
				container.append($("<a href class='u-blka' data-plid=" + plid + ">" + term + "</a>"));
				getVid(plid);
			}
		});
		appendTV();
	});

	function appendTV() {
		container.empty();
		list.empty();
		var data = typeMap[currentType],
			keys = Object.keys(data);
		for(i=current; i<keys.length && i<current+limit; i++) {
			container.append($("<a href class='u-blka' data-plid=" + data[keys[i]] + ">" + keys[i] + "</a>"));
		}
		current += limit;
	}

	function getVid(plid) {
		// 获取vid
		$.getJSON('http://pl.hd.sohu.com/videolist?playlistid=' + plid + '&pagesize=999&callback=?', function(ret) {
			var videos = ret.videos,
				ul = $('<ul>').addClass('f-cb');
			$.each(videos, function(index, video) {
				ul.append("<li><a href class='u-blka' data-vid='" + video.vid + "'>" + video.showName + "</a></li>"); 
			});
			ul.appendTo(list.empty()).hide().fadeIn('slow');
		});
	}

	$('#content').on('click', 'a', function() {
		var self = this, 
			plid = $(this).data('plid'),
			vid = $(this).data('vid');
		if(plid) {
			getVid(plid);
		}else if(vid) {
			// 获取src
			$.getJSON('http://api.tv.sohu.com/video/playinfo/' + vid + '.json?api_key=f351515304020cad28c92f70f002261c&callback=?', function(ret) {
				var urls = (ret.data.url_super_mp4 || ret.data.url_high_mp4).split(','),
					index = 0;
				video.attr('src', urls[index]);

				video.on('ended', function() {
					if(index == urls.length) return;
					video.attr('src', urls[++index]);
					video[0].load();
					video[0].play();
				});
			});
		}
		return false;
	});

	$("#nav a").on('click', function() {
		var type = $(this).data('type');
		currentType = type;
		current = 0,
		appendTV();
		return false;
	});

	$("#refresh").on('click', function() {
		$(this).css('transform', 'rotate(360deg)');
		appendTV();
		return false;
	});

	video.on('mousedown', function (e) {
    var wrapper = $('#video-container'),
        rect = wrapper[0].getBoundingClientRect(),
        y = e.clientY - rect.top;
	    if (y > video.height() - 40) {
	        wrapper.draggable('disable');
	    }
	});

	video.on('mouseup', function (e) {
	    $('#video-container').draggable('enable');
	});

	/* video control shortcuts */

	function toggleFullScreen(videoElement) {
	  if (!document.fullscreenElement &&    // alternative standard method
	      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
	    if (videoElement.requestFullscreen) {
	      videoElement.requestFullscreen();
	    } else if (videoElement.mozRequestFullScreen) {
	      videoElement.mozRequestFullScreen();
	    } else if (videoElement.webkitRequestFullscreen) {
	      videoElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
	    }
	  } else {
	    if (document.cancelFullScreen) {
	      document.cancelFullScreen();
	    } else if (document.mozCancelFullScreen) {
	      document.mozCancelFullScreen();
	    } else if (document.webkitCancelFullScreen) {
	      document.webkitCancelFullScreen();
	    }
	  }
	}
	
	var listener = new window.keypress.Listener();
	listener.simple_combo("enter", function() {
		toggleFullScreen(video[0]);
	});
	listener.simple_combo("up", function() {
		video[0].volume += 0.1;
	});
	listener.simple_combo("down", function() {
		video[0].volume -= 0.1;
	});
	listener.simple_combo("left", function() {
		video[0].currentTime -= 10;
	});
	listener.simple_combo("right", function() {
		video[0].currentTime += 10;
	});
	listener.simple_combo("space", function() {
		if(video[0].paused) {
			video[0].play();
		}else{
			video[0].pause();
		}
	});
})()