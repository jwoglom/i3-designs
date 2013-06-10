$(document).ready(function() {
	$('span.mark').click(function() {

		id = $(this).parent().attr('id').split('newsposth_')[1];
		$c = $('div#newspost_' + id);
		// hide other newsposts
		$('.newsposts-container div.newspost-post').removeClass('open');
		$('.newspost span.mark .d').hide();
		$('.newspost span.mark .u').show();
		// if hidden
		if($(this).find('.d').css('display') == 'none') {
			$(this).find('.d').toggle();
			$(this).find('.u').toggle();
			$c.addClass('open');

		} else {
			$(this).find('.d').toggle();
			$(this).find('.u').toggle();
			$c.removeClass('open');
		}
	})
});