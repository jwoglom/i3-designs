if(typeof app.news == 'undefined') app.news = {};

app.news.homeNext = function() {
	d('loading next news page', 9, 'app.news');
	$b = $('.news header.newspost.next span');
	$c = $('.news .newsposts-container');
	$b.html(data.strings.loadGif);
}