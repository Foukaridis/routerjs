$(document).ready(function(){
	$('.click_button').click(function(){
		cv_contents = $(this).parent().find('div.cv_contents_hide');
		cv_contents.addClass('cv_contents').fadeIn('slow');
		
	});
	$('.close').click(function(){
		cv_contents = $(this);
		cv_contents.parent().hide();
	});
});