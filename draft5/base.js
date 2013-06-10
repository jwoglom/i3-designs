$(document).ready(function() {
	$(".container").html('<div style="position: fixed;bottom: 0px;right: 0px;background-color: #88aadd;padding: 5px;font-size: 12px;z-index:99">Design is subject to change.</div>' + $('.container').html());
	$lH = function() {
		if(document.body.clientWidth<741) {
			$mHl = $('.main').css('left');
			$('.main').stop().addClass('expanded').animate({'left':'150px'}, 'fast');
			$('.main-schedule-exp').addClass('hovered');
		}
	};
	$lHo = function() {
		if(document.body.clientWidth<741 && typeof $mHl !=='undefined') {
			$('.main').stop().removeClass('expanded').animate({'left':$mHl}, 'fast');
			$('.main-schedule-exp').removeClass('hovered');
		}
	};
	$('.left').hover($lH, $lHo);
	$resize = function() {
		s = document.body.clientWidth;
		if(s<=500) {
			$('.left').css({'width': '150px'});
			$('.header').css({'width': '12px'});
			$('.main').css({'left': '12px'});
		}else if(s<=740) {
			$('.left').css({'width': '150px'});
			$('.header').css({'width': '60px'});
			$('.main').css({'left': '60px'});
		}else if(s<=1010) {
			$('.left,.header').css({'width': '150px'});
			$('.main').css({'left': '150px'});
		}else if(s<=1170) {
			$('.left,.header').css({'width': '237px'});
			$('.main').css({'left': '237px'});
		}

		if(s<=660) {
			$('.main-home-schedule .sched-tbl')
			.removeClass('sched-tbl-5')
			.removeClass('sched-tbl-3')
			.addClass('sched-tbl-1');
		} else if(s<=1140) {
			$('.main-home-schedule .sched-tbl')
			.removeClass('sched-tbl-5')
			.removeClass('sched-tbl-1')
			.addClass('sched-tbl-3');
		} else {
			$('.main-home-schedule .sched-tbl')
			.removeClass('sched-tbl-3')
			.removeClass('sched-tbl-1')
			.addClass('sched-tbl-5');
		}
		console.log('width: '+s+' height: '+document.height);
	};
	$(window).resize($resize);
	$resize();
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
if(typeof page == 'undefined') page = {};
if(typeof page.defaultPage == 'undefined') page.defaultPage = 'home';
page.ajaxrs = [];
page.loading_text = '<div class="sect-header">One moment please..</div>';
page.title = function (t) {
	document.title = "TJ Intranet" + (typeof t=='undefined' ? '': ': '+t);
}
page.bindSwipes = function () {
	lt = false;
	$(document).touchSwipeRight(function () {
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
		left.click(page.defaultPage);
	} else {
		left.click(s[1]);
	}
	page.bindSwipes();
};
page.customjs = function (pg) {
	if(pg.split('/')[0] == 'home') {
		$('.main-schedule').addClass('main-schedule-exp');
		$('.main').addClass('main-exp');
	} else {
		$('.main-schedule').removeClass('main-schedule-exp');
		$('.main').removeClass('main-exp');
	}
	if((pg == 'home/news' || pg == 'home-news') && ($('.main-news').length<2)) {
		$('.main-news').clone().addClass('mainpg').addClass('main-home-news').css({'top':'0','width':'98%'}).hide().appendTo('.main');
	}
	if((pg == 'home/schedule' || pg == 'home-schedule') && ($('.main-schedule').length<2)) {
		$('.main-schedule').clone().addClass('mainpg').addClass('main-home-schedule').hide().appendTo('.main');
		$('.main-home-schedule, .main-home-schedule table, .main-home-schedule table tr.sched-info').css({'height': '100%'});
		$('.main-home-schedule table tr.sched-day').css({'height': '15px'});
	}
}
page.fetch = function (pg, now) {
	pgf = tabs.format(pg);
	$e = $('<div />')
		.attr({'class': 'mainpg main-'+pgf})
		.appendTo('.main-ajax-layer');
	if(pg.indexOf('search')==-1) $e.html(page.loading_text);
	jQuery.get('fetchpg.php?'+pg, {}, function (d) {
		page.ajaxrs.push([+new Date(), d]);
		if(d !== '404' && d !== '' && d !== '500') {
		/*	$('<div />')
				.attr({'class': 'mainpg main-'+pg})
				.html(d)
				.appendTo('.main'); */
			try {s = JSON.parse(d);} catch(e) {s = {'data': d};}
			return page.go(pg, {'data': s, 'json': d, 'now': (pg.indexOf('search')!==-1)});
		} else {
			$('.main-'+pgf).html('');
			if(d == '500') $('.main-err-text').html('A fatal error occurred: 500 Server Error');
			$d = $('.main-err');
			if(now) {
				$d.show();
			} else {
				$d.fadeIn(500);
			}
			$('.main-err-url').html(pg);
		}
	});
}
page.go = function (pg, now) {
	if(typeof $P!=='undefined' && $P.attr('onunsel')) try{eval($P.attr('onunsel'));}catch(e){}
	//now = now||false;
	page.customjs(pg);
	pgp = pg.split('/')[0];
	if(pgp == 'eighth') setTimeout(function() {$('.main-home-schedule').slideUp(250);page.mT=$('.main').css('top');$('.main').animate({'top': '0px'}, {'duration': 1});}, 1);
	if(pgp == 'eighth' && typeof pg.split('/')[1] !== 'undefined') return eighth.go(pg, now);
	if($('.main-schedule').css('display') == 'none' && pgp !== 'eighth') {
		setTimeout(function() {$('.main-home-schedule').eq(0).slideDown(250);$('.main').animate({'top': page.mT?page.mT:''}, {'duration': 250});}, 250);
	}
	tabs.upd(pgp);
	page.title($('.leftopt-'+pgp+' .lot').text());
	window.ignoreHashChange = true;
	window.location.hash = '#'+pg;
	setTimeout(function() {
		window.ignoreHashChange = false
	}, 500);
	// Tabs are handled by tabs.go
	pgf = tabs.format(pg);
	
	console.log('pg='+pg+' '+pgf);
	try {
		$e = $('.main-'+pgf);
	} catch(e) {$e=[];}
	if(typeof now == 'object' && now.data) {
		$e = $('.main-'+pgf);
		$e.html(now.data.data);
		now = now.now;
		console.log(now);
	}
	$a = $('.mainpg');
	$d = $('.main-err');
	$a.hide();
	if($e.length > 0) {
		$e.attr('rel', pgf);
		if(pg == page.defaultPage || now || now === true) {
			$e.show();
		} else {
			$e.fadeIn(500);
		}
	} else {
		// to enable AJAX fetching uncomment this line
		// and comment out the multi line comment below it
		//return page.fetch(pg, now);
		///*
			$e=$d;
			if(now) {
				$d.show();
			} else {
				$d.fadeIn(500);
			}
			$('.main-err-url').html(pg);
			//*/

	}
	if($e.attr('onsel')) try{eval($e.attr('onsel'));}catch(e){}
	$P=$e;
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
left.clicksearch = function (elmv) {
	return left.click('search'+(elmv!==''?'/'+elmv:''));
};
left.searchchg = function (thsv) {
	if(!left.sq || left.sq !== thsv) {
		left.sq=thsv;
		console.log('Search: onchange');
		left.clicksearch(thsv);
	}
};
left.searchkey = function (thsv) {
	if(!left.sq || left.sq !== thsv) {
		left.sq=thsv;
		console.log('Search: onkeyup');
		left.clicksearch(thsv);
	}
};
left.searchclk = function (thsv) {
	if(!left.sq || left.sq !== thsv) {
		left.sq=thsv;
		console.log('Search: onclick');
		left.clicksearch(thsv);
		$('.lot-search').focus();
	}
}
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