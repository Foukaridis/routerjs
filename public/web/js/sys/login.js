initResize = function() {

	$('<div />', {id: 'bzr'}).html('I\'m busy resizing the document.').css({
		position: 'absolute',
		top: '0px',
		left: '0px',
		'background-color': '#CCC'
	});

	// to calculate posiitons
	var dy = $('html').height();
	var dx = $('html').width(); // I dunno

	// do a quick calculation to find out how much space is available for the bar's links
	// r:126 + l:185 = 311
	// main_form = 414
	// padding in between = (10 *4) = 20
	// total = 765

	// if there isn't enough space, remove the bar.
	if (dx < 800)
		$('.bar').remove();
	else {
		// set bar position
		$('.bar').css({
			top:(( (dy / 2) - ($('.bar').height() / 2))) + 'px'
		});

		// there is enough space, so fit the links in.
		var asps = (dx - 414) / 2;
		$('.bar').find('span.back').css({
			left: ((asps - 195) / 2) + 'px' // center
		});

		// now right
		$('.bar').find('span.forward').css({
			left: ((asps + 414) + ((asps / 2) - (136 / 2))) + 'px' // center
		});

	}

	// position for main login form wrapper
	var frm_top = (dy / 2) - ($('.main_login').height() / 2) - 6;
	var frm_left = (dx / 2) - ($('.main_login').width() / 2) - 6;

	// hack for mobiles
	// if there is either not enough space vertically or horizontally for the form,
	// pop the form into the body by itself
	if (frm_top < 0 || frm_left < 0) {
		frm_top = 0;

		$('body').html($('.main_login').html());
		$('.main_login_wrap').css({
			border: 'none',
			'box-shadow': 'none',
			'text-align':'center',
			padding: '5px'
		});

		$('body').css({
			background: '#FFF'
		});

		$('input').css({
			width: '100%'
		});

		$('.login_form').css({
			width: '80%',
			'margin' : 'auto',
			'text-align': 'left'
		});

		return;
	}

	$('.main_login').css({
		top: frm_top + 'px',
		left: frm_left + 'px'
	});

	$('#bzr').remove();
};

doLogin = function() {

	// to calculate posiitons
	var dy = $('html').height();
	var dx = $('html').width(); // I dunno


	if ($('#username').val() === '' || $('#password').val() === '') {

		if (typeof $('.error').html() === 'string')
			return false;

		$('.main_login_wrap').find('hr').after('<div class="error">Please fill in all fields.</div>');
		setTimeout(function(){
			$('.error').fadeOut(850, function(){$(this).remove();});
		}, 500);

		return false;
	}

	// overlay
	$('<div />').addClass('overlay').appendTo('body').hide();

	$('.overlay').css({
		width: dx,
		height: dy,
		'z-index': 5
	});

	$('.login_form').fadeOut('fast', function(){
		$(this).css({
			'text-align': 'center',
			'color': '#666',
			border: 'none'
		});

		$('body').css({
			background: '#FFF'
		})
;
		$('.login_form').html('<img src="images/loading.gif" />');

		$('.login_form').find('img').css({
			'margin-top': '75px'
		});

		$('.login_form').fadeIn('fast');
	});


	$('div[class^=overlay]').fadeIn('fast');

	return true;
};

$(document).ready(function(){
	
	// resize properties
	$(window).resize(initResize);
	$(window).resize();

	$('input#username').focus();

	$('.login_button').click(doLogin);

	if (typeof $('.error').html() === 'string') {
		$('.error').fadeIn();
		setTimeout(function(){
			$('.error').fadeOut(850, function(){$(this).remove();});
		}, 750);
	}

	return;
});