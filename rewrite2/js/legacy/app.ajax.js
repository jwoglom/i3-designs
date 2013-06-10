/* app.ajax.js */

/*
	the app.ajax object
	contains ajax functions for fetching CONTENT
*/
app.ajax = {};

/*
	the data.ajaxreq array
	contains contents of all ajax requests
*/
data.ajaxreq = [];

/*
	fetches an AJAX page, appends its content, and switches to it
	string id: the ID for the page requested
*/
app.ajax.fetch = function(id) {
	u = 'fetch/'+id;
	rqd = +new Date();
	
	$d = $('<div></div>');
	$d.attr('class', 'main-ajax-request main-ajax-'+rqd+' main-contents main-contents-'+utils.cssSafe(id));
	$d.attr('id', 'main-ajax-'+rqd);
	$d.attr('rel', id);
	$d.html("<div class='l'></div>");
	$('.main-content').append($d);
	app.click(id);
	$.get(u, {}, function(r) { 
		setTimeout(function() {
		data.ajaxreq.push([rqd,u,r]);
		d([u,r]);
		$d.html(r);
		}, 2000);
	});
};

app.ajax.parse = function() {
	h = window.location.hash;
	if(h.substring(0, 1) == '#') h = h.substring(1);
	if(h == 'login') {
		app.login.init();
	}
};

app.addinit(app.ajax.parse);