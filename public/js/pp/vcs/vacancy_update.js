$(document).ready(function()
{
	// Open up an Ajax window with loaded content
	$(function()
	{
		$('a.ajax').click(function()
		{
			var url = this.href;
			var dialog = $('<div style="display:none" title="' + this.title + '"></div>').appendTo('body');
			var opts = { position: 'left' };

			dialog.spinner(opts);

			// Load remote content
			dialog.load(
				url,
				{},
	
				function (responseText, textStatus, XMLHttpRequest,$this)
				{
					dialog.dialog({
						autoOpen: true,
						show: "blind",
						hide: "blind",
						height: 650,
						width: 750
					});

					dialog.spinner('remove');
				}
			);

			// Prevent the browser to follow the link
			return false;
		});
	});

	var times_counted = 0;

	$('input[value="To Outlook"]').each(function(k, val)
	{
		var id_number = $(val).attr('id');
		var elm = undefined;

		/**
		 * Behaviour in IE for substr(-1, 1) returns First Character, 
		 * while every other browser on earth returns the Last Character
		 */ 
		id_number = id_number.split('k')[1];

		// Grab element
		if (times_counted == 0) {
			elm = $('#SendOut' + id_number);

			times_counted = 1;
		} else if (times_counted == 1) {
			elm = $('#SendOut2' + id_number); 

			times_counted = 0;
		}

		if (elm.prop('checked') == false) {
			// remove onclick event
			$(val).attr('onclick', '');   
			// add new one, to spawn dialog

			$(val).click(function()
			{
				var dialog = $('\
<div id="dialog_error" title="An error has occured!"> \
	<img src="/img/Actions-window-close-icon.png" style="float: left" title="Error" /><span style="line-height: 50px;">Please click apply first!</span> \
</div>');

				dialog.dialog({
					autoOpen: true,
					show: "blind",
					hide: "blind",
					height: 'auto',
					width: 'auto'
				});
			});
		}
	});

	// Automatically set reminder to "Yes" when a date is filled in.
	if (typeof(document.getElementById('DateYear')) != 'undefined') {
		$('input[id^="Interview"]').each(function(k, v)
		{
			if (/Year/.test($(v).attr('id'))) {
				var index = $(v).attr('id').split('Date');

				index = index[1].split('Year');
				index = index[0];

				$(v).change(function()
				{
					$('#SendOut' + ((/2/.test($(v).attr('id'))) ? '2' : '') + '' + index).attr('checked', 'checked');
				});
			}
		});
	}
});