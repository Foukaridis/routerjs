$(document).ready(function(){

	// Pushes a JS object to the DOM.
	var pushJobSectors = function(data, $that) {

		$that.find('td.loader')
			.html(data)
			.css("color","#565454");
	};
	
	var laterIds = [];
	var doMultipleLater = function(vid, rid) {
		laterIds.push([vid, rid]);
		return true;
	};
	
	$.each($('form #vacancy_list tbody').find('tr.list_a, tr.list_b'), function(k, v){
		var vacancy_id = $(this).find('td.loader').text(),
			$that		 = $(this),
			rid			 = $(this).attr('id');
			doMultipleLater(vacancy_id, rid);
	});

	$.ajax({
		url: '/pp/ajax/jobsectors_functions_vacancies.php',
		type: 'post',
		dataType: 'json',
		data: {
			ids: laterIds
		},
		async: 'true',
		success: function(data) {
			$.each(data, function(k, v) {
				var $that = $('form #vacancy_list tbody').find('tr[id="' + v['rid'] + '"]');
				pushJobSectors(v['JobSector'], $that);
			});
		}
	});
});
