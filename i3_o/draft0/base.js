
$(document).ready(function() {
	
	$('.left').hover(function() {
		if(document.body.clientWidth<741) {
			$mHl = $('.main').css('left');
			$('.main').stop().animate({'left':'150px'}, 'fast');
		}
	}, function() {
		if(document.body.clientWidth<741 && typeof $mHl !=='undefined') {
			$('.main').stop().animate({'left':$mHl}, 'fast');
		}
	});
	$(window).resize(function() {
		s = document.body.clientWidth;
		if(s<500) {
			$('.left').css({'width': '150px'});
			$('.main').css({'left': '12px'});
		}else if(s<740) {
			$('.left').css({'width': '150px'});
			$('.main').css({'left': '60px'});
		}else if(s<1010) {
			$('.left').css({'width': '150px'});
			$('.main').css({'left': '150px'});
		}else if(s<1170) {
			$('.left').css({'width': '237px'});
			$('.main').css({'left': '237px'});
		}
		console.log('width: '+s);
	});
	/*$(window).on('hashchange', function() {
		page.parseHash();
	});
	page.parseHash();*/
	$(window).hashchange(function() {
		page.parseHash();
	});
	$(window).hashchange();
	if(window.location.search.length>2) {
		page.parseHash(window.location.search.replace('?','#'));
	}
	
	
});
page = {};
page.parseHash = function (h) {
	h = h || window.location.hash;
	s = h.split('#');
	if(h.length<2) {
		//page.go('home');
		left.click('home');
	} else {
		//page.go(s[1]);
		left.click(s[1]);
	}
};
page.go = function (pg) {
	if((pg == 'home/news' || pg == 'home-news') && ($('.main-news').length<2)) {
		$('.main-news').clone().addClass('mainpg').addClass('main-home-news').hide().appendTo('.main');
	}
	if((pg == 'home/schedule' || pg == 'home-schedule') && ($('.main-schedule').length<2)) {
		$('.main-schedule').clone().addClass('mainpg').addClass('main-home-schedule').hide().appendTo('.main');
		$('.main-home-schedule, .main-home-schedule table, .main-home-schedule table tr.sched-info').css({'height': '100%'});
		$('.main-home-schedule table tr.sched-day').css({'height': '15px'});
	}
	tabs.upd(pg.split('/')[0]);
	window.location.hash = '#'+pg;
	// Tabs are handled by tabs.go
	pg = tabs.format(pg);
	
	console.log('pg='+pg);
	$e = $('.main-'+pg);
	$a = $('.mainpg');
	$d = $('.main-err');
	$a.hide();
	if($e.length > 0) {
		if(pg =='home') {
			$e.show();
		} else {
			$e.fadeIn(500);
		}
	} else {
		$d.fadeIn(500);
		$('.main-err-url').html(pg);
		
	}
}
tabs = {};
tabs.format = function(pg) {
	pg = pg.replace('#', '');
	/*p = pg.split('/');
	if(p.length<1) return pg;
	// Eighth URLs are not handeld by this function
	if(p[0] == 'eighth') return eighth.tabs(pg);
	return p[0]+'-'+p[1];*/
	return pg.replace(/\//g, '-').replace(/=/g, '-eq-');
}
tabs.go = page.go;
tabs.upd = function (pg) {
	$('.header-tabs div').hide();
	$('.header-tabs-'+tabs.format(pg)).show();
}
left = {};
left.click = function (elmo) {
	page.go(elmo);
	// Tabs are handled by tabs.go
	elm = elmo.split('/')[0];
	$e = $('.leftopt-'+elm);
	
	left.clrSel();
	left.sel($e, elm);
	$x = $('.lexp-'+elm);
	if($x.length > 0) {
		left.exp($e, $x);
	}
	
};
left.clrSel = function() {
	$('.lexp').slideUp(1);
	$('.leftopt-sel, .leftopt-exp')
		.removeClass('leftopt-sel')
		.removeClass('leftopt-exp');
};
left.sel = function ($e, elm) {
	$e	.addClass('leftopt-sel')
		.addClass('leftopt-sel-'+elm);
	
};
left.exp = function ($e, $x) {
	$e.addClass('leftopt-exp');
	$x.hide().slideDown(500);
}
eighth = {};
eighth.click = page.go;