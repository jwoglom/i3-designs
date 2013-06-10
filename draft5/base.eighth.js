eighth = {};
eighth.click = page.go;
eighth.go = function (pg, now) {
	if(!$('.leftopt-eighth').hasClass('leftopt-sel')) {
		page.go('eighth');
	}
	if(typeof $P!=='undefined' && $P.attr('onunsel')) try{eval($P.attr('onunsel'));}catch(e){}
	//now = now||false;
	page.customjs(pg);
	pgp = pg.split('/')[0];
	tabs.upd(pgp);
	page.title($('.leftopt-'+pgp+' .lot').text());
	window.ignoreHashChange = true;
	window.location.hash = '#'+pg;
	setTimeout(function() {
		window.ignoreHashChange = false
	}, 500);
	// Tabs are handled by tabs.go
	pgf = tabs.format(pg);
	// Eighth doesn't use -eq-
	pgf = pgf.replace(/-eq-/g, '-');


	console.log('pg='+pg+' '+pgf);
	try {
		$e = $('.'+pgf);
	} catch(e) {$e=[];}
	$s = $('.eighthpg');
	$c = $('.main-eighth-container');
	$d = $('.eighth-default');
	$r = $('.eighth-err');
	$s.hide();
	if(typeof pg.split('/')[1] == 'undefined') {
		$e = $d;
		$d.fadeIn(500);
	} else if($e.length > 0) {
		$e.attr('rel', pgf);
		$e.fadeIn(500);
	} else {
		$('.main-err-url').html(pg);
		$r.fadeIn(500);
	}

}
eighth.sched_hover = function (day, blk, down) {};
eighth.sched_cat = function (cat) {
	$c = $('.sched-cat-'+cat).slideToggle();

};
eighth.sched_clickrow = function (aid) {
	$e = $('#sched-act-info-'+aid);
	$es = $('.sched-act-info:not(#sched-act-info-'+aid+')');
	$es.slideUp();
	if($e.length > 0) {
		$e.slideToggle();
	}
};
eighth.sched_fav = function (aid) {
	$e = $('#sched-act-'+aid+' .sched-ico.fav');
	if($e.length > 0 && $e.hasClass('fav-sel')) {
		// alert('Unfavorited '+aid);
		$e.removeClass('fav-sel');
	} else {
		// alert('Favorited '+aid);
		$e.addClass('fav-sel');
	}
};
eighth.signup = function (aid) {
	$d = $('#sched-act-'+aid);
	d = JSON.parse($d.attr('act-data'));
	/*$('.sched-popup-so-name').html(d.name);
	$('.sched-popup').fadeIn(250);
	$s = $('.sched-popup-so');
	$s.show();
	$('.sched-popup-ok').hide();
	setTimeout(function() {
		$('.sched-popup-so .t').html("Successfully signed you up for <span class='sched-signup-so-name'>"+d.name+"</span>.");
		$('.sched-popup-ok').show();
	}, 2000);*/
	eighth.alert('Activity signup', "Signing you up for "+d.name+"...<br /><span class=l></span></center>");
	$('.sched-popup-ok').hide();
	setTimeout(function() {
		eighth.alert('Activity signup', 'Successfully signed you up for '+d.name+'.');
		$('.sched-popup-ok').show();
	}, 2000);

};
eighth.alert = function (header, text) {
	console.log('ALERT: '+header+'   '+text);
	$('.sched-viewroster').hide();
	$('.sched-popup, .sched-popup-so, .sched-popup-ok').fadeIn(250);
	$('.sched-popup-so .sect-header').html(header);
	$('.sched-popup-so .t').html(text);
};
if(typeof page!=='undefined') {
	page.alert = function (header, text) {
		$('.sched-popup').clone().appendTo($('body'));
		return eighth.alert(typeof text!=='undefined'?header.toString():'Alert', typeof text!=='undefined'?text.toString():header.toString());
	};
	try {
		_alert = alert;
		alert = function(h, t) {
			try {
				return page.alert(h,t);
			} catch(e) {
				return _alert(h,t);
			}
		};
	} catch(e){}
};
eighth.sched_roster = function (aid) {
	$d = $('#sched-act-'+aid);
	d = JSON.parse($d.attr('act-data'));
	/*$p = $('.sched-popup');
	$('.sched-viewroster-name').html(d.name);
	$p.fadeIn(250);
	$('.sched-viewroster, .sched-popup-ok').show();
	$c = $('.sched-viewroster-data');*/
	h = (!d.users||d.users.length==0?'There are no names to display.':d.users.join('</li><li>'));
	eighth.alert('Roster for '+d.name, "<ul><li>"+h+"</li></ul>");
	
};
eighth.sched_popup_close = function () {
	$e = $('.sched-popup, .sched-viewroster, .sched-signup');
	$e.fadeOut(250);
};
eighth.catd = {};
eighth.catalog = function (e) {
	eighth.catd[e]={}
	p = '.eighth-schedule-tbl-'+e;
	$p = $(p);
	$as = $(p+' .sched-act');
	for(i=0;i<$as.length;i++) {
		sd = $as.eq(i).attr('act-data');
		d = JSON.parse(sd);
		eighth.catd[e][d.id] = d;
	}
	console.log('Cataloged acts');
	return eighth.catd[e];
};
eighth.sched_search = function (q, e) {
	d = eighth.catd[e];
	if(!d || d.length < 1) d = eighth.catalog(e);
	q = $.trim(q.toLowerCase());
	qs = q.split(' or ');
	$('.sched-act-row').addClass('hidden');
	r = [];
	dosearch = function(q, d) {
		r = [];
		for(i in d) {
			for(j in d[i]) {
				if(j !== 'users' && $.trim(d[i][j].toLowerCase()).indexOf(q) !== -1) {
					r.push(d[i]['id']);
					$('#sched-act-'+d[i]['id']+' .sched-act-row').removeClass('hidden');
				}
			}
		}
		return r;
	};
	for(i in qs) r.push(dosearch(qs[i], d));
	if(r.length < 1) {
		$('.sched-search-noresults').show();
	} else {
		$('.sched-search-noresults').hide();
	}
	console.log('query: '+qs.join(',')+'\nresponse: '+r.join(','));
	return r;
};
/*
	console.log('eighth.sched_hover('+[day,blk,down].join(',')+')');
	elm = '.eighth-act-'+day+'-'+blk;
	$d = $(elm+'-data');
	$e = $(elm+'-edit');
	if(down) {
		$e.hide();
		$d.show();
	} else {
		$d.hide();
		$e.show();
	}
}*/