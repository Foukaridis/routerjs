$(document).ready(function(){
	$('.list_a, .list_b').click(function(some) {
		var where_click_was;
		var open_button_id;
		var close_button_id;
		var see_more;
		var row_toggle_button;
		var content_string;
		var candidate_href_value;
		var source_td;
		var vacancies;
		var jobsector_function_string = '';
		var status_string = '';
		var candidate;
		var weird_escape;
		var checkbox;
		var details_link;
		var time_string = '';
		var candidate_string = '';
		var name_cell;
		var candidate_name;
		var refresh_content;
		var content_tds;
		var check_box;
		
		candidate_href_value = $(this).find('td:last').find('a:first').attr('href');
		where_click_was = some.target.innerHTML;
		row_toggle_button = $(this).find('.row_toggle_button')[0];
		details_button = $(this).find('a')[0];
		check_box = $(this).find('input')[0];
		open_button_id = $(this).find('.click_button')[0];
		time_cell = $(this).find('td.time');
		viewed_cell = $(this).find('td.read_unread');
		status_cell = $(this).find('td.status');
		source_td = $(this).find('td.source');
		name_cell = $(this).find('td.duplicate_check');
		close_button_id = $(this).find('.close')[0];
		see_more = $(this).find('.even_more')[0];
		candidate_name = $(this).find('td.duplicate_check > .candidate_name').html();
		refresh_content = false;
		cv_contents_narrow = $(this).find('div.cv_contents_narrow');
		content_tds = $(this).find('td');
		
		if(open_button_id){
			if(open_button_id.innerHTML == where_click_was){
                            
                                $(this).find('div.cv_contents_hide')
                                    .addClass('ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable ui-resizable')
                                    .find('h5')
                                        .addClass('ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix')
                                    .parent()
                                    .find('.close')
                                    .html(
                                        $('<a />', {href: '#', role: 'button'})
                                            .click(function(){
                                                $(this).parent().click();
                                            })
                                            .addClass('ui-dialog-titlebar-close ui-corner-all')
                                                .html(
                                                    $('<span />')
                                                        .addClass('ui-icon ui-icon-closethick')
                                                        .html('close')
                                                )
                                    )
                                        .parent()
                                    .draggable({ handle: 'h5'});
                                        
                                 
                                    
				$(this).find('div.cv_contents_hide').fadeIn();
				$(this).find('div.even_more').fadeIn();
			}	
		}
		
		if(close_button_id){
			if(close_button_id.innerHTML == where_click_was){
				$(this).find('div.cv_contents_hide').fadeOut();
				refresh_content = true;
			}
		}
		
		if(see_more){
			if(see_more.innerHTML == where_click_was){
				$(this).find('div.cv_contents_hide').css('width', '747px').css('padding-right', '0').css( 'margin-left', '-459px').css('margin-top', '-300px').css( 'max-height', '690px').css( 'height', '690px');
				$(this).find('div.cv_contents').hide();
				$.post('../ajax/wi_results_more_candidate_data.php', {source: '', candidate_href: candidate_href_value, output_size: 'narrow'},function(narrow_cv){
					newly_rendered = narrow_cv.rendered_cv;
					cv_contents_narrow.html(newly_rendered).show();
				},"json");
				
				$(this).find('div.cv_data').css('display', 'inline');
				$(this).find('div.even_more').fadeOut();
			}	
		}
		
		if(row_toggle_button){
			if(row_toggle_button.innerHTML == where_click_was){
				$.post('../ajax/wi_candidates_return_original_row.php', {candidate_url: candidate_href_value},function(original_data){
					candidate_data_returned = original_data;
					source_td.html(candidate_data_returned.source_notes);
					time_cell.html(candidate_data_returned.date_submitted);
					viewed_cell.html(candidate_data_returned.viewed);				
					status_cell.html(candidate_data_returned.status);
					name_cell.html(candidate_name).attr('height','');;
				},"json");
				$(this).removeClass('detail_row');
			}	
		} else {
			if(!$(this).hasClass('detail_row') && details_button.innerHTML != where_click_was && check_box.innerHTML != where_click_was){
				name_cell.addClass('preloader');
				name_cell.attr('height','100');
				//source vacancies
				$.post('../ajax/source_notes_to_vacancies.php', {source: source_td.html()},function(data){
					vacancies = data;
					if(vacancies.output != '' && vacancies.output != null && vacancies.output != undefined){
						source_td.html(vacancies.output).removeClass('preloader');
					}
				},"json");
				$.post('../ajax/wi_results_more_candidate_data.php', {source: name_cell.html(),candidate_href: candidate_href_value, output_size: 'wide'},function(data_source){
					//candidate_name
					candidate = data_source;
					if(candidate){
						if(candidate.output){
							candidate_string = candidate.output;	
						}
					}
					
					//job sector and function
					if(candidate.jobsector_function){
						jobsector_function_heading = '<div class="candidate_name">Job Functions/Sectors</div>';
						jobsector_function_string = jobsector_function_heading+candidate.jobsector_function;	
					}
					
					//status
					status_heading = '<div class="candidate_name">Status</div>';
					if(candidate.status && candidate.status != 'undefined' && candidate.status != 'null' && candidate.status != ''){
						status_string = status_heading+candidate.status;	
					} else {
						status_string = status_heading+'<i>[no detail]</i>';
					}

					if(status_string != '' || jobsector_function_string != ''){
						status_cell.html(status_string+'<br /><br />'+jobsector_function_string).removeClass('preloader');
					}
					//time
					if(candidate.time != ''){
						time_string = candidate.time;
						time_heading = '<div class="candidate_name">Last change</div>';
						if(candidate.generated_cv != null && candidate.generated_cv != ''){
							cv_preview = candidate.generated_cv;
						} else {
							cv_preview = '';
						}
						if(candidate['contact_details'] != "" && candidate['contact_details'] != undefined){
							contact_details = candidate['contact_details'];
						} else {
							contact_details = '';
						}
						time_cell.html(time_heading+time_string+cv_preview+contact_details).removeClass('preloader');
					}
					name_cell_content = candidate_string;
					name_cell.html(name_cell_content).prepend('<div class="row_toggle_button">hide</div>').removeClass('preloader');
								
				},"json");
				
				$(this).addClass('detail_row');
			}	
		}
		
	}); //end of the first click event.
});