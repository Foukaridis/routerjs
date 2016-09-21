function checkDuplicates()
{
	link = '/pp/ajax/cpr/check_duplicates.php?=' + $.param({id: document.Client.ID.value, name: document.Client.KnownAs.value, ref_no: document.Client.RegistrationNumber.value, vat_no: document.Client.VATNumber.value});

	$.ajax({
		url: link,		// Make an AJAX request to get duplicate data

		success: function(ajaxReturn)
		{
			var dialog_title = undefined;	// The title of the dialog that's spawned.
			var field = undefined;			// If we have a match on a unique field, this value value will be populated with the filed name.
			var buttons = '';				// If we have a dialog it's going to need buttons.
			var hits = [];					// An array of all the possible duplictes found.
											//
											// 0 => The client's ID in the database.
											// 1 => The machine readable access right that the logged in consultant has to the client.

			var reset = [];					// An array of fields to reset if the dialog is closed without choosing a client to edit or view.
			var focus = undefined;			// Focus can be set to this element if the dialog is closed without choosing a client to edit or view.

			var pointer = 0;				// This value points to the current 

			result = $.parseJSON(ajaxReturn);

			access = result.access;
			result = result.results;

			if (undefined !== result.duplicates_ref) {
				field = 'duplicates_ref';
				dialog_title = 'Warning: The entered company registration number is that of ' + result[field][pointer].ShortName;
				reset.push($('input#RegistrationNumber'));
				focus = $('input#RegistrationNumber');
			} else if (undefined !== result.duplicates_vat) {
				field = 'duplicates_vat';
				dialog_title = 'Warning: The entered company VAT number is that of ' + result[field][pointer].ShortName;
				reset.push($('input#VATNumber'));
				focus = $('input#VATNumber');
			}

			if (result.length == 0) {
				return;
			} else if (undefined !== field) {
				for (var i in result[field]) {
					if (result[field][i].Company_id === $.url().param('ID')) {
						continue;	// This warning is only useful when the match is not the client you're currently editing.
					}

					hits[pointer] = [result[field][i].Company_id, result[field][i].Access];
					buttons += '<input type="radio" id="radio' + i + '" name="radio" value="' + pointer + '" /><label for="radio' + i + '">Discard changes to this client and go to  ' + result[field][i].ShortName + '\'s details.</label>';
					pointer++;
				}

				buttons += '<input type="radio" id="radio' + pointer + '" name="radio" checked="checked" /><label for="radio' + pointer + '">Continue with this client and change the entered number.</label>';
			} else if (undefined !== result.possibles) {
				dialog_title = 'Warning: This client might already be in the database.';

				for (var i in result.possibles) {
					if (result.possibles[i].Company_id === $.url().param('ID')) {
						continue;	// This warning is only useful when the match is not the client you're currently editing.
					}

					hits[pointer] = [result.possibles[i].Company_id, result.possibles[i].Access];
					buttons += '<input type="radio" id="radio' + i + '" name="radio" value="' + pointer + '" /><label for="radio' + i + '">Discard changes to this client and go to  ' + result.possibles[i].ShortName + '\'s details.</label>\n';
					pointer++;
				}

				buttons += '<input type="radio" id="radiox" name="radio" checked="checked" /><label for="radiox">Continue with this client.</label>';
			}

			if (hits.length > 0) {
				modal_node = $(
					'<div />',
					{
						html: '\
		<img src="/img/icons/warning32.png" style="float: left; margin-right: 10px; margin-top: 5px" /> \
		<p style="line-height: 37px;">What would you like to do?</p> \
		<form> \
			<div id="radio">' + buttons + '</div> \
		</form>'
					}
				);

				modal_node.appendTo('body').dialog({
					buttons: {
						"Ok": function()
						{
							if (modal_node.find('input[name=radio]:checked').val() == 'on') {
								// The user does not want to load the existing client, we should reset the values as needed.

								for (var i in reset) {
									reset[i].val('');
								}

								if (undefined !== focus) {
									focus.focus();
								}

								$(this).remove();
							} else {
								if (hits[modal_node.find('input[name=radio]:checked').val()][1] == access.DUPLICATE_ACCESS_UPDATE) {
									window.location.replace('/pp/cpr/client_update.php?' + $.param({ID: hits[modal_node.find('input[name=radio]:checked').val()][0]}));
								} else if (hits[modal_node.find('input[name=radio]:checked').val()][1] == access.DUPLICATE_ACCESS_VIEW) {
									window.location.replace('/pp/cpr/detailFW.php?' + $.param({ID: hits[modal_node.find('input[name=radio]:checked').val()][0]}));
								} else {
									error_dialog = $('\
<div style="text-align: left;"> \
	<img src="/img/icons/block32.png" border="0" align="left" style="padding-right: 10px;" /> \
	<p>It seems that you do not have sufficient privileges to access this client.</p> \
	<p>If feel you should have access to this client you can contact your admistrative user regarding your access level.</p> \
</div>').appendTo('body');

									// load remote content
									error_dialog.dialog({
										autoOpen: true,
										buttons: {
											"Ok": function() { $(this).remove(); }
										},
										draggable: false,
										height: 'auto',
										hide: "drop",
										modal: "true",
										resizable: false,
										show: "drop",
										title: "Access Denied",
										width: 'auto'
									});
								}
							}
						}
					},
					closeOnEscape: false,
					draggable: false,
					height: 'auto',
					modal: true,
					resizable: false,
					title: dialog_title,
					width: 'auto'
				});
				
				// Start of IE8 bugfix where the first and last items are styled as selected when the dialog is spawned.
				//
				// $.browser is deprecated in jQuery 1.9 in favour of feature detection. Unfortunately we're trying to
				// target a bug in a specific browser not a feature. Thanks jQuery, if you weren't enforcing standards
				// good behaviour who knows what crazy stuff we'd get up to.
				if (undefined == $.browser) {
					jQuery.browser = {};
					jQuery.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
					jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
					jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
					jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
				}

				if ($.browser.msie) {
					if (undefined === $.browser.version || parseInt($.browser.version.substring(0, $.browser.version.indexOf('.'))) < 10 ) {
						modal_node.find('div#radio input[name="radio"]').last().focus();
					};
				}
				// End of IE8 bugfix where the first and last items are styled as selected when the dialog is spawned.

				modal_node.parent().find('.ui-dialog-titlebar-close').hide(); // JQuery doesn't have an option to remove their silly titlebar close button.
				modal_node.find("#radio").buttonset();
			}
		},

		async: false,	// This is important to prevent the graph from rendering before data has been fetched
		cache: false
	});
}

$(document).ready(function()
{
	// Let's bind some events.
	$.getScript('/js/lib/purl/purl.js', function() // We need purl.js for this.
	{
		$('input#KnownAs').change(checkDuplicates);
		$('input#RegistrationNumber').change(checkDuplicates);
		$('input#VATNumber').change(checkDuplicates);
	}); 
});