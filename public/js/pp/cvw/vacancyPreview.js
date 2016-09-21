/* 
 * Vacancy Preview module
 * Written as a jQuery plugin for convenience.
 * 
 * @author Ferdi Schmidt <ferdi@parallel.co.za>
 * @author Roland Rieseberg <roland@parallel.co.za>
 * @copyright 2014, Parallel Software Pty. Ltd. * 
 */
(function($){
	$.fn.vacancyPreview = function(indiv_settings){
		$this = $(this);
		var root_this = this;

		var defaults = {
			colspan	: 9,
			url		: '/pp/ajax/cvw/vacancy_preview.php?id=:id',
			cache	: 'true'
		};
		
		var settings = $.extend(defaults, indiv_settings);
		var row_cache = {};
		
		// get the vac id
		var $row_aref = $this.find('td:last a');
		
		// access control will have removed the anchor tag if applicable
		// CHECK FOR THIS
		if ($row_aref.length == 0) {

			return false; // My work here is done.
		}
		
		var vac_aref = document.createElement('a');
		vac_aref.href = $row_aref.attr('href');
		
		var vacancyId = vac_aref.search.split('=')[1];

		if (vacancyId.indexOf('&') !== -1) {
			vacancyId = vacancyId.split('&')[0];
		}
		
		// Hover states
		(function(){
			$(root_this).hover(
				function(){
				
					if ($(this).find('td:last').find('span').length === 1) {
						// In case offset changes due to multiple open previews
						$(this).find('.untoggle').css('top', ($(root_this).offset().top -4 ) + 'px');						
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
					$(this).find('.toggle').fadeOut();
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
				var $container = $(root_this).find('td:eq(3)').addClass('data_container');
			} else {
				var $container = $(root_this).find('td:nth-child(3)').addClass('data_container');
			}
			
			// manipulate row cells
			root_this.find('td:not(:last)').hide();
			root_this.find('td[width="15"]').show();
			root_this.find('td:last').css({ 'vertical-align': 'middle' }).find('a').html('<img src="/img/icons/article32.png" style="width: 16px; height: 16px" />')
				.parent().parent().find('td').addClass('row_select');
			root_this.find('td:last').css({ 'vertical-align': 'middle' }).find('a').attr('onclick', 'javascript:window.location=this.href');
			root_this.find('td:last').html(root_this.find('td:last').html().replace('[', '').replace(']', ''));
			root_this.find('td:last').append(
				'<br /><span class="untoggle" style="margin: 0;margin-left: -' + (($(root_this).width() / 2)) + 'px;top: ' + ($(root_this).offset().top -4 ) + 'px">Show Less</span>'
			);

			row_cache.html = $container.html();
			$container.show();
			$container.attr('colspan', settings.colspan);
	
			$container.html($('<div class="loader"><img src="/img/ui/load.gif" /> ' + $container.text() + '</div>'));
			$.ajax({
				dataType: 'json',
				cache: settings.cache,
				url: settings.url.replace(':id', vacancyId),
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
					$('<tr />').addClass("vacancydetails")
					.append($('<td />').addClass('vacancydetail'))
					.append($('<td />').addClass('clientdetails'))
					.append($('<td />').addClass('crendetails'))
					)
				);

				if (!jQuery.isEmptyObject(data.prospectiveCandidates)) {
					//$('<tr />').insertAfter('.vacancydetails').append($('<td />').attr('colspan', 4).addClass('prospectivecandidates'));
					$container.find('tr.vacancydetails').after($('<tr /><td colspan="4" class="prospectivecandidates" />'))
				}

			populateTable(data);
		};
		
		var populateTable = function(data) {
			var $table = $(root_this).find('.data_container').find('table');

			var vacancydetail = $('<ul />');
			vacancydetail
			.append( $('<li />').html('<span class="spacer">Ref Nr</span>' + $(root_this).find('td:first').html()))
			.append( $('<li />').html('<span class="spacer">Branch</span>' + data.branch))
			.append( $('<li />').html('<span class="spacer">Consultant</span>' + data.consultant))
			.append( $('<li />').html('<span class="spacer">Report To</span>' + data.reportto))
			.append( $('<li />').html('<span class="spacer">Job Title</span>' + data.jobtitle))
			.append( $('<li />').html('<span class="spacer">Date</span>' + $(root_this).find('td:eq(2)').html()))
			.append( $('<li />').html('<span class="spacer">Area</span>' + data.area))
			.append( $('<li />').html('<span class="spacer">Position Type</span>' + data.position) )
			.append( $('<li />').html('<span class="spacer">Status</span>' + data.status))
			
			
			var clientdetails = $('<ul />');
			clientdetails
			.append( $('<li />').html('<span class="spacer">Client</span>' + data.company))
			.append( $('<li />').html('<span class="spacer">Branch</span>' + data.companybranch))
			.append( $('<li />').html('<span class="spacer">Main Contact</span>' + data.contact))
			.append( $('<li />').html('<span class="spacer">Designation</span>' + data.jobtitle))
			.append( $('<li />').html('<span class="spacer">Tel</span>' + data.contacttel))

			.append( $('<li />').html('<span class="spacer">Cell</span>' + '<a style="color: blue" title="Send an SMS" href="/pp/sms/sms_send.php?cell=' + data.contactcell + '&amp;name=' + data.contact + '&amp;RTPG=/pp/vcs/vacancy_list.php">' + data.contactcell + '</a>'))
			.append( $('<li />').html('<span class="spacer">Fax</span>' + data.contactfax))
			.append( $('<li />').html('<span class="spacer">Email</span>' + data.contactemail))

			var crendetails = $('<ul />');

			crendetails
			.append( $('<li />').html('<span class="spacer">Total Package</span>' + data.totalpackage))
			.append( $('<li />').html('<span class="spacer">Basic Salary</span>' + data.basicsalary))
			.append( $('<li />').html('<span class="spacer">Nett Salary</span>' + data.nettsalary))
			.append( $('<li />').html('<span class="spacer">Annual Leave</span>' + data.annualleave))
			.append( $('<li />').html('<span class="spacer">Medical Aid</span>' + data.medical)).append('<br />');

			var conclusiondetails = $('<ul />');

			conclusiondetails
			.append( $('<li />').html('<span class="spacercon">Conclusion Status</span>' + data.conclusionstatus) )
			.append( $('<li />').html('<span class="spacercon">Vacancy Expires</span>' + data.conclusionexp) )

			 if (!jQuery.isEmptyObject(data.prospectiveCandidates)) {

				var prospectivecandidates = $('<div />').addClass("tablemain");
			// $.each(data.prospectivecandidates, function(k, v){
				prospectivecandidates
				.append($('<div />').addClass('tablemainrow')
					.prepend($('<div />').addClass('tablemaincell').html("2nd Interview").addClass('namehead'))
					.prepend($('<div />').addClass('tablemaincell').html("1st Interview").addClass('namehead'))
					.prepend($('<div />').addClass('tablemaincell').html("Assessment").addClass('namehead'))
					.prepend($('<div />').addClass('tablemaincell').html("Consultant").addClass('namehead'))
					.prepend($('<div />').addClass('tablemaincell').html("CV Sent").addClass('namehead'))
					.prepend($('<div />').addClass('tablemaincell').html("Status").addClass('namehead'))
					.prepend($('<div />').addClass('tablemaincell').html("Source").addClass('namehead'))
					.prepend($('<div />').addClass('tablemaincell').html("Name").addClass('namehead')));

				// Only show this column if referrals is enabled
				if (data.prospectiveCandidatesEnabled == 1) {
					$('<div />').addClass('tablemaincell').html("Referral").addClass('namehead').insertAfter(prospectivecandidates.find('.tablemaincell:nth-child(3)'))
				}

				var dummyClass = 'cell';
				var counter = 0;

				jQuery.each(data.prospectiveCandidates, function(i, d) {
					prospectivecandidates.append($('<div />').addClass('tablemainrow').prepend($('<div />').addClass('tablemaincell').addClass(dummyClass + counter).html(d.SendOut3))
					.prepend($('<div />').addClass('tablemaincell').addClass(dummyClass + counter).html(d.SendOut2))
					.prepend($('<div />').addClass('tablemaincell').addClass(dummyClass + counter).html(d.SendOut))
					.prepend($('<div />').addClass('tablemaincell').addClass(dummyClass + counter).html('<span title="' + d.ConsultantFullName + '">' + d.AbbrName + '</span>'))
					.prepend($('<div />').addClass('tablemaincell').addClass(dummyClass + counter).html(d.CVSentDate))
					.prepend($('<div />').addClass('tablemaincell').addClass(dummyClass + counter).html(d.Status))
					.prepend($('<div />').addClass('tablemaincell').addClass(dummyClass + counter).html(d.source))
					.prepend($('<div />').addClass('tablemaincell').addClass(dummyClass + counter).html(d.NameSurname)));
					// Checking if referrals need to be included or not
					if (data.prospectiveCandidatesEnabled == 1) {
						$('<div />').addClass('tablemaincell').addClass(dummyClass + counter).html(d.ReferralDate).insertAfter(prospectivecandidates.find('.' + dummyClass + counter + ':nth-child(3)'))
					}
					counter++;
				});
			}
					
			vacancydetail.appendTo($table.find('.vacancydetail').html('<h4>Vacancy Details</h4>'));
			clientdetails.appendTo($table.find('.clientdetails').html('<h4>Client Details</h4>'));
			crendetails.appendTo($table.find('.crendetails').html('<h4>Renumeration Package</h4>'));
			$table.find('.crendetails').find('ul').append('<h4>Conclusion</h4>').append(conclusiondetails);

			if (!jQuery.isEmptyObject(data.prospectiveCandidates)) {
				prospectivecandidates.appendTo($table.find('.prospectivecandidates').html('<h4>Prospective Candidates</h4>'));
			}			

			attachEvents(data);
			
			// last possible event to fire.
			$table.fadeIn();
		};
		
		var releaseRowEvents = function() {
			$(root_this).click(function(ev){

				// Preventing from closing slide when clicking on update image
				if (ev.target.nodeName == 'IMG') {
					ev.stopImmediatePropagation();
					return false;
				}

				// Submitting form to find applied candidates
				if (ev.target.id == 'pv_vac_ref') {
					$("#" + vacancyId).submit();
			        return false;
				}

				$(root_this).find('td.data_container').attr('colspan', '1').removeClass('data_container').html(row_cache.html).parent().find('td').show();
				root_this.find('td:last').css({ 'vertical-align' : 'top' }).find('a').text('[Update]');
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
			// call qtip on a:title's
			$(root_this).redrawQtip();

	        $(".pv_vac_email").unbind('click').click(function(e)
	        {
	            window.location = e.currentTarget.href;
	            e.preventDefault();
	            e.stopPropagation();
	            
	            return false;
	        }); 

			// call QuickSMS
			if ($.fn.quickSMS) {
    			$(root_this).find('a[href*="sms/sms_send.php?cell="]').each(function(k, v){
    				$(this).quickSMS();
    			});
			}	        			
		}; 		
	
		// a small hack so that links events aren't followed through
		root_this.find('a').click(function(){
			window.location.href = $(this).attr('href');
			return false;
		});		
	}
})(jQuery);

$(document).ready(function(){
	// append the pugin to all tr elements
	$('table.list_inner').find('tr.list_a, tr.list_b').each(function(k, v){
		$(this).vacancyPreview();
	});	
});