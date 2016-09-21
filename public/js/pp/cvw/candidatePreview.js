/* 
 * Candidate Preview module
 * Written as a jQuery plugin for convenience.
 * 
 * @author Ferdi Schmidt <ferdi@parallel.co.za>
 * @copyright 2012, Parallel Software Pty. Ltd. * 
 */
(function($){
	$.fn.candidatePreview = function(indiv_settings){
		
		$this = $(this);
		var root_this = this;
		
		var defaults = {
			colspan	: 8,
			url		: '/pp/ajax/cvw/candidate_preview.php?id=:id',
			cache	: 'true'
		};
		
		var settings = $.extend(defaults, indiv_settings);
		var row_cache = {};
		
		// get the candidate ID
		var $row_aref = $this.find('td:last a');
		
		// access control will have removed the anchor tag if applicable
		// CHECK FOR THIS
		if ($row_aref.length == 0) {
			return false; // My work here is done.
		}
		
		var cand_aref = document.createElement('a');
		cand_aref.href = $row_aref.attr('href');
		
		var candidateId = cand_aref.search.split('=')[1];
		if (candidateId.indexOf('&') !== -1) {
			candidateId = candidateId.split('&')[0];
		}
		
		// Hover states
		(function(){
			$(root_this).hover(
				function(){
					
					// Do not show the toggle div when the row is open.
					if ($(this).find('td:last').find('a').length === 2) {
						$(this).find('.untoggle').fadeIn();
						return;
					}
					
					// if you're bored some day, comment out the following line. :D
					$(this).parent().find('.toggle').remove();
					
					var 
						width = parseInt($(this).width(), 10),
						toggle = $('<div />')
							.addClass('toggle')
							.text('Show More')
							.css({
								'margin-left' : '-' + ((width / 2)) + 'px'
							});

					if ($(this).find('.toggle').length === 0) {
						toggle.appendTo($(root_this).find('td:last')).fadeTo(150, 1);
					} else {
						$(this).find('.toggle').fadeTo(150, 0.6);
					}

				},
				function(){
					// out
					
						$(this).find('.untoggle').fadeOut();
					$(this).find('.toggle').fadeOut(100);
				}
			);
		})();
		
		$(root_this).click(function(ev){
			
			// do not follow through on checkboxes
			if (ev.target.type == 'checkbox') {
				return true;
			}
			
			init();
			
		});
		
		var init = function() {
			$(root_this).unbind('click');
			$(root_this).find('td:last .toggle').remove();
			
			
			rebuildRow();			
		};
		
		var rebuildRow = function() {
			
			// chech if the first cell contains a checkbox, if so, skip
			if ($(root_this).find('td:first').find('input').length > 0) {
				var $container = $(root_this).find('td:eq(1)').addClass('data_container');
			} else {
				var $container = $(root_this).find('td:first').addClass('data_container');
			}
			
			// manipulate row cells
			root_this.find('td:not(:last)').hide();
			root_this.find('td[width="15"]').show();
	         
			root_this.find('td:last').css({ 'vertical-align': 'middle' }).find('a').html('<img src="/img/icons/user32.png" style="width: 16px; height: 16px" />')
				.parent().parent().find('td').addClass('row_select');
			
			root_this.find('td:last').html(root_this.find('td:last').html().replace('[', '').replace(']', ''));
			root_this.find('td:last').append(
				'<br /><a href="#" title="Click here to preview the candidate\'s CV" class="previewCV"><img src="/img/icons/linedpaper32.png" style="width: 16px; height: 16px;" /></a>' +
					'<span class="untoggle" style="margin: 0;margin-left: -' + (($(root_this).width() / 2)) + 'px;top: ' + ($(root_this).offset().top -4 )+ 'px">Show Less</span>'
			);
			row_cache.html = $container.html();
			$container.show();
			$container.attr('colspan', settings.colspan);
			
			
			$container.html($('<div class="loader"><img src="/img/ui/load.gif" /> ' + $container.text() + '</div>'));
			$.ajax({
				dataType: 'json',
				cache: settings.cache,
				url: settings.url.replace(':id', candidateId),
				success: buildTable,
				error: requestFailed
			});
			
			// show be the last possible action
			releaseRowEvents();
		};
		
		
		var buildTable = function(data) {
			var $container = $(root_this).find('.data_container');
			
			$container.find('.loader').remove();
			$container.html(
				$('<table />').append(
					$('<tr />')
					.append($('<td />').addClass('basic'))
					.append($('<td />').addClass('education'))
					.append($('<td />').addClass('employment'))
					).hide()
				);
				
			// proxy the data through again.
			populateTable(data);
		};
		
		var populateTable = function(data) {
			var $table = $(root_this).find('.data_container').find('table');
			
			
			var basic = $('<ul />');

			if (data.avatar != 'None') {
				basic.append( $('<img src="' + data.avatar + '" alt="Profile Picture" class="avatar" />') );
			}
			
			basic
			.append( $('<li />').html('<span class="spacer">Name</span>' + data.name) )
			.append( $('<li />').html('<span class="spacer">ID Number</span>' + data.idnumber) )
			.append( $('<li />').html('<span class="spacer">Gender</span>' + data.gender) )
			.append( $('<li />').html('<span class="spacer">Location</span>' + data.location) )
			.append( $('<li />').html('<span class="spacer"></span>') )
			.append( $('<li />').html('<span class="spacer">EE</span>' + data.ee) )
			.append( $('<li />').html('<span class="spacer">Nationality</span>' + data.nationality) )
			.append( $('<li />').html('<span class="spacer">Salary</span>' + data.salary) )
			
			
			var education = $('<ul />');
			$.each(data.education, function(k, v){
				education
				.append($('<span />').addClass('title').html(v[0]))
				.append($('<span />').addClass('year').html(v[1]))
			;
			});
			
			var employment = $('<ul />');
			$.each(data.employment, function(k, v){
				employment
				.append($('<span />').addClass('position').html(v[0]))
				.append($('<span />').addClass('duration').html(v[1]))
			});
			
			var 
			contact = $('<ul />')
			.append( $('<li />').html('<span class="spacer">Cell</span>' + data.cell) )
			.append( $('<li />').html('<span class="spacer">Email</span>' + data.email) ),
					
			classification = $('<ul />')
			.append( $('<li />').html('<span class="spacer">Consultant</span>' + data.consultant) )
			.append( $('<li />').html('<span class="spacer">Status</span>' + data.status) )
			.append( $('<li />').html('<span class="spacer">Availability</span>' + data.availability) )
			.append( $('<li />').html('<span class="spacer">Rating</span>' + data.rating) )
			
			basic.appendTo($table.find('.basic').html('<h4>Basic Information</h4>'));
			education.appendTo($table.find('.education').html('<h4>Education</h4>'));
			employment.appendTo($table.find('.education').append('<br /><h4>Employment History</h4>'));
			contact.appendTo($table.find('.employment').append('<h4>Contact Details</h4>'));
			classification.appendTo($table.find('.employment').append('<br /><h4>Classification</h4>'));
			
			attachEvents(data);
			
			// last possible event to fire.
			$table.fadeIn();
			
		};
		
		var releaseRowEvents = function() {
			$(root_this).click(function(){
				$(root_this).find('td.data_container').attr('colspan', '1').removeClass('data_container').html(row_cache.html).parent().find('td').show();
				root_this.find('td:last').css({ 'vertical-align' : 'top' }).find('a').text('[Details]').parent().find('a.previewCV').remove();
				root_this.find('td').removeClass('row_select');
				root_this.find('.untoggle').remove();
				
				$(root_this).click(function(){
					init();
				})
			});
		};
		
		// Error Handler
		var requestFailed = function(){
			$(root_this).trigger('click').unbind();
			
			return true;
		};
		
		var attachEvents = function(data) {
			root_this.find('a.previewCV').click(function(){
				
				// the cv contents was within the ajax data request
				// but since we use jQuery, which doesn't have data visiualization,
				// or templating, or really anything one would want from a proper 
				// JavaScript *LIBRARY*, we need to either use another templating
				// *LIBRARY* like Handlebars or just opt for creating the layout
				// our lonesome selves.
				
				var name = data.name + ((data.name.slice(-1) == 's') ? '\'' : '\'s') + ' CV contents';
				
				row_cache.dialog = $('<div />', { title: name, 'class' : 'cvPreviewDialog' })
					.append('<div class="header">Displaying generated CV contents</div>')
					.append('<div class="contents">' + data.cv_contents + '</div>');
				
				row_cache.dialog.dialog({ modal: false, width: 560, height: 430 });
				return false;
			});
			

            root_this.find('td:last').find('a:first').click(function(e)
            {
                window.location = $(this).attr('href');
                e.preventDefault();
                e.stopPropagation();
                
                return false;
            });
            
			// call qtip on a:title's
			$(root_this).redrawQtip();
			
			// call QuickSMS
			if ($.fn.quickSMS) {
    			$(root_this).find('a[href*="sms/sms_send.php?cell="]').each(function(k, v){
    				$(this).quickSMS();
    			});
			}
		};
		
		
		// a small hack so that links events aren't followed through
		root_this.find('a').click(function(e){
			window.location.href = $(this).attr('href');
			e.preventDefault();
			e.stopPropegation();
			return false;
		});		
	}
})(jQuery);

$(document).ready(function(){
	
	// append the pugin to all tr elements
	$('table.list_inner').find('tr.list_a, tr.list_b').each(function(k, v){
		$(this).candidatePreview();
	});
});

