
$(document).ready(function() {
	$lH = function() {
		if(document.body.clientWidth<741) {
			$mHl = $('.main').css('left');
			$('.main').stop().animate({'left':'150px'}, 'fast');
		};
	};
	$lHo = function() {
		if(document.body.clientWidth<741 && typeof $mHl !=='undefined') {
			$('.main').stop().animate({'left':$mHl}, 'fast');
		}
	};
	$('.left').hover($lH, $lHo);
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
		if(!window.ignoreHashChange) page.parseHash();
	});
	$(window).hashchange();
	if(window.location.search.length>2) {
		page.parseHash(window.location.search.replace('?','#'));
	}
	page.bindSwipes();
	tabs.updSel();
});
ni = function (n, a, silent) {
	t ='Not Implemented:\n\n'+n+'('+a.join(',')+')';
	console.log(t);
	if(!silent) alert(t);
}
page = {};
page.bindSwipes = function() {
	lt = false;
	$(document).touchSwipeRight(function() {
		if(lt === true) {
			lt=false;
			$lHo();
		} else {
			lt=true;
			$lH();
		}
	});
	$(document).touchSwipeLeft(function() {
		lt=false;
		$lHo();
	});
};
page.parseHash = function (h) {
	h = h || window.location.hash;
	s = h.split('#');
	if(h.length<2) {
		left.click('home');
	} else {
		left.click(s[1]);
	}
	page.bindSwipes();
};
page.go = function (pg, now) {
	//now = now||false;
	if((pg == 'home/news' || pg == 'home-news') && ($('.main-news').length<2)) {
		$('.main-news').clone().addClass('mainpg').addClass('main-home-news').css({'top':'0','width':'98%'}).hide().appendTo('.main');
	}
	if((pg == 'home/schedule' || pg == 'home-schedule') && ($('.main-schedule').length<2)) {
		$('.main-schedule').clone().addClass('mainpg').addClass('main-home-schedule').hide().appendTo('.main');
		$('.main-home-schedule, .main-home-schedule table, .main-home-schedule table tr.sched-info').css({'height': '100%'});
		$('.main-home-schedule table tr.sched-day').css({'height': '15px'});
	}
	tabs.upd(pg.split('/')[0]);
	window.ignoreHashChange = true;
	window.location.hash = '#'+pg;
	setTimeout(function() {
		window.ignoreHashChange = false
	}, 500);
	// Tabs are handled by tabs.go
	pg = tabs.format(pg);
	
	console.log('pg='+pg);
	try {
		$e = $('.main-'+pg);
	} catch(e) {$e=[];}
	$a = $('.mainpg');
	$d = $('.main-err');
	$a.hide();
	if($e.length > 0) {
		if(pg =='home' || now) {
			$e.show();
		} else {
			$e.fadeIn(500);
		}
	} else {
		if(now) {
			$d.show();
		} else {
			$d.fadeIn(500);
		}
		$('.main-err-url').html(pg);	
	}
	if($e.attr('onsel')) eval($e.attr('onsel'));
	page.bindSwipes();
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
tabs.go = function(pg) {
	page.go(pg);
	tabs.updSel();
};
tabs.upd = function (pg) {
	$('.header-tabs div').hide();
	$('.header-tabs-'+tabs.format(pg)).show();
};
tabs.updSel = function () {
	d = false;
	$('.header-tabs span a').each(function(n,el) {
		$e = $(el);
		h = $e.attr('href');
		
		if(h == window.location.hash) {
			console.log('!'+h);
			$e.parent().addClass('tab-sel');
			d = true;
		}else{
			if(h == '#home/welcome') $d = $e;
			$e.parent().removeClass('tab-sel');
		}
	});
	if(!d && $d) {
		$d.parent().addClass('tab-sel');
	}
}
left = {};
left.click = function (elmo, now) {
	page.go(elmo, now);
	// Tabs are handled by tabs.go
	elm = elmo.split('/')[0];
	$e = $('.leftopt-'+elm);
	
	left.clrSel();
	left.sel($e, elm);
	$x = $('.lexp-'+elm);
	if($x.length > 0) {
		left.exp($e, $x, now);
	}
	page.bindSwipes();
	//$lH();$lHo();
	
};
left.clicksearch = function (elm) {
	return left.click('search'+((v=elm.value)!==''?'/'+v:''));
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
left.exp = function ($e, $x, now) {
	$e.addClass('leftopt-exp');
	$x.hide();
	if(!now) $x.slideDown(500);
}
schedule = {};
schedule.addToSchedule = function (y, m, d) {
	ni('schedule.addToSchedule', [y,m,d]);
};