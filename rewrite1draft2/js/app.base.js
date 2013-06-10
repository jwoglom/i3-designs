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
	'initDone': false
};
/* 
	a debugging function
	string c: the text to be debugged
	int l: level of error
*/
d = data.d = function(c, l, log) {
	if(!data.debug.allow) return;
	if(typeof l=='undefined') l=0;
	s =  l+': '+c;
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
	the global user object
	stores data about the current user
*/
user = {
	'id': '2016jwoglom',
	'fullname': 'James Woglom',
	'name': ['Woglom', 'James', 'Bacas'],
	'grade': 9,
	'staff': false,
	'email': 'j@wogloms.net',
	'groups': ['users', 'class_2016', 'grade_9', 'admins', 'imasters'],
	'prefs': {
		'show_debugging': true,
		'theme': 'default'
	}
};

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
	console.log('Initing function:');
	console.log(f);
	if(!data.initDone) {
		return app.init.push(f);
	} else {
		app.initlate.push(f);
		return f();
	}
}

app.clickdefault = function() {
	$d = $('.main-contents.default');
	if($d.length < 1) $d = $('.main-contents.main-contents-err');
	id = $d.attr('rel');
	d('Default: ' + id);
	app.click(id);
}
/*
	changes the content, header, and left accordingly
	jquery object t: the jquery object of the left obj clicked
	string t: the classname of the object after main-contents
	bool prefs.ignore_custom: to ignore custom click fns
*/
app.click = function(t, pref) {
	console.log(t);
	console.log(pref);
	if(typeof pref=='undefined') pref = {};

	/* custom click functions (e.g. eighth) */
	if(typeof data.url.custom_click[t] == 'function' && (typeof pref.ignore_custom=='undefined'||pref.ignore_custom==false)) {
		return data.url.custom_click[t]();
	} else if(typeof data.url.custom_click[t] == 'string' && (typeof pref.ignore_custom=='undefined'||pref.ignore_custom==false)) {
		/* use strings when function overrides haven't loaded yet */
		return eval(data.url.custom_click[t]+'();');
	}

	/* get the container object and store it as $t */
	if(typeof t == 'object' && !t.originalEvent) {
		/* t is a jquery object */
		$t = $(t);
		oid = $t.attr('rel');
	} else if(typeof t == 'string') {
		/* t is an id */

		/* make t css safe */
		t = utils.cssSafe(t);
		$t = $('.main-contents.main-contents-' + t);
		oid = t;
	} else {
		/* this is being used in a left click */
		$l = $(this);
		/* $(this) is the left object div, so we need to get the contents div to continue */
		oid = app.click_getid($l);
		$t = $('.main-contents.main-contents-' + oid);
	}

	/* content */

	id = $t.attr('rel');

	if(typeof pref.update_hash == 'undefined') {
		d('id '+id);
		app.url_upd(id);
	} else {
		data.blockUrlUpd = true;
		window.location.hash = '#'+pref.update_hash;
		setTimeout(function() {
			data.blockUrlUpd = null;
		}, 2);
	}

	if(!id && !(id = app.click_getid(oid))) {
		/* the container does not exist */

		/* should we do an AJAX fetch? */
		if(data.ajax.allow) {
			return app.ajax.fetch(id);
		} else {
			/* show a 404 */
			d('Error');
			$('.main-contents.main-contents-err p span').html(oid);
			return app.click($('.main-contents.main-contents-err'), {'update_hash': oid});
		}
	}
	$('.main-contents').slideUp(1).removeClass('sel');
	$e = $('.main-contents.main-contents-' + utils.cssSafe(id));
	if($e.length < 1) $e = $('.main-contents.main-contents-err');
	$e.hide().slideDown(1).addClass('sel');

	/* header */

	if($e.attr('data_header')) {
		app.set_header($e.attr('data_header'));
	}

	/* left */

	$('.left .left-opt').removeClass('sel');
	$l = typeof $l != 'undefined' ? $l : $('.left-opt.left-opt-' + utils.cssSafe(id));
	if($l.length > 0) {
		$l.addClass('sel');
	}
	d('Click oid: ' + oid + ' id: ' + id);
};

/*
	gets the content identifier from a classname
	e.x.: main-contents main-contents-home sel => home
	string c: the classname of the object
	jquery obj c: the object with classname
*/
app.click_getid = function(c) {
	if(typeof c == 'object') c = $(c).attr('class');
	cn = null;
	for(i in j=c.toString().split(' ')) {
		if(j[i].indexOf('left-opt-') !==-1) {
			cn = j[i].split('left-opt-')[1];
		}
	}
	return cn;
};

/*
	sets the hash of the current page
	string u: the id (hash value) to change
*/
app.url_upd = function(u, t) {
	if(typeof data.blockUrlUpd != 'undefined' && data.blockUrlUpd) return !d('Not allowing url_upd right now: '+u+' '+t, 5);
	d('URL is now '+u);
	if(typeof history.pushState != 'undefined' && data.url.pushState) {
		history.pushState({}, document.title, u);
	} else if (data.url.hash) {
		window.location.hash = '#'+u;
	}
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

app.hash_change = function() {
	/* initialize default content */
	if(utils.gethash() == '') {
		app.clickdefault();
	} else {
		app.click(utils.gethash());
	}
};
app.addinit(function() { 
	/* init left obj clicking */
	$('.left .left-opt').click(app.click);
});
app.addinit(function() {
	$(window).on('hashchange', app.hash_change)
});
app.addinit(app.hash_change);
/*
	runs on $(document).ready
	do not embed functions here; use the app.init array
*/
app.document_ready = function() {
	for(i in app.init) app.init[i]();
	data.initDone = true;
}
