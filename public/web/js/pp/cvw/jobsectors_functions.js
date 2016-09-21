$(document).ready(function(){
	
	// Pushes a JS object to the DOM.
	var pushJobSectors = function(data, $that) {
		$that.find('td.loader')
			.html(data)
			.css("color","#565454");
	};
	
	var laterIds = [];
	var doMultipleLater = function(cid, rid) {
		laterIds.push([cid, rid]);
		return true;
	};
	
	$.each($('form#candidates_list tbody').find('tr.list_a, tr.list_b'), function(k, v){
		var candidate_id = $(this).find('td.loader').text(),
			$that		 = $(this),
			rid			 = $(this).attr('id');
			doMultipleLater(candidate_id, rid);
	});

	$.ajax({
		url: '/pp/ajax/jobsectors_functions.php',
		type: 'post',
		dataType: 'json',
		data: {
			ids: laterIds
		},
		async: 'true',
		success: function(data) {
			$.each(data, function(k, v){
				var $that = $('form#candidates_list tbody').find('tr[id="' + v['rid'] + '"]');
				
				pushJobSectors(v['JobSector'], $that);
			});
		}
	});
});
