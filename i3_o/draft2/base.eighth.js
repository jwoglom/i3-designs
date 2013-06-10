eighth = {};
eighth.click = page.go;
eighth.sched_hover = function (day, blk, down) {
	elm = 'eighth-act-'+day+'-'+blk+'-data';
	console.log(elm+' down'+down);
	$e = $('.'+elm);
	if(down===true) {
		$e.hide();
	} else {
		$e.show();
	}
}