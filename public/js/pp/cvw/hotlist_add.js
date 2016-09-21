$(document).ready(function(e,v){
	
	$('.add-to-hotlist').click(function(){
		
		// using same method as "Add from Quality DB"
		var cand_id = window.location.search.split('&')[0].split('?ID=')[1];
		$(cand_id).addToHotlist();
	});
	
	initAddToHotlist($);
});


var initAddToHotlist = (function($){
	$.fn.addToHotlist = function(){
		
		if (arguments.length == 1) {
			window.location = '/pp/cvw/lists_update.php?list_id=' + arguments[0] + '&selected_candidate=' + this.selector;
			return;
		}		
		
		var candId = this.selector;
		
		(function(data){

			if (data.length == 0) {
				$('<div />').html('You do not have any hotlists.').appendTo('body').dialog();
				return;
			}
			
			var items = [];
			
			$.each(data, function(k,v){
				items.push('<li><a href="/pp/cvw/lists_update.php?list_id=' + v.id + '&selected_candidate=' + candId + '">' + v.title + '</a></li>');
			});
			
			
			$('<div />', {
				title: 'Choose a hotlist',
				html: [
				       $('<p/>').html('Please select a hotlist you wish to add this candidate to:').html(),
				       '<br /><br />',
				       $('<ul/>', { html: items.join('') }).html(),
				       '<br />'
				      ].join('')
			}).appendTo('body')
			  .dialog({width: 400});
			
		})(pp.api('hotlists').lists);
		
	};
});

