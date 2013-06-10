/* Set up history.js for HTML5 history.pushState */
	
	$h_init = function() {
		History = window.History, State = History.getState();
		History.Adapter.bind(window, 'statechange', $h_statechange);
	}
	$h_statechange = function() {
		state = History.getState();
		/* fetch AJAX */
		if(typeof (r=state.data.override) != 'undefined' && r === true) {
			return $g_ajaxer(state);
		/* switch element to focus */
		} else if(r == 2) {
			$g_focus(state.url);
		}
	};
	/* Process:
		* Link is clicked. $g_lc is called with arguments href, extra data
		* $g_lc checks if URL is an Intranet url that supports AJAX or
		  an outside URL. If it can't be ajaxed, it redirects now.
		* $g_lc returns the result of $g with params url, title, data
		* $g tells History.pushState to change the URL
		* $h_statechange is run and returns $g_ajaxer to fetch the AJAX page
		* $g_ajaxer fetches the page and appends it to .main-content
		* The div with the resulting data is shown.
	*/
	$g = function(url, title, data, override, overridet) {
		if(data) data['override'] = data.override;
		else data = {'override': true};
		if(prefs.runStandalone) url = '?' + url;
		return History.pushState(data, (title?(overridet?title:'TJ Intranet: '+title):'TJ Intranet'), url);
	};
	$g_ajaxer = function(state) {
		console.log('ajaxer for '+state.url);
		u = state.url.split(prefs.ajaxroot);
		v = u[u.length-1];
		if(window.location.pathname.split('?')[0].indexOf(v.split('?')[0]) != -1) {
			v = v.split('?')[1];
		}
		$.get(v, {}, function(d) {
			console.log('Fetched: '+v);
			console.log('Got: '+d);
			id = cssSafe(v);
			$e = $('<div></div>').attr('class', 'main-contents main-contents-'+id);
			$('.main-content').append($e);

		});
	}
	$g_focus = function(url) {
		e = cssSafe(url);
		$('.main-contents').fadeOut(250);
		$e = $('.main-contents.main-contents-'+e);
		if($e.length > 0) {
			$e.fadeIn(250);
		} else {
			$('.main-contents.main-contents-err').fadeIn(250);
		}

	}
	/* finds all links and makes them ajaxier */
	$lf_init = function() {
		$('a').each(function() {
			$t = $(this);
			if($t.attr('href') != null) {
				//$t.attr('onclick', 'return $g_lc(\''+escape($t.attr('href'))+'\', \''+escape($t.attr('ajax_data'))+'\')');
				$t.click(function() {
					return $g_lc($(this).attr('href'), $(this).attr('ajax_data'));
				});
			}
		})
	};
	$g_lc = function(href, datas) {
		href = unescape(href);
		datas = unescape(datas);
		try {
			data = JSON.parse(datas);
		} catch(e) {data={};}
		if(href.indexOf('://') !==-1) {
			try {
				i = href.split('://');
				j = i[1].split('/');
				if(j[0] != window.location.host) {
					console.log('Letting browser handle link: '+href);
					return true;
				}
			} catch(e) { /* continue */ }
		}
		console.log(data);
		$e = $('.main-contents.main-content-'+cssSafe(href));
		if($e.length>0) data.override = 2;
		$g(href, data.title, data.data, data.override);
		return false;
	};