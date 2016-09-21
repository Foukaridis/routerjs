$(document).ready(function(){
	if($('input#consultant_status_2').attr('checked')){
		$('div#choose_date_ranges').show();
	}
	$('input[type=radio]').change(function(){
			if($('input#consultant_status_2').attr('checked')){
				$('div#choose_date_ranges').slideDown();
				$('label[for=consultant_status_2]').text('Customise restrictions.');
					
			} else {
				$('div#choose_date_ranges').slideUp();
			}
	});
	
	/**
	 * Date Pickers
	 */
	$(function() {
		var dates = $( "#from_access_date, #to_access_date" ).datepicker({
			defaultDate: "+1w",
			dateFormat: "yy-mm-dd",
			changeMonth: true,
			numberOfMonths: 3,
			buttonImageOnly: true,
			onSelect: function( selectedDate ) {
				var option = $(this).hasClass("from") ? "access_date_start" : "access_date_end",
					instance = $( this ).data( "datepicker" ),
					whose_checkbox = $(this).hasClass("from") ? "#access_from_limit" : "#access_to_limit",
					date = $.datepicker.parseDate(
						instance.settings.dateFormat ||
						$.datepicker._defaults.dateFormat,
						selectedDate, instance.settings );
				dates.not( this ).datepicker( "option", option, date );
				$(whose_checkbox).attr('checked','checked');
				//Save the date to the DB.
				user_id = $('#user_id').val();
				$.post("../ajax/user_access_time.php", {consultant_id: user_id, which_end: option, date_setting: selectedDate},function(data){
					//Notifications have low priority on PP.
				});
			}
		});
	});
	
	/**
	 * Slider
	 */
	$(function() {
		user_id = $('#user_id').val();
		
		//Get the current, if any, custom settings. Or defaults.
		start_time = $('input#start_time').val();
		if(start_time == ''){
			start_time = 6;
		}
		end_time = $('input#end_time').val();
		if(end_time == ''){
			end_time = 18;
		}
		
		$( "#slider-range" ).slider({
			orientation: "horizontal",
			range: true,
			min: 0,
			max: 24,
			values: [ start_time, end_time ],
			slide: function( event, ui ) {
				$( "#amount" ).val( "From: " + ui.values[ 0 ] + "h00 to " + ui.values[ 1 ] + "h00" );
			}
		});
		$( "#amount" ).val( "From: " + $( "#slider-range" ).slider( "values", 0 ) + "h00 to " +
			$( "#slider-range" ).slider( "values", 1 ) + "h00") ;
		
		$( "#slider-range" ).bind( "slidestop", function(event, ui) {
			latest_start_time = ui.values[0];//$( "#slider-range" ).slider( "values", 0 );
			latest_end_time = ui.values[1]; //$( "#slider-range" ).slider( "values", 1 );
			$.post("../ajax/user_access_time.php", {consultant_id: user_id, start_time: latest_start_time, end_time: latest_end_time},function(data){
				//Notifications have low priority on PP.
			});
		});	
	});
	
	
	
	$('#access_from_limit').change(function(){
		if(!$(this).attr('checked') && $('#from_access_date').val() != ''){
			$('#from_access_date').val('');
			//Clear the from date in the DB
			user_id = $('#user_id').val();
			$.post("../ajax/user_access_time.php", {consultant_id: user_id, which_end: 'access_date_start', date_setting: ''},function(data){
				//Notifications have low priority on PP.
			});
		} else {
			if($('#from_access_date').val() == ''){
				$('#from_access_date').focus();
			}
		}
	});
	
	$('#access_to_limit').change(function(){
		if(!$(this).attr('checked') && $('#to_access_date').val() != ''){
			$('#to_access_date').val('');
			//Clear the from date in the DB
			user_id = $('#user_id').val();
			$.post("../ajax/user_access_time.php", {consultant_id: user_id, which_end: 'access_date_end', date_setting: ''},function(data){
				//Notifications have low priority on PP.
			});
		} else {
			if($('#to_access_date').val() == ''){
				$('#to_access_date').focus();
			}
		}
	});
	
	$('#access_weekends').change(function(){
		if($(this).attr('checked')) {
			access_weekends = 'yes';
		} else {
			access_weekends = 'no';
		}
		$.post("../ajax/user_access_time.php", {consultant_id: user_id, access_weekend: access_weekends},function(data){
			//Notifications have low priority on PP.
		});
	});
});