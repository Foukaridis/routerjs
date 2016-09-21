/**
 * Resize the iframe when the font size changes.
 * 
 * @author Ferdi Schmidt <ferdi@parallel.co.za>
 * @copyright 2012, Parallel Software.
 */

$(document).ready(function(){
	
	$(document).bind('fontChange', function(size){
		
		var $iframe = $('.cv_data').find('iframe'),
			iframe_height = $iframe[0].contentWindow.document.documentElement.clientHeight;

		if (iframe_height < 500) {
			return; // iframe hasn't finished loading yet.
		}

		$iframe.height(iframe_height);
		$iframe.parent().height(iframe_height);
	});
});