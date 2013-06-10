/* base.js */
/*
	Intranet
*/

/*
	the global data object
	stores data for the application (name, version, app settings, etc)
*/
data = {
	'name': 'Intranet',
	'version': 0.1,
	'ajax': {
		'allow': (location.search.indexOf('ajax.allow')!==-1),
		'root': '/~james/i3/rewrite1draft1/', /* the root to where ajax files reside */
		'runStandalone': true, /* when true, appends ? to all URLs; for use w/o mod rewrite */
		'currentPage': null
	},
	'url': {
		'pushState': false,
		'hash': true,
		'custom_click': {
			'login': 'app.login.init'
		}
	},
	'debug': {
		'allow': (window.location.hostname=='127.0.0.1' || window.location.hostname=='localhost'),
		'lvl': 9
	},
	'dbg': [],
	'initDone': false,
	'strings': {
		'loadMsg': "One moment please..<span class='l'></span>",
		'loadGif': "<img src='img/load.gif' />",
		'errMsg': "<div class='err'><span class='x'></span><p>An error occurred. Reload the page and try again.</p><p>If this issue continues, contact the Intranet Development Team.</p></div>"
	}
};
/* 
	a debugging function
	string c: the text to be debugged
	int l: level of error
*/
d = data.d = function(c, l, f) {
	if(!data.debug.allow) return;
	if(typeof l=='undefined') l = 0;
	f = (typeof f=='undefined') ? '' : f+': ';
	s =  f + '' + l +': '+ c;
	data.dbg.push([l, c]);
	if((data.debug.lvl - l) >=  0 && (typeof log=='undefined'||!!log)) console.log(s);
};
/*
	sets logging level to max and dumps all data to console
	bool lp: whether to dump data; default: true
*/
data.dump = function(lp) {
	data.debug.lvl = 99;
	if(typeof lp=='undefined' || !!lp) {
		for(i in j=data.dbg) {
			data.d(j[i][1], j[i][0]);
		}
	}
}

/*
	the global app object
	stores all high-level functions
*/
app = {};

/*
	the app init array
	dynamically push functions here that should run on $(document).ready()
	functions that are only run once can be placed here, too
*/
app.init = [];

/*
	the app init late array
	contains functions called by app.addinit after app.init ran
*/
app.initlate = [];

/*
	adds a function to the init array or, if the init array has already been processed, run it
	function f: the function to add
*/
app.addinit = function (f) {
	n = '__' + Math.round(Math.random() * 1000000);
	window[n] = f;
	d('Adding init function '+n+'()', 9, 'app.base');
	if(!data.initDone) {
		return app.init.push(f);
	} else {
		app.initlate.push(f);
		return f();
	}
}

/*
	changes the content, header, and left accordingly
	jquery object t: the jquery object of the left obj clicked
	string t: the classname of the object after main-contents
	bool prefs.ignore_custom: to ignore custom click fns
*/
app.click = function(t, pref) {

};

/*
	include an external HTML file's contents into 
	the specified div
*/
app.embedHTML = function(u, elm) {
	jQuery.get(u, {}, function(d) {
		$(elm).html(d);
	}).fail(function() {
		$(elm).html(data.strings.errMsg);
	});
}

/*
	sets the header at $('.main-header')
	string t: the value of the header
	bool p:	true: change the value of the div itself
			false: change the inner span (default)
*/
app.set_header = function(t, p) {
	$('.main-header'+ (typeof p!='undefined'||p==true ? '' : ' span')).html(t);
}

/*
	runs on $(document).ready
	do not embed functions here; use the app.init array
*/
app.document_ready = function() {
	for(i in app.init) app.init[i]();
	data.initDone = true;
}
