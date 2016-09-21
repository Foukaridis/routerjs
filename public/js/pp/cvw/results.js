/**
 * Get the return page for this form.
 * 
 * The return page is based on the value stored in the hidden field
 * Vacancy_ID
 *
 * @return array An array representing the page to return to. 0 => A string of the page to return to. 1 => An array of url arguements.
 */
function getReturnPage()
{
	if ('sms' === $('input#Vacancy_ID').val()) {
		return ['/pp/sms/sms_send.php', {}];
	} else if ('lists' === $('input#Vacancy_ID').val()) {
		return ['/pp/cvw/lists_update.php', {'list_id': $('input#list_id').val()}];
	} else {
		return ['/pp/vcs/vacancy_update.php', {ID: $('input#Vacancy_ID').val(), tab: 'referrals', 'referral': ''}];
	}
}

function selectedCandidates2Session(callback)
{
	if ('' === $('input#Vacancy_ID').val()) {
		return true;
	}

	var Candidate_IDs = Array(); // An object containing all the IDs of all matched candidates.

	$("input[name='UseCandidate']:checked").each(function() { Candidate_IDs.push($(this).val()); });

	$.ajax({
		url: '/pp/ajax/cvw/save_candidates_to_session.php',	// Make an AJAX request to save the post data.
		async: false,
		data: {Candidate_IDs: Candidate_IDs},
		success: function(ajaxReturn)
		{
			// Post data saved lets do that callback.
			callback();
		},
		type: 'POST'
	});

	return false;
}

function doSearch(cmd)
{
	document.candidates_list.action = '/pp/cvw/candidate_search.php';
	document.candidates_list.cmd.value = cmd;
	document.candidates_list.submit();
}

function submitCandidates()
{
	if ('' !== $('input#Vacancy_ID').val()) {
		rtpg = getReturnPage();

		selectedCandidates2Session(function() { window.location = rtpg[0] + '?' + $.param($.extend({}, rtpg[1], {referral: 'true'})); });
	}

	return false;
}

function cancel()
{
	rtpg = getReturnPage();
	window.location = rtpg[0] + '?' + $.param($.extend({}, rtpg[1], {referral: 'false'}));
}

/**
 * If the result set is greater than 2000 records too much memory would be
 * consumed to generate the document. Prompt the user with a dialog box and
 * disable the functionality.
 */
function limitDownloads(event)
{
	var date = new Date();
	var hour = date.getHours();

	var resultsFound = $('tr td span:contains("Total Entr")').text().split(' ')[0];

	if ( (resultsFound > 2000) && (hour > 8 || hour < 17) ) {
		event.preventDefault();	// Prevent the link from opening up

		var dialog = $('\
			<div style="text-align: left;"> \
				<img src="/img/icons/stop32.png" border="0" align="left" style="padding-right: 10px;" /> \
				<p>It seems that the result set you are trying to download is larger than 2000 records. Exports are limited between 8am and 5pm</p> \
				<p>Please refine your search and try again. Alternatively, please try again after-hours.</p> \
			</div>').appendTo('body');

		// load remote content
		dialog.dialog({
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
			title: "Export Restricted",
			width: 'auto'
		});

		return false;
	}
}

$(document).ready(function()
{
	// Let's bind some events.
	$('a#DownloadComparison').click(limitDownloads);
	$('a#DownloadContact').click(limitDownloads);
	$('a#DownloadCustom').click(limitDownloads);

	if ('' !== $('input#Vacancy_ID').val()) {
		$('input#Refine').click(function() { selectedCandidates2Session(function () { doSearch('REFINE'); } ); } );
		$('input#New').click(function() { selectedCandidates2Session(function () { doSearch('RESET'); } ); } );
	} else {
		$('input#Refine').click(function() { doSearch('REFINE'); } ); 
		$('input#New').click(function() { doSearch('RESET'); } ); 
	}

	if (0 !== $('input#Add').length) { $('input#Add').click(submitCandidates); }
	if (0 !== $('input#Cancel').length) { $('input#Cancel').click(cancel); }
});