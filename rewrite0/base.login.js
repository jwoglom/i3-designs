calendar = {};
calendar.link_url = "http://www.calendarwiz.com/calendars/calendar.php?crd=tjhsstcalendar&jsenabled=1&winH=802";
calendar.url = "fetch.php?"+calendar.link_url;
calendar.unload = function() {
	$('.main-links, .main-schedule').toggle();
}
calendar.init = function() {
	$('.main-links, .main-schedule').toggle();
	$e = $('.main-calendar');
	if(typeof calendar.D == 'undefined') {
		console.log("Fetching calendar");
		jQuery.get(calendar.url, {}, function(d) {
			calendar.Fd = d;
			$d = calendar.$Fd = $(d);
			calendar.D = $d.filter("table").eq(2).html();
			$e.html(calendar.D);
			$e.append('<style>'+(calendar.Fds=calendar.Fd.split('<style type="text/css">'))[1].split('</style>')[0]+'</style>');
			$e.append('<style>'+calendar.Fds[2].split('</style>')[0]+'</style>');
			$e.append('<script>function epopup'+calendar.Fd.split('function epopup')[1].split('function goparent')[0]+'</script>');
			$('.main').toggleClass('main-container-calendar');
		});
	} else {
		console.log("Redisplaying calendar");
		$('.main').toggleClass('main-container-calendar');
		//$e.html(calendar.D);
	}
}
