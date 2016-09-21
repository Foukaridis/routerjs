/* 
 * Candidate Preview module
 * Written as a jQuery plugin for convenience.
 * 
 * @author Ferdi Schmidt <ferdi@parallel.co.za>
 * @adapted Lehan Coetzee <lehan@parallel.co.za>
 * @copyright 2012, Parallel Software Pty. Ltd. * 
 */
(function($){
	$.fn.clientPreview = function(indiv_settings){
		
		$this = $(this);
		var root_this = this;
		
		var defaults = {
			colspan	: 8,
			url		: '/pp/ajax/cpr/client_preview.php?id=:id',
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
		
		var client_aref = document.createElement('a');
		client_aref.href = $row_aref.attr('href');
		
		var clientId = client_aref.search.split('=')[1];
		if (clientId.indexOf('&') !== -1) {
			clientId = clientId.split('&')[0];
		}
		
		// Hover states
		(function(){
			$(root_this).hover(
				function(){
					// Do not show the toggle div when the row is open.
					if ($(this).find('td').find('a').length > 1) {
						// In case offset changes due to multiple open previews
						$(this).find('.untoggle').css('top', ($(root_this).offset().top -4 ) + 'px');
						$(this).find('.untoggle').fadeIn();
						return;
					}
					
					// if you're bored some day, comment out the following line. :D
					// Oh how I laughed
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
			root_this.find('td').hide();	

			row_cache.html = $container.html();
			$container.show();
			$container.attr('colspan', settings.colspan);
			
			$container.html($('<div class="loader"><img src="/img/ui/load.gif" /> ' + $container.text() + '</div>'));
			$.ajax({
				dataType: 'json',
				cache: settings.cache,
				url: settings.url.replace(':id', clientId),
				success: checkCustomError,
				error: requestFailed
			});
			
			// show be the last possible action
			releaseRowEvents();
		};

		var checkCustomError = function(data) {
			if (data == "Access Restricted") {
		        var dialogv = $('<div style="display: none" title="Access Restricted"><img src="/img/icons/stop32.png" style="float: left; margin-right :10px;" />You are not allowed to view this client.</div>');
		        dialogv.dialog({
		                        modal : true,
		                        autoOpen: true,
		                        height: "150",
		                        width: "450",
		                        closeOnEscape: true,
		                        draggable: false,
		                        resizable: false,
		                        buttons: [ { text: "Ok", click: function() { $( this ).dialog( "close" ); } } ]
                });		
				requestFailed();
			} else if (data == "exception") {
		        var dialogv = $('<div style="display: none" title="Processing Error"><img src="/img/icons/stop32.png" style="float: left; margin-right :10px;" />There was an error processing your request.</div>');
		        dialogv.dialog({
		                        modal : true,
		                        autoOpen: true,
		                        height: "150",
		                        width: "450",
		                        closeOnEscape: true,
		                        draggable: false,
		                        resizable: false,
		                        buttons: [ { text: "Ok", click: function() { $( this ).dialog( "close" ); } } ]
                });	
                requestFailed();	
			} else {
				buildTable(data);
			}
		};		
		
		
		var buildTable = function(data) {

			var $container = $(root_this).find('.data_container');

			$container.find('.loader').remove();
			$container.html(
				$('<table />').append(
					$('<tr />').css("border-top", "1px solid #888")
					.append($('<td />').addClass('details'))
					.append($('<td />').addClass('classification'))
					.append($('<td />').addClass('branches'))
					.append($('<td />').addClass('client_preview_links'))
					).append($('<tr />').append($('<td colspan="4" />').addClass('contacts')).append('<span class="untoggle" style="margin: 0;margin-left: -' + (($(root_this).width() / 2 + 60)) + 'px;top: ' + ($(root_this).offset().top -4 )+ 'px">Show Less</span>')).hide()
				);			
				
			// proxy the data through again.
			populateTable(data);
		};
		
		var populateTable = function(data) {
			var $table = $(root_this).find('.data_container').find('table');		

			var details = $('<ul />');

			details
			.append( $('<li />').html('<span class="spacer">Name</span><span  title="'  + data.shortName + '">' + ((data.shortName.length >= 23) ? data.shortName.slice(0, 23) + '...' : data.shortName) + '</span>') )
			.append( $('<li />').html('<span class="spacer">Official Name</span><span  title="'  + data.registeredName + '">' + ((data.registeredName.length > 23) ? data.registeredName.slice(0, 23) + '...' : data.registeredName) + '</span>') )
			.append( $('<li />').html('<span class="spacer">Consultant</span>' + data.consultant) )
			.append( $('<li />').html('<span class="spacer">Reg Number</span>' + data.regNum) )
			.append( $('<li />').html('<span class="spacer">VAT Number</span>' + data.vatNum) )
			.append( $('<li />').html('<span class="spacer">Telephone</span>' + data.tel) )
			.append( $('<li />').html('<span class="spacer">Fax</span>' + data.fax) )
			.append( $('<li />').html('<span class="spacer">Email</span><a href="mailto:' + data.email + ' " title="' + data.email + '" class="company_email">' + data.email + '</a>' ) )
			.append( $('<li />').html('<span class="spacer">Website</span><a href="http://' +  data.website + '" target="_blank" class="company_website">' + data.website + '</a>') ),

			classification = $('<ul />')
			.append( $('<li />').html('<span class="spacer">Status</span>' + data.status) )
			.append( $('<li />').html('<span class="spacer">Industry</span>' + data.industry) )	
			.append( $('<li />').html('<span class="spacer">Size</span>' + data.size) )	
			.append( $('<li />').html('<span class="spacer">Region</span>' + data.region) )
			.append( $('<li />').html('<span class="spacer">City/Town</span>' + data.location) )
			.append( $('<li />').html('<span class="spacer">Address</span>' + data.address1.replace(new RegExp('<br />', 'g'), '<br /><span class="addr_spacer">') + '</span>') )

			var branches = $('<div class="div-table">');

			// Check if any branches have been returned
			if (data.branchesShort == '-') {
				branches
				.html(data.shortName + ' has no branches listed');
			} else {
				branches
				.html('<div class="branch-head">Branch</div><div class="tel-head">Tel</div><br />')
				$.each(data.branchesShort, function(k, v){
					branches
					.append($('<div />').addClass('branch-title').html('<span title="' + v[0] + '">' + ((v[0].length > 37) ? v[0].slice(0, 37) + '...' : v[0]) + '</span>'))
					.append($('<div />').addClass('tel-title').html(v[1]))
					.append($('<br />'))
				;
				});
				branches.append('</div>')
			}

			var client_preview_links = $('<ul />');

			client_preview_links
			.append( $('<li />').html('<img src="/img/icons/contactcard32.png" id="client_preview_profile" style="width: 22px; height: 22px; vertical-align: middle; " />') );
			root_this.find('td.client_preview_links').parent().find('td').addClass('row_select');

			var contacts = $('<div class="div-table">');

			// Check if any contacts have been returned
			if (data.contactsShort == '-') {
				contacts
				.html(data.shortName + ' has no contacts listed');
			} else {
				contacts
				.html('<div class="div-table-head" style="width: 125px;">Name</div><div class="div-table-head">Branch</div><div class="div-table-head">Designation</div><div class="div-table-head-tel">Tel</div><div class="div-table-head-tel">Cell</div><div class="div-table-head" style="width: 175px;">Email</div><br />')
				$.each(data.contactsShort, function(k, v){
					contact_full_name = v[0] + ' ' + v[1];
					contacts
					.append($('<div />').addClass('title').css('width', '125px').html('<span title="' + v[7] + '">' + ((contact_full_name.length > 20) ? contact_full_name.slice(0, 20) + '...' : contact_full_name)))
					.append($('<div />').addClass('title').html('<span title="' + v[2] + '">' + ((v[2].length > 30) ? v[2].slice(0, 30) + '...' : v[2]) + '</span>'))
					.append($('<div />').addClass('title').html(((v[3].length >= 30) ? v[3].slice(0, 30) + '...' : v[3])))
					.append($('<div />').addClass('title-tel').html(v[4]))
					.append($('<div />').addClass('title-tel').html('<a style="color: blue" title="Send an SMS" href="/pp/sms/sms_send.php?cell=' + v[5] + '&amp;name=' + v[0] + ' ' + v[1] + '&amp;RTPG=/pp/cpr/results.php">' + v[5] + '</a>'))
					.append($('<div />').addClass('title').css('width', '175px').html('<a href="mailto:' + v[6] + ' " title="' + v[6] + '" class="contact_email">' + ((v[6].length > 30) ? v[6].slice(0, 30) + '...' : v[6]) + '</a>' ))
					.append($('<br />'))
				;
				});
			}					

			details.appendTo($table.find('.details').html('<h4>Details</h4>'));
			classification.appendTo($table.find('.classification').append('<h4>Classification</h4>'));
			branches.appendTo($table.find('.branches').html('<h4>Branches/Divisions</h4>'));
			client_preview_links.addClass('row_select');
			client_preview_links.appendTo($table.find('.client_preview_links'));
			client_preview_links.css("width", "61");
			$(".client_preview_links").css("vertical-align", "middle");
			$(".client_preview_links").css("text-align", "center");
			contacts.appendTo($table.find('.contacts').html('<h4>Contacts</h4>'));

			if (data.contactsAmnt > 3) {
				contacts.append('<div class="preview_link_container"><a href="#" class="previewContacts">Show All Contacts</a></div>');
			}

			if (data.branchesAmnt > 7) {
				branches.append('<div class="preview_link_container"><a href="#" class="previewBranches">Show All Branches</a></div>');
			}			

			attachEvents(data);
			
			// last possible event to fire.
			$table.fadeIn();
			
		};
		
		var releaseRowEvents = function() {
			$(root_this).click(function(){
				$(root_this).find('td.data_container').attr('colspan', '1').removeClass('data_container').html(row_cache.html).parent().find('td').show();
				root_this.find('td:last').css({ 'vertical-align' : 'top' }).find('a').text('[Details]').parent().find('a.previewContacts').remove();
				root_this.find('td:last').css({ 'vertical-align' : 'top' }).find('a').text('[Details]').parent().find('a.previewBranches').remove();
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
			root_this.find('a.previewContacts').click(function(){
				
				var name = data.shortName + ((data.shortName.slice(-1) == 's') ? '\'' : '\'s') + ' Contacts';

				row_cache.dialog = $('<div />', { title: name, 'class' : 'contactsPreviewDialog' })
					.append('<div class="preview_header">Contacts</div>')
					.append('<div class="div-table"><div class="div-table-head" style="width: 125px;">Name</div><div class="div-table-head">Branch</div><div class="div-table-head">Designation</div><div class="div-table-head-tel">Tel</div><div class="div-table-head-tel">Cell</div><div class="div-table-head">Email</div><br />');
					$.each(data.contactsFull, function(k, v){
						contact_full_name = v[0] + ' ' + v[1];
						row_cache.dialog
						.append($('<div />').addClass('title').css('width', '125px').html('<span title="' + v[7] + '">' + ((contact_full_name.length > 17) ? contact_full_name.slice(0, 17) + '...' : contact_full_name)))
						.append($('<div />').addClass('title').html('<span title="' + v[2] + '">' + ((v[2].length > 20) ? v[2].slice(0, 20) + '...' : v[2]) + '</span>'))
						.append($('<div />').addClass('title').html(((v[3].length > 20) ? v[3].slice(0, 20) + '...' : v[3])))
						.append($('<div />').addClass('title-tel').html(v[4]))
						.append($('<div />').addClass('title-tel').html('<a style="color: blue" title="Send an SMS" href="/pp/sms/sms_send.php?cell=' + v[5] + '&amp;name=' + v[0] + ' ' + v[1] + '&amp;RTPG=/pp/cpr/results.php">' + v[5] + '</a>'))
						.append($('<div />').addClass('title').html('<a href="mailto:' + v[6] + ' " title="' + v[6] + '" class="contact_email">' + ((v[6].length > 25) ? v[6].slice(0, 25) + '...' : v[6]) ))
						.append($('<br />'))
					;
					});

				row_cache.dialog.dialog({ modal: false, width: 857, resizable: false });
				return false;
			});

			root_this.find('a.previewBranches').click(function(){
				
				var name = data.shortName + ((data.shortName.slice(-1) == 's') ? '\'' : '\'s') + ' Contacts';

				row_cache.dialog = $('<div />', { title: name, 'class' : 'branchesPreviewDialog' })
					.append('<div class="preview_header">Branches</div>')
					.append('<div class="branch-head">Branch</div><div class="tel-head">Tel</div><br />');
					$.each(data.branchesFull, function(k, v){					
						row_cache.dialog
						.append($('<div />').addClass('branch-title').html('<span title="' + v[0] + '">' + ((v[0].length > 75) ? v[0].slice(0, 75) + '...' : v[0]) + '</span>'))
						.append($('<div />').addClass('tel-title').html(v[1]))
						.append($('<br />'))
					;
					});

				row_cache.dialog.dialog({ modal: false, width: 450, resizable: false });
				return false;
			});
			

            $("#client_preview_profile").click(function(e)
            {
                window.location = client_aref.href;
                e.preventDefault();
                e.stopPropagation();
                
                return false;
            });

             $(".company_website").click(function(e)
            {
                window.open(e.currentTarget.href, '_blank');
                e.preventDefault();
                e.stopPropagation();
                
                return false;
            });             

            $(".contact_email").unbind('click').click(function(e)
            {
                window.location = e.currentTarget.href;
                e.preventDefault();
                e.stopPropagation();
                
                return false;
            });      

            $(".company_email").unbind('click').click(function(e)
            {
                window.location = e.currentTarget.href;
                e.preventDefault();
                e.stopPropagation();
                
                return false;
            });  

            $(".clients_show_more").click(function(e)
            {
           		$(".div-table").css("height", "78px");
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
	
	// append the plugin to all tr elements
	$('table.list_inner').find('tr.list_a, tr.list_b').each(function(k, v){
		$(this).clientPreview();
	});
});

