$(document).ready(function()
{
	$.getScript("/js/lib/jquery-postmessage.0.5.js", function()
	{
		iframes = $('iframe');

		iframes.each(function() {
			iframe = $(this);
			src = iframe.attr('src') + '#' + encodeURIComponent(document.location.href);
			iframe.attr('src', src);
		});

		$.receiveMessage(function(e)
		{
			var dashboard = jQuery.parseJSON(e.data),

			h = dashboard.height,

			iframe = $('iframe');

			if (! isNaN(h) && h > 0) {
				// Height has changed, update the iframe.
				iframe.height(h);
			}
		});
	});
});