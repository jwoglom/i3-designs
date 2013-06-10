/* app.sched.js */
/*
	the app.sched object
	functions for manipulation of the bottom schedule
*/
app.sched = {};
/*
	changes the number of days to show based on the size of the window
	runs onResize
	int s: the manual width to change to (default is clientWidth)
*/
app.sched.resize = function (si) {
	if(typeof si=='undefined') si = document.body.clientWidth;

	$('.sched-next, .sched-prev').hide();
	if(si<=660) {
		$('.main-home-schedule .sched-tbl')
		.removeClass('sched-tbl-5')
		.removeClass('sched-tbl-3')
		.addClass('sched-tbl-1');
		$('.sched-next3, .sched-prev3').show();
	} else if(si<=1140) {
		$('.main-home-schedule .sched-tbl')
		.removeClass('sched-tbl-5')
		.removeClass('sched-tbl-1')
		.addClass('sched-tbl-3');
		$('.sched-next4, .sched-prev2').show();
	} else {
		$('.main-home-schedule .sched-tbl')
		.removeClass('sched-tbl-3')
		.removeClass('sched-tbl-1')
		.addClass('sched-tbl-5');
	}
	d('resize si='+si, 10);
};
app.addinit(function() {
	$(window).resize(function() {app.sched.resize()});
	app.sched.resize();
});

/*
	advances one schedule item back
*/
app.sched.prev = function() {
	$t = $('.sched-tbl');
	$o = $('.sched-sel');
	if($t.hasClass('sched-tbl-1')) {
		if($o.prev().length > 0) {

			/* advance the screen */
			$o.removeClass('sched-sel');
			$o.prev().addClass('sched-sel');

			/* advance the arrows */
			$ap = $('.sched-sel .sched-prev');
			n = parseInt($ap.attr('class').split(' sched-prev')[1]);
			console.log('prev n='+n);
			$('.sched-prev, .sched-next').hide();
			if(n>1) $('.sched-prev'+n).show();
			$('.sched-next'+n).show();
		} else {
			d('Cannot advance.');
		}
	} else if($t.hasClass('sched-tbl-3')) {
		if($o.prev().prev().length > 0) {

			/* advance the screen */
			$o.removeClass('sched-sel');
			$o.prev().addClass('sched-sel');
			$o.prev().prev().removeClass('sched-hide').addClass('sched-show');
			$o.next().removeClass('sched-show').addClass('sched-hide');

			/* advance the arrows */
		} else {
			d('Cannot advance.');
		}
	}
}
/*
	advances one schedule item forward
	(the same as .prev but with all instances of prev and next reversed)
*/
app.sched.next = function() {
	$t = $('.sched-tbl');
	$o = $('.sched-sel');
	if($t.hasClass('sched-tbl-1')) {
		if($o.next().length > 0) {

			/* advance the screen */

			$o.removeClass('sched-sel');
			$o.next().addClass('sched-sel');

			/* advance the arrows */
			$ap = $('.sched-sel .sched-next');
			n = parseInt($ap.attr('class').split(' sched-next')[1]);
			console.log('next n='+n);
			$('.sched-prev, .sched-next').hide();
			$('.sched-prev'+n).show();
			if(n<5) $('.sched-next'+n).show();
		} else {
			d('Cannot advance.');
		}
	} else if($t.hasClass('sched-tbl-3')) {
		if($o.next().next().length > 0) {
			$o.removeClass('sched-sel');
			$o.next().addClass('sched-sel');
			$o.next().next().removeClass('sched-hide').addClass('sched-show');
			$o.prev().removeClass('sched-show').addClass('sched-hide');
		} else {
			d('Cannot advance.');
		}
	}
}
/*
	displays the schedule on hover
*/
data.sched_hover_do = true;
app.sched.sched_hover = function() {
	if(data.sched_hover_do) {
		$(this).addClass('hover').css({'height': '34%'});
	}
};
/*
	hides the schedule on hover out
*/
app.sched.sched_hoverout = function() {
	if(data.sched_hover_do) {
		$(this).addClass('out').css({'height': ''});
	}
};

/*
	run init functions
*/
app.addinit(function() {
	$('.sched-prev').click(app.sched.prev);
	$('.sched-next').click(app.sched.next);
	$('.main-schedule').hover(app.sched.sched_hover, app.sched.sched_hoverout);
	app.sched.sched_hoverout.apply($('.main-schedule'), null);
})