var SubmitTo = '';

function checkDate(forwho)
{
	if (forwho == 'UpdateCJ' && ! confirm('Please note that you cannot change the date of a CareerJunction Advert when updating the advert.\\nClick OK if the dates are correct, or Cancel to abort.')) {
		return false;
	}

	SubmitTo = forwho;

	if (document.Vacancy.AdvertStartDateDay.value.length == 2 && document.Vacancy.AdvertStartDateDay.value.charAt(0) == '0') {
		document.Vacancy.AdvertStartDateDay.value = document.Vacancy.AdvertStartDateDay.value.charAt(1);
	}

	if (document.Vacancy.AdvertEndDateDay.value.length == 2 && document.Vacancy.AdvertEndDateDay.value.charAt(0) == '0') {
		document.Vacancy.AdvertEndDateDay.value = document.Vacancy.AdvertEndDateDay.value.charAt(1);
	}

	if (getFieldValue(Array('AdvertStartDate','date'), 'Vacancy') == '0000-00-00') {
		setFieldValue(Array('AdvertStartDate','date'), 'Vacancy', moment().format('YYYY-MM-DD'));
		// only populate end date if start date was also not empty.. otherwise the script should complain.

		if (getFieldValue(Array('AdvertEndDate','date'), 'Vacancy')== '0000-00-00') {
			setFieldValue(Array('AdvertEndDate','date'), 'Vacancy', moment().add('days', 30).format('YYYY-MM-DD'));
		}
	}

	if (forwho != '' && verifyVacancy()) {
		document.Vacancy.cmd.value = forwho;

		return document.Vacancy.submit();
	}

	SubmitTo = '';
	document.Vacancy.cmd.value = '';

	return false;
}

function validateGeneralAd()
{
	msg = '';

	var PayMin = document.getElementById('PayMin').value;
	var PayMax = document.getElementById('PayMax').value;

	if (PayMin != '' && PayMax != '') {
		PayMin = new Number(PayMin);
		PayMax = new Number(PayMax);

		if (! isNaN(PayMin) && ! isNaN(PayMax) && PayMin > PayMax) {
			msg += ' -  Advertised Remuneration Amount (Minimum must be less than Maximum)\\n';
		}
	}

	return msg;
}

/**
 * Error Message when users don't have access to social media integration
 */
$(function()
{
	$('.userSocialMedia, *[data-islive="0"]').click(function(event)
	{
		event.preventDefault(); //Prevent the link from opening up

		if ($(this).data('islive') == '0') {
			var dialog = $('<div title="Advert not visible!"><img src="/img/Actions-window-close-icon.png" border="0" align="left" style="padding-right: 10px;" /> You cannot share an advert to a social media site while the advert is not visible</div>');
		}  else {
			var dialog = $('<div style="text-align: left;" title="' + $(this).data('title') + '"><img src="/img/Actions-window-close-icon.png" border="0" align="left" style="padding-right: 10px;" />It seems that you have insufficient privileges to access this social media link. Please contact your super user for further assistance.</div>').appendTo('body');
		}
		
		// load remote content

		dialog.dialog({
			autoOpen: true,
			show: "drop",
			hide: "drop",
			width: 'auto',
			height: 'auto',
		});

		return false;
	});
});

$(document).ready(function()
{
	VacancyChildFunctions[VacancyChildFunctions.length] = 'validateGeneralAd';

	var startDate = new Date($('#AdvertStartDateYear').val(),$('#AdvertStartDateMonth').val(),$('#AdvertStartDateDay').val());
	var endDate = new Date($('#AdvertEndDateYear').val(),$('#AdvertEndDateMonth').val(),$('#AdvertEndDateDay').val());
	var advertVisible = $("#WebAdvert").is(":checked");
	var sources = $(".previewAdvertLive").parent().text();

	if (endDate < startDate && advertVisible) {
		var msg = 'It seems that your advert\'s expiry date is set prior to the actual start date. Please double check this! <br/><br/>This advert will not be published to: '+sources;
		var dialog = $('<div style="text-align: left;" title="Invalid Advertising Date Range Saved!"><img src="/img/Actions-window-close-icon.png" border="0" align="left" style="padding-right: 10px;" />'+msg+'</div>').appendTo('body');

		// Load remote content
		dialog.dialog({
			autoOpen: true,
			show: "drop",
			hide: "drop",
			width: 'auto',
			height: 'auto',
		});

		$('#AdvertEndDateDay').focus();
	}
	
	//PNet Notice
	$("#pnetImportantNotice").click(function(){
		//You have sent through more than 3 requests for this advert reference.
		var msg = 'Please note that PNet does not allow more than 3 updates per advert reference per user.<br /><br />Once your threshold has been reached you will no longer be able to update this record.<br /><br />You are welcome to contact your account manager at PNet should you require more information.';
		var dialog = $('<div style="text-align: left;" title="' + $(this).data('title') + '"><img src="/img/icons/lightbulb32.png" border="0" align="left" style="padding-right: 10px;" />'+msg+'</div>').appendTo('body');

		// Load remote content
		dialog.dialog({
			autoOpen: true,
			show: "drop",
			hide: "drop",
			width: 'auto',
			height: 'auto',
		});
		
	});
	;
});