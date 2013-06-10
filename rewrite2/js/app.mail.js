if(typeof app.mail == 'undefined') app.mail = {};

app.mail.homeMore = function() {
	$b = $('.home-left .mail div.more');
	$c = $('.home-left .mail .mails');
	$b.html(data.strings.loadGif);
}