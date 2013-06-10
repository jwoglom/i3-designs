/*
	the app.login array
	contains login functions
*/
app.login = {};

/*
	shows the login left item
*/
app.login.left = function() {
	$('.left>div').hide();
	$e=$('.left>div:first-child').clone();
	$e.attr('class', 'left-opt left-opt-login sel').show().appendTo('.left');
	$('.left-opt-login').attr('style', 'display: block');
	$('.left-opt-login span').html('login');
};

/*
	inits the login UI
*/
app.login.init = function() {
	app.set_header('TJHSST Intranet');
	$('.main-content>div, .header-content').hide();
	if($('.left-opt-login').length < 1) {
		app.login.left();
	}
	app.click('login', true);

	setTimeout(function() {
		app.sched.sched_hover.apply($('.main-home-schedule'), null);
		data.sched_hover_do = false;
	}, 10);
}